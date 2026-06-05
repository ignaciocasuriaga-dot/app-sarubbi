import { scrapeTata } from './scrapers/tata.js';
import { scrapeTiendaInglesa } from './scrapers/tiendainglesa.js';
import { scrapeDisco, scrapeDevoto, scrapeGeant } from './scrapers/blazor.js';
import { scrapeElDorado } from './scrapers/eldorado.js';
import { scrapeUbesur, scrapeTamisur } from './scrapers/superencasa.js';
import { scrapeManualPrices } from './scrapers/manual.js';
import { applySuggestedPrices, suggestedSummary } from './suggested.js';
import {
  ALL_BRANDS,
  BRAND_GROUPS,
  CATEGORY_GROUPS,
  SEARCH_TERMS,
  CATEGORY_LABEL,
  OWNER_LABEL,
  STORE_LABEL,
  COMPANY_LABEL,
  matchedPortfolio,
  normalizeProductText,
} from './brands.js';
import { writeFile, mkdir, appendFile, readFile } from 'node:fs/promises';

const SCRAPERS = [
  { name: 'tata',          fn: scrapeTata },
  { name: 'tiendainglesa', fn: scrapeTiendaInglesa },
  { name: 'disco',         fn: scrapeDisco },
  { name: 'devoto',        fn: scrapeDevoto },
  { name: 'geant',         fn: scrapeGeant },
  { name: 'eldorado',      fn: scrapeElDorado },
  { name: 'ubesur',        fn: scrapeUbesur },
  { name: 'tamisur',       fn: scrapeTamisur },
  { name: 'manual',        fn: scrapeManualPrices },
];

const SCRAPER_CONCURRENCY = Math.max(1, Number(process.env.SCRAPER_CONCURRENCY || 3));
const MIN_PUBLIC_ITEMS = Math.max(1, Number(process.env.MIN_PUBLIC_ITEMS || 120));
const MIN_PUBLIC_RETENTION = Math.min(1, Math.max(0, Number(process.env.MIN_PUBLIC_RETENTION || 0.65)));

let completedStores = 0;

function emitProgress(payload) {
  console.log(`@@progress ${JSON.stringify({
    phase: 'scrape',
    at: new Date().toISOString(),
    ...payload,
  })}`);
}

async function runOne(name, fn) {
  const t0 = Date.now();
  const storeLabel = STORE_LABEL[name] || name;
  const report = (event = {}) => emitProgress({
    store: name,
    storeLabel,
    completedStores,
    totalStores: SCRAPERS.length,
    ...event,
  });
  try {
    report({ status: 'store_start', message: `${storeLabel}: iniciando` });
    const items = await fn(SEARCH_TERMS, report);
    const ms = Date.now() - t0;
    completedStores += 1;
    report({
      status: 'store_done',
      found: items.length,
      completedStores,
      elapsedSeconds: Math.round(ms / 1000),
      message: `${storeLabel}: ${items.length} SKUs relevados`,
    });
    console.log(`OK ${name.padEnd(15)} | ${String(items.length).padStart(3)} productos | ${(ms / 1000).toFixed(1)}s`);
    return { name, items, ok: true };
  } catch (err) {
    const ms = Date.now() - t0;
    completedStores += 1;
    report({
      status: 'store_error',
      completedStores,
      elapsedSeconds: Math.round(ms / 1000),
      error: err.message,
      message: `${storeLabel}: error`,
    });
    console.error(`NO ${name.padEnd(15)} | ERROR (${(ms / 1000).toFixed(1)}s): ${err.message}`);
    return { name, items: [], ok: false, error: err.message };
  }
}

