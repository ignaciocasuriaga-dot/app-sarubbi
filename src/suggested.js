import { existsSync, readFileSync } from 'node:fs';
import { ALL_BRANDS, stripAccents } from './brands.js';

const SUGGESTED_PATH = process.env.SUGGESTED_PATH || 'data/suggested/precios_sugeridos.csv';
const DEFAULT_TOLERANCE_PCT = 0.5;
const STOP_WORDS = new Set([
  'sarubbi', 'schneck', 'centenario', 'cattivelli', 'ottonello', 'camposur', 'constancia', 'picorel',
  'jamon', 'cocido', 'crudo', 'fiambre', 'feteado', 'fetas', 'pancho', 'panchos',
  'frankfurter', 'salchicha', 'salame', 'salamin', 'chorizo', 'mortadela', 'panceta',
  'hamburguesa', 'empanada', 'producto', 'pack', 'unidad', 'unidades',
  'kg', 'kilo', 'kilos', 'gr', 'g', 'gramos', 'un', 'u',
  'de', 'del', 'la', 'el', 'los', 'las', 'con', 'sin', 'y', 'al', 'para', 'x',
]);

const STORE_ALIASES = new Map([
  ['tata', 'tata'],
  ['ta ta', 'tata'],
  ['ta-ta', 'tata'],
  ['disco', 'disco'],
  ['devoto', 'devoto'],
  ['geant', 'geant'],
  ['el dorado', 'eldorado'],
  ['eldorado', 'eldorado'],
  ['tienda inglesa', 'tiendainglesa'],
  ['tiendainglesa', 'tiendainglesa'],
  ['frog', 'frog'],
  ['tamisur', 'tamisur'],
  ['ubesur', 'ubesur'],
  ['kinko', 'kinko'],
  ['macro mercado', 'macromercado'],
  ['macromercado', 'macromercado'],
  ['macro', 'macromercado'],
  ['manual', 'manual'],
]);

const HEADER_ALIASES = {
  super: ['super', 'cadena', 'supermercado', 'tienda', 'store'],
  sku: ['sku', 'codigo', 'cod_sku', 'codigo_sku', 'id_producto', 'id'],
  brand: ['marca', 'brand'],
  category: ['categoria', 'category', 'rubro'],
  product: ['producto', 'nombre', 'descripcion', 'descripcion_producto', 'articulo'],
  suggestedPrice: ['pvp_sugerido', 'precio_sugerido', 'suggestedPrice', 'referencia', 'precio_referencia', 'pvs', 'pvp', 'precio'],
  source: ['fuente', 'origen', 'lista', 'archivo'],
  note: ['nota', 'observacion', 'comentario'],
};

let cache = null;

