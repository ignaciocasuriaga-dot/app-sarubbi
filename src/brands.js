// Portfolio Sarubbi + competidores para monitoreo retail Uruguay.

export const CATEGORY_LABEL = {
  jamon_cocido: 'Jamon cocido',
  jamon_crudo: 'Jamon crudo',
  panchos: 'Panchos y frankfurters',
  salames: 'Salames y salamini',
  chorizos: 'Chorizos',
  mortadela: 'Mortadela',
  panceta: 'Panceta',
  fiambres: 'Fiambres y feteados',
  hamburguesas: 'Hamburguesas',
  empanadas: 'Empanadas',
  carnes: 'Carnes y cortes',
  congelados: 'Congelados',
  otros: 'Otros chacinados',
};

export const OWNER_LABEL = {
  sarubbi: 'Sarubbi',
  competencia: 'Competencia',
};

export const COMPANY_LABEL = {
  sarubbi: 'Sarubbi',
  schneck: 'Schneck',
  centenario: 'Alimentos Centenario',
  cattivelli: 'Cattivelli',
  ottonello: 'Ottonello',
  camposur: 'Camposur',
  constancia: 'La Constancia',
  picorel: 'Picorel',
};

export const STORE_LABEL = {
  tata: 'Ta-Ta',
  tiendainglesa: 'Tienda Inglesa',
  disco: 'Disco',
  devoto: 'Devoto',
  geant: 'Geant',
  eldorado: 'El Dorado',
  frog: 'Frog',
  tamisur: 'Tamisur',
  ubesur: 'Ubesur',
  kinko: 'Kinko',
  macromercado: 'Macro Mercado',
  macro: 'Macro Mercado',
  elvencedor: 'El Vencedor',
  manual: 'Carga manual',
};

const CATEGORY_HINTS = [
  { category: 'jamon_crudo', words: ['jamon crudo', 'serrano', 'prosciutto'] },
  { category: 'jamon_cocido', words: ['jamon cocido', 'jamon york', 'paleta cocida'] },
  { category: 'panchos', words: ['pancho', 'panchos', 'frankfurter', 'frankfurters', 'frankfurt', 'salchicha', 'viena', 'super pancho'] },
  { category: 'salames', words: ['salame', 'salami', 'salamin', 'salamines', 'fuet', 'longaniza', 'cantimpalo', 'chacarero'] },
  { category: 'chorizos', words: ['chorizo', 'chorizos', 'choricito', 'parrillero'] },
  { category: 'mortadela', words: ['mortadela', 'mortadelin', 'mortadella', 'pate'] },
  { category: 'panceta', words: ['panceta', 'pancetta', 'bacon'] },
  { category: 'hamburguesas', words: ['hamburguesa', 'hamburguesas', 'burger', 'burguer'] },
  { category: 'empanadas', words: ['empanada', 'empanadas'] },
  { category: 'carnes', words: ['asado', 'vacio', 'matambre', 'bondiola', 'lomo', 'pulpa', 'nalga', 'colita', 'bife', 'entrecot', 'costilla', 'baby ribs', 'ribs'] },
  { category: 'congelados', words: ['congelado', 'congelada', 'congeladas'] },
  { category: 'fiambres', words: ['fiambre', 'feteado', 'fetas', 'feta', 'lomito', 'lomo', 'arrolado', 'pastron', 'pastrami'] },
];

const BRAND_DEFINITIONS = [
  brand('sarubbi', 'Sarubbi', 'sarubbi', 'sarubbi', ['sarubbi']),
  brand('schneck', 'Schneck', 'competencia', 'schneck', ['schneck', 'shneck']),
  brand('centenario', 'Alimentos Centenario', 'competencia', 'centenario', ['centenario', 'alimentos centenario']),
  brand('cattivelli', 'Cattivelli', 'competencia', 'cattivelli', ['cattivelli', 'cativelli']),
  brand('ottonello', 'Ottonello', 'competencia', 'ottonello', ['ottonello', 'otonello']),
  brand('camposur', 'Camposur', 'competencia', 'camposur', ['camposur', 'campo sur']),
  brand('constancia', 'La Constancia', 'competencia', 'constancia', ['la constancia', 'constancia']),
  brand('picorel', 'Picorel', 'competencia', 'picorel', ['picorel', 'picorell']),
];

function brand(name, label, owner, company, aliases) {
  return { name, label, owner, company, aliases };
}

export const BRAND_META = Object.fromEntries(BRAND_DEFINITIONS.map((b) => [b.name, b]));

