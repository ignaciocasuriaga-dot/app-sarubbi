import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  ALL_BRANDS,
  BRAND_GROUPS,
  CATEGORY_GROUPS,
  CATEGORY_LABEL,
  COMPANY_LABEL,
  OWNER_LABEL,
  matchedPortfolio,
  normalizeProductText,
} from '../src/brands.js';
import { suggestedSummary } from '../src/suggested.js';
import { collapseByArticle } from '../src/scrapers/superencasa.js';

const latestPath = 'public/data/latest.json';
const MULTI_LOCAL_STORES = new Set(['ubesur', 'tamisur']);

function csvCell(value) {
  const s = String(value ?? '').replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    const k = (x) => `${x.category}|${x.group}|${x.brand}|${x.name.toLowerCase()}|${x.super}`;
    return k(a).localeCompare(k(b), 'es');
  });
}

function toCsv(items) {
  const headers = [
    'producto',
    'marca',
    'dueno',
    'empresa',
    'categoria',
    'precio',
    'precio_lista',
    'precio_sugerido',
    'desvio_sugerido_pct',
    'estado_sugerido',
    'producto_sugerido',
    'fuente_sugerido',
    'pvp_reporte',
    'super',
    'local',
    'sku',
    'url',
  ];
  const lines = [headers.join(',')];
  for (const item of items) {
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
      item.suggestedObservedPvp ?? '',
      item.super,
      item.branch ?? '',
      item.sku,
      item.url ?? '',
    ];
    lines.push(row.map(csvCell).join(','));
  }
  return lines.join('\n');
}

function productsMeta(items) {
  return Object.fromEntries(items.map((item) => [`${item.super}:${item.sku}`, {
    name: item.name,
    brand: item.brand,
    brandLabel: item.brandLabel,
    group: item.group,
    owner: item.owner,
    company: item.company,
    companyLabel: item.companyLabel,
    category: item.category,
    categoryLabel: item.categoryLabel,
    super: item.super,
    branch: item.branch,
    branchAddress: item.branchAddress,
    sku: item.sku,
    url: item.url,
    suggestedPrice: item.suggestedPrice,
    suggestedDeviationPct: item.suggestedDeviationPct,
    suggestedStatus: item.suggestedStatus,
    suggestedSource: item.suggestedSource,
    suggestedProduct: item.suggestedProduct,
  }]));
}

function collapseMultiLocalItems(items = []) {
  const out = items.filter((item) => !MULTI_LOCAL_STORES.has(item.super));
  for (const store of MULTI_LOCAL_STORES) {
    const subset = items.filter((item) => item.super === store);
    if (subset.length) out.push(...collapseByArticle(subset));
  }
  return out;
}

const payload = JSON.parse(await readFile(latestPath, 'utf8'));
const inputItems = collapseMultiLocalItems(payload.items || []);
const removed = [];
const kept = [];

for (const item of inputItems) {
  const match = matchedPortfolio(item.name)
    || matchedPortfolio(`${item.brandLabel || item.brand || ''} ${item.name || ''}`);
  if (!match) {
    removed.push({ reason: 'no_match_after_revalidation', ...item });
    continue;
  }
  if (match.name !== item.brand) {
    removed.push({ reason: `brand_changed_to_${match.name}`, ...item });
    continue;
  }
  kept.push({
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
  });
}

const sorted = sortItems(kept);
const countsBySource = new Map();
for (const item of sorted) countsBySource.set(item.super, (countsBySource.get(item.super) || 0) + 1);

const nextPayload = {
  ...payload,
  brands: ALL_BRANDS,
  groups: BRAND_GROUPS,
  categories: CATEGORY_GROUPS,
  categoryLabels: CATEGORY_LABEL,
  ownerLabels: OWNER_LABEL,
  companyLabels: COMPANY_LABEL,
  items: sorted,
  suggested: suggestedSummary(sorted),
  scrapeResults: (payload.scrapeResults || []).map((result) => ({
    ...result,
    count: countsBySource.get(result.name) || 0,
  })),
};

await mkdir('data/output', { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
await writeFile(`data/output/revalidation_${stamp}.json`, JSON.stringify({
  input: (payload.items || []).length,
  collapsedInput: inputItems.length,
  output: sorted.length,
  removed: removed.map((item) => ({
    reason: item.reason,
    super: item.super,
    brand: item.brand,
    category: item.category,
    price: item.price,
    name: item.name,
    url: item.url,
  })),
}, null, 2));

await writeFile(latestPath, JSON.stringify(nextPayload));
await writeFile('public/data/latest.csv', toCsv(sorted));
await writeFile('public/data/products.json', JSON.stringify(productsMeta(sorted)));

console.log(`Revalidated ${payload.items?.length || 0} rows -> ${inputItems.length} after collapse -> ${sorted.length} kept, ${removed.length} removed.`);
for (const item of removed) {
  console.log(`DROP ${item.reason} | ${item.brand} | ${item.super} | ${item.name}`);
}