function norm(value) {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function headerKey(value) {
  return norm(value).replace(/\s+/g, '_');
}

function numberOrNull(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  let s = String(value).trim().replace(/[^\d,.-]/g, '');
  if (!s) return null;
  const comma = s.lastIndexOf(',');
  const dot = s.lastIndexOf('.');
  if (comma >= 0 && dot >= 0) {
    s = comma > dot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if (comma >= 0) {
    s = s.replace(',', '.');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function csvDelimiter(text) {
  const firstLine = String(text).split(/\r?\n/, 1)[0] || '';
  return (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
}

function csvRows(text, delimiter = csvDelimiter(text)) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') cell += ch;
  }
  row.push(cell);
  if (row.some((v) => String(v).trim() !== '')) rows.push(row);
  return rows;
}

function recordsFromCsv(text) {
  const rows = csvRows(text).filter((row) => row.some((cell) => String(cell).trim() !== ''));
  if (!rows.length) return [];
  const headers = rows[0].map(headerKey);
  return rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((key, index) => {
      record[key] = row[index] ?? '';
    });
    return record;
  });
}

function pick(record, aliases) {
  for (const alias of aliases) {
    const key = headerKey(alias);
    if (record[key] != null && String(record[key]).trim() !== '') return record[key];
  }
  return '';
}

function normalizeStore(value) {
  const normalized = norm(value);
  if (!normalized) return null;
  if (['todos', 'todas', 'all', 'global'].includes(normalized)) return 'all';
  return STORE_ALIASES.get(normalized) || null;
}

function normalizeStoreList(value) {
  if (Array.isArray(value)) return [...new Set(value.map(normalizeStore).filter(Boolean))];
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  const parts = raw.split(/[;|/]+/).map(normalizeStore).filter(Boolean);
  if (parts.includes('all')) return [...new Set(STORE_ALIASES.values())];
  return [...new Set(parts)];
}

function normalizeBrand(value) {
  const normalized = norm(value);
  if (!normalized) return null;
  for (const brand of ALL_BRANDS) {
    if (norm(brand) === normalized) return brand;
  }
  return null;
}

function comparableProfile(value) {
  const text = norm(value).replace(/(\d),(\d)/g, '$1.$2');
  let m = text.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilos)\b/);
  if (m) return { unit: 'g', value: Math.round(Number(m[1]) * 1000) };
  m = text.match(/(\d+(?:\.\d+)?)\s*(g|gr|gramos)\b/);
  if (m) return { unit: 'g', value: Math.round(Number(m[1])) };
  m = text.match(/\bx\s*(\d+)\b/) || text.match(/(\d+)\s*(u|un|unid|unidades)\b/);
  if (m) return { unit: 'u', value: Number(m[1]) };
  return null;
}

function sizeScore(rowSize, itemSize) {
  if (!rowSize) return 0;
  if (!itemSize || rowSize.unit !== itemSize.unit) return null;
  const ratio = Math.min(rowSize.value, itemSize.value) / Math.max(rowSize.value, itemSize.value);
  if (ratio < 0.82) return null;
  return 30 + Math.round(ratio * 10);
}