function csvCell(value) {
  const s = String(value ?? '').replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function buildPayload({ generatedAt, sorted, results }) {
  return {
    brands: ALL_BRANDS,
    groups: BRAND_GROUPS,
    categories: CATEGORY_GROUPS,
    categoryLabels: CATEGORY_LABEL,
    ownerLabels: OWNER_LABEL,
    companyLabels: COMPANY_LABEL,
    generatedAt,
    validated: true,
    items: sorted,
    suggested: suggestedSummary(sorted),
    scrapeResults: results.map(({ name, ok, error, items }) => ({
      name,
      ok,
      error,
      count: items.length,
    })),
  };
}

async function readJsonIfExists(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

function revalidatePortfolioItem(item) {
  const match = matchedPortfolio(`${item.brandLabel || item.brand || ''} ${item.name || ''}`)
    || matchedPortfolio(item.name);
  if (!match || match.name !== item.brand) return null;
  return {
    ...item,
    name: normalizeProductText(item.name),
    brand: match.name,
    brandLabel: match.label,
    group: match.owner,
    owner: match.owner,
    ownerLabel: OWNER_LABEL[match.owner],
    company: match.company,
    companyLabel: COMPANY_LABEL[match.company] ?? match.company,
    category: match.category,
    categoryLabel: CATEGORY_LABEL[match.category] ?? match.category,
  };
}

console.log(`Buscando ${SEARCH_TERMS.length} terminos Sarubbi/competencia (${ALL_BRANDS.length} marcas)\n`);
emitProgress({
  status: 'starting',
  message: `Iniciando ${SCRAPERS.length} fuentes`,
  completedStores: 0,
  totalStores: SCRAPERS.length,
  termTotal: SEARCH_TERMS.length,
});

async function runScrapers() {
  const results = new Array(SCRAPERS.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(SCRAPER_CONCURRENCY, SCRAPERS.length) }, async () => {
    while (next < SCRAPERS.length) {
      const current = next;
      next += 1;
      const scraper = SCRAPERS[current];
      results[current] = await runOne(scraper.name, scraper.fn);
    }
  });
  await Promise.all(workers);
  return results;
}

const results = await runScrapers();
const raw = results.flatMap((r) => r.items).filter(Boolean);
const validatedRaw = raw.map(revalidatePortfolioItem).filter(Boolean);
const all = applySuggestedPrices(validatedRaw);
const generatedAt = new Date().toISOString();

await mkdir('data/output', { recursive: true });
await mkdir('public/data', { recursive: true });
const stamp = generatedAt.replace(/[:.]/g, '-');
const csvPath = `data/output/sarubbi_${stamp}.csv`;
const jsonPath = `data/output/sarubbi_${stamp}.json`;

const sorted = [...all].sort((a, b) => {
  const k = (x) => `${x.category}|${x.group}|${x.brand}|${x.name.toLowerCase()}|${x.super}`;
  return k(a).localeCompare(k(b), 'es');
});

const previousLatest = await readJsonIfExists('public/data/latest.json');
const previousCount = Array.isArray(previousLatest?.items) ? previousLatest.items.length : 0;
const retentionFloor = previousCount ? Math.floor(previousCount * MIN_PUBLIC_RETENTION) : 0;
const publicFloor = previousCount ? Math.max(MIN_PUBLIC_ITEMS, retentionFloor) : MIN_PUBLIC_ITEMS;
const publishPublicData = sorted.length >= publicFloor;

const headers = [
  'producto',
  'marca',
  'dueno',
  'empresa',
  'categoria',
  'precio',
  'precio_lista',
  'precio_referencia',
  'desvio_referencia_pct',
  'estado_referencia',
  'producto_referencia',
  'fuente_referencia',
  'super',
  'local',
  'sku',
  'url',
];
const csvLines = [headers.join(',')];
for (const item of sorted) {
  const row = [
    item.name,
    item.brandLabel ?? item.brand,
    item.ownerLabel ?? item.group,
    item.companyLabel ?? item.company,
    item.categoryLabel ?? item.category,
    item.price ?? '',
    item.listPrice ?? '',
    item.suggestedPrice ?? '',
    item.suggestedDeviationPct ?? '',
    item.suggestedStatus ?? '',
    item.suggestedProduct ?? '',
    item.suggestedSource ?? '',
    item.super,
    item.branch ?? '',
    item.sku,
    item.url ?? '',
  ];
  csvLines.push(row.map(csvCell).join(','));
}

const payload = buildPayload({ generatedAt, sorted, results });
await writeFile(csvPath, csvLines.join('\n'));
await writeFile(jsonPath, JSON.stringify(payload, null, 2));
if (publishPublicData) {
  await writeFile('public/data/latest.json', JSON.stringify(payload));
  await writeFile('public/data/latest.csv', csvLines.join('\n'));
} else {
  console.error(`Control de calidad: corrida descartada para public/data (${sorted.length} items < piso ${publicFloor}).`);
  console.error(`Se conservan los datos publicos anteriores (${previousCount || 0} items). El detalle queda en ${jsonPath}.`);
}

const historyPath = 'public/data/history.jsonl';
const snapshot = {
  schemaVersion: 2,
  t: generatedAt,
  itemCount: sorted.length,
  validated: true,
  suggested: payload.suggested,
  prices: Object.fromEntries(
    sorted
      .filter((i) => i.price != null)
      .map((i) => [`${i.super}:${i.sku}`, i.price]),
  ),
};
if (publishPublicData) await appendFile(historyPath, JSON.stringify(snapshot) + '\n');

const meta = {};
for (const i of sorted) {
  meta[`${i.super}:${i.sku}`] = {
    name: i.name,
    brand: i.brand,
    brandLabel: i.brandLabel,
    group: i.group,
    owner: i.owner,
    company: i.company,
    companyLabel: i.companyLabel,
    category: i.category,
    categoryLabel: i.categoryLabel,
    super: i.super,
    branch: i.branch,
    branchAddress: i.branchAddress,
    sku: i.sku,
    url: i.url,
    suggestedPrice: i.suggestedPrice,
    suggestedDeviationPct: i.suggestedDeviationPct,
    suggestedStatus: i.suggestedStatus,
    suggestedSource: i.suggestedSource,
    suggestedProduct: i.suggestedProduct,
  };
}
if (publishPublicData) await writeFile('public/data/products.json', JSON.stringify(meta));

if (publishPublicData) {
  try {
    const { openDb, ingestRun } = await import('./lib/db.js');
    const db = openDb();
    const res = ingestRun(db, { capturedAt: generatedAt, source: 'scrape', items: sorted });
    console.log(res.skipped
      ? `Historico: la corrida ${generatedAt} ya estaba en la base.`
      : `Historico: +${res.n} observaciones (run ${res.runId}).`);
  } catch (e) {
    console.error('Historico SQLite (no critico):', e.message);
  }
} else {
  process.exitCode = 2;
}

console.log(`\nTotal: ${all.length} productos`);
console.log(`Archivos: ${csvPath} - ${jsonPath}`);
console.log(publishPublicData
  ? `Historico: ${historyPath} (+1 snapshot)\n`
  : `Historico: sin snapshot publico; corrida descartada por control de calidad.\n`);

console.log('Por categoria:');
const byCategory = {};
for (const i of all) (byCategory[i.category] ??= []).push(i);
for (const [category, items] of Object.entries(byCategory)) {
  console.log(`  ${category.padEnd(16)} | ${String(items.length).padStart(3)} items`);
}

console.log('\nPor dueno:');
const byOwner = {};
for (const i of all) (byOwner[i.group] ??= []).push(i);
for (const [owner, items] of Object.entries(byOwner)) {
  console.log(`  ${owner.padEnd(12)} | ${String(items.length).padStart(3)} items`);
}

console.log('\nPor marca:');
const byBrand = {};
for (const i of all) (byBrand[i.brand] ??= []).push(i);
for (const [brand, items] of Object.entries(byBrand).sort((a, b) => b[1].length - a[1].length)) {
  const supers = new Set(items.map((x) => x.super));
  const label = items[0].brandLabel ?? brand;
  console.log(`  ${label.padEnd(22)} | ${String(items.length).padStart(3)} items | en: ${[...supers].join(', ')}`);
}

console.log('\nPor super:');
for (const r of results) {
  console.log(`  ${r.name.padEnd(15)} | ${String(r.items.length).padStart(3)} items`);
}