export const BRAND_GROUPS = {
  sarubbi: BRAND_DEFINITIONS.filter((b) => b.owner === 'sarubbi').map((b) => b.name),
  competencia: BRAND_DEFINITIONS.filter((b) => b.owner === 'competencia').map((b) => b.name),
};

export const ALL_BRANDS = BRAND_DEFINITIONS.map((b) => b.name);

export const CATEGORY_GROUPS = Object.fromEntries(
  Object.keys(CATEGORY_LABEL).map((category) => [
    category,
    category === 'carnes'
      ? ['camposur', 'constancia', 'sarubbi']
      : ALL_BRANDS,
  ]),
);

export const SEARCH_TERMS = [
  ...new Set([
    ...BRAND_DEFINITIONS.flatMap((b) => b.aliases),
    'jamon',
    'jamon cocido',
    'jamon crudo',
    'paleta',
    'fiambre',
    'feteado',
    'panchos',
    'frankfurter',
    'salchicha',
    'salame',
    'salamin',
    'chorizo',
    'mortadela',
    'panceta',
    'hamburguesa',
    'empanada',
    'asado',
    'vacio',
    'matambre',
    'bondiola',
    'baby ribs',
  ]),
];

export function normalizeProductText(value) {
  let text = String(value ?? '');
  if (/[\u00c3\u00c2\u00e2]/.test(text)) {
    const repaired = Buffer.from(text, 'latin1').toString('utf8');
    if (!repaired.includes('\uFFFD')) text = repaired;
  }
  const mojibakePairs = [
    ['\u00c3\u00a1', '\u00e1'],
    ['\u00c3\u00a9', '\u00e9'],
    ['\u00c3\u00ad', '\u00ed'],
    ['\u00c3\u00b3', '\u00f3'],
    ['\u00c3\u00ba', '\u00fa'],
    ['\u00c3\u00b1', '\u00f1'],
    ['\u00c3\u0081', '\u00c1'],
    ['\u00c3\u0089', '\u00c9'],
    ['\u00c3\u008d', '\u00cd'],
    ['\u00c3\u0093', '\u00d3'],
    ['\u00c3\u009a', '\u00da'],
    ['\u00c3\u0091', '\u00d1'],
  ];
  for (const [from, to] of mojibakePairs) text = text.split(from).join(to);
  return text.replace(/\s+/g, ' ').trim();
}

export function stripAccents(value) {
  return normalizeProductText(value).normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function norm(value) {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function aliasPattern(alias) {
  return norm(alias)
    .split(/\s+/)
    .map(escapeRegex)
    .join('[\\s-]+');
}

function hasAny(text, words) {
  return words.some((word) => new RegExp(`\\b${aliasPattern(word)}\\b`, 'i').test(text));
}

const MATCHERS = BRAND_DEFINITIONS.flatMap((brandDef) =>
  brandDef.aliases.map((alias) => ({
    brand: brandDef.name,
    alias,
    length: alias.length,
    rx: new RegExp(`\\b${aliasPattern(alias)}\\b`, 'i'),
  })),
).sort((a, b) => b.length - a.length);

export function inferCategory(text, fallback = 'otros') {
  const n = norm(text);
  const found = CATEGORY_HINTS.find((hint) => hasAny(n, hint.words));
  return found?.category || fallback || 'otros';
}

export function matchedBrand(text) {
  return matchedPortfolio(text)?.name ?? null;
}

export function matchedPortfolio(text) {
  if (!text) return null;
  const n = norm(text);
  const matcher = MATCHERS.find((m) => m.rx.test(n));
  if (!matcher) return null;
  const meta = BRAND_META[matcher.brand];
  const category = inferCategory(text, 'otros');
  return { ...meta, category };
}

export function brandGroup(brandName) {
  return BRAND_META[brandName]?.owner ?? null;
}

export function brandLabel(brandName) {
  return BRAND_META[brandName]?.label ?? brandName;
}

export function enrichProduct(base, text = '') {
  const cleanName = normalizeProductText(base.name);
  const cleanText = normalizeProductText(text || cleanName);
  const match = matchedPortfolio(cleanText);
  if (!match) return null;
  return {
    ...base,
    name: cleanName,
    brand: match.name,
    brandLabel: match.label,
    group: match.owner,
    owner: match.owner,
    ownerLabel: OWNER_LABEL[match.owner],
    company: match.company,
    companyLabel: COMPANY_LABEL[match.company] ?? match.company,
    category: match.category,
    categoryLabel: CATEGORY_LABEL[match.category] ?? CATEGORY_LABEL.otros,
  };
}