function tokens(value) {
  return norm(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function overlapScore(row, item) {
  const wanted = new Set(tokens(row.product));
  const got = new Set(tokens(item.name));
  if (!wanted.size) return 0;
  let overlap = 0;
  for (const token of wanted) if (got.has(token)) overlap += 1;
  const ratio = overlap / wanted.size;
  if (ratio === 0) return null;
  return Math.round(ratio * 30);
}

function rowFromRecord(record, index) {
  const stores = normalizeStoreList(pick(record, HEADER_ALIASES.super));
  const product = String(pick(record, HEADER_ALIASES.product)).trim();
  const brand = normalizeBrand(pick(record, HEADER_ALIASES.brand));
  const category = headerKey(pick(record, HEADER_ALIASES.category)) || '';
  const suggestedPrice = numberOrNull(pick(record, HEADER_ALIASES.suggestedPrice));
  const sku = String(pick(record, HEADER_ALIASES.sku)).trim();
  if (suggestedPrice == null || (!sku && !product) || !stores.length) return null;
  return {
    index,
    stores,
    sku,
    brand,
    category,
    product,
    productNorm: norm(product),
    profile: comparableProfile(product),
    suggestedPrice,
    source: String(pick(record, HEADER_ALIASES.source)).trim() || SUGGESTED_PATH,
    note: String(pick(record, HEADER_ALIASES.note)).trim(),
  };
}

function rowsFromJson(parsed) {
  return (parsed.rows || []).map((row, index) => ({
    index,
    stores: normalizeStoreList(row.stores || row.super || row.cadena || 'all'),
    sku: String(row.sku || '').trim(),
    brand: normalizeBrand(row.brand || row.marca),
    category: headerKey(row.category || row.categoria || ''),
    product: String(row.product || row.producto || row.name || row.nombre || '').trim(),
    productNorm: norm(row.product || row.producto || row.name || row.nombre || ''),
    profile: comparableProfile(row.product || row.producto || row.name || row.nombre || ''),
    suggestedPrice: numberOrNull(row.suggestedPrice ?? row.pvp ?? row.precio),
    source: row.source || row.fuente || parsed.sourceFile || SUGGESTED_PATH,
    note: row.note || row.nota || '',
  })).filter((row) => row.suggestedPrice != null && row.stores.length && (row.sku || row.product));
}

function loadSuggestedSource() {
  if (cache) return cache;
  if (!existsSync(SUGGESTED_PATH)) {
    cache = { sourceFile: null, importedAt: null, tolerancePct: DEFAULT_TOLERANCE_PCT, rows: [], rowsWithSuggested: [] };
    return cache;
  }

  const text = readFileSync(SUGGESTED_PATH, 'utf8');
  let parsed = null;
  if (/\.json$/i.test(SUGGESTED_PATH)) {
    parsed = JSON.parse(text);
  }
  const rows = parsed
    ? rowsFromJson(parsed)
    : recordsFromCsv(text).map(rowFromRecord).filter(Boolean);

  cache = {
    sourceFile: parsed?.sourceFile || SUGGESTED_PATH,
    importedAt: parsed?.importedAt || new Date().toISOString(),
    tolerancePct: numberOrNull(parsed?.tolerancePct) ?? DEFAULT_TOLERANCE_PCT,
    rows,
    rowsWithSuggested: rows.filter((row) => row.suggestedPrice != null),
  };
  return cache;
}

function scoreRow(row, item) {
  if (!row.stores.includes(item.super)) return null;
  if (row.brand && row.brand !== item.brand) return null;
  if (row.category && item.category && row.category !== item.category) return null;
  if (row.sku && String(row.sku) === String(item.sku)) return 100;
  const size = sizeScore(row.profile, comparableProfile(item.name));
  if (size == null) return null;
  const overlap = overlapScore(row, item);
  if (overlap == null) return null;
  return (row.brand ? 25 : 8) + size + overlap;
}

export function matchSuggested(item) {
  if (!item || item.group !== 'sarubbi' || item.price == null) return null;
  const source = loadSuggestedSource();
  let best = null;
  for (const row of source.rowsWithSuggested) {
    const score = scoreRow(row, item);
    if (score == null) continue;
    if (!best || score > best.score) best = { row, score };
  }
  return best?.row || null;
}

export function applySuggestedPrices(items) {
  const source = loadSuggestedSource();
  return (items || []).map((item) => {
    const row = matchSuggested(item);
    if (!row) return item;
    const deviation = row.suggestedPrice
      ? ((Number(item.price) - row.suggestedPrice) / row.suggestedPrice) * 100
      : null;
    const tolerance = source.tolerancePct ?? DEFAULT_TOLERANCE_PCT;
    const status = deviation == null ? null : deviation > tolerance ? 'above' : deviation < -tolerance ? 'below' : 'ok';
    return {
      ...item,
      suggestedPrice: row.suggestedPrice,
      suggestedDeviationPct: deviation == null ? null : Number(deviation.toFixed(2)),
      suggestedStatus: status,
      suggestedSource: row.source,
      suggestedProduct: row.product,
      suggestedNote: row.note || '',
    };
  });
}

export function suggestedSummary(items) {
  const source = loadSuggestedSource();
  const matched = (items || []).filter((item) => item.suggestedPrice != null);
  const counts = {
    ok: matched.filter((item) => item.suggestedStatus === 'ok').length,
    above: matched.filter((item) => item.suggestedStatus === 'above').length,
    below: matched.filter((item) => item.suggestedStatus === 'below').length,
  };
  const byStore = {};
  for (const item of matched) {
    const store = item.super || 'sin_cadena';
    byStore[store] ??= { matched: 0, ok: 0, above: 0, below: 0 };
    byStore[store].matched += 1;
    if (item.suggestedStatus) byStore[store][item.suggestedStatus] += 1;
  }
  return {
    sourceFile: source.sourceFile,
    importedAt: source.importedAt,
    tolerancePct: source.tolerancePct,
    totalRows: source.rows.length,
    rowsWithSuggested: source.rowsWithSuggested.length,
    matchedItems: matched.length,
    ...counts,
    byStore,
  };
}
