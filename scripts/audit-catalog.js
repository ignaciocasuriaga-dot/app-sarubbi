// Auditoria reproducible de SKUs del catalogo Sarubbi.
// Uso:
//   npm run audit
//   node scripts/audit-catalog.js http://127.0.0.1:4173/data/latest.json
import { readFile } from 'node:fs/promises';
import { matchedPortfolio, stripAccents } from '../src/brands.js';
import { liquidProfile } from '../src/lib/normalize.js';

const source = process.argv[2] || 'public/data/latest.json';

async function loadPayload(path) {
  if (/^https?:\/\//i.test(path)) return (await fetch(path)).json();
  return JSON.parse(await readFile(path, 'utf8'));
}

function norm(value) {
  return stripAccents(value).toLowerCase();
}

function add(bucket, key, item, extra = {}) {
  if (!bucket[key]) bucket[key] = [];
  bucket[key].push({ ...item, ...extra });
}

function profileKind(profile) {
  if (!profile) return 'sin_presentacion';
  if (profile.metric === 'kg') return 'peso';
  if (profile.metric === 'unit') return 'unidad';
  return 'pieza';
}

const RULES = {
  nonPortfolio: /\b(yerba|detergente|limpiador|desodorante|insecticida|servilleta|vasos?|platos?|jabon|shampoo|galletitas?|alfajor|chocolate)\b/i,
  meatHint: /\b(jamon|paleta|fiambre|pancho|salchicha|frankfurter|salame|salamin|chorizo|mortadela|panceta|hamburguesa|empanada|asado|vacio|matambre|bondiola|lomo|bife)\b/i,
};

const payload = await loadPayload(source);
const items = payload.items || [];
const confirmed = {};
const warnings = {};
const metrics = {};

for (const item of items) {
  const text = norm(item.name);
  const match = matchedPortfolio(item.name);
  const profile = liquidProfile(item);
  const kind = profileKind(profile);
  metrics[kind] = (metrics[kind] || 0) + 1;

  if (!match) add(warnings, 'sin_match_portfolio', item);
  else if (match.name !== item.brand) add(confirmed, `marca_cambiaria_a_${match.name}`, item);
  if (RULES.nonPortfolio.test(text)) add(confirmed, 'posible_no_portfolio', item);
  if (!RULES.meatHint.test(text)) add(warnings, 'sin_keyword_chacinado', item);
  if (item.price == null) add(warnings, 'sin_precio', item);
  if (!profile) add(warnings, 'sin_presentacion_comparable', item);
}

function summary(map) {
  return Object.fromEntries(Object.entries(map).map(([key, arr]) => [key, arr.length]));
}

function printSamples(title, map) {
  console.log(`\n${title}`);
  for (const [key, arr] of Object.entries(map)) {
    console.log(`\n## ${key} (${arr.length})`);
    for (const item of arr.slice(0, 25)) {
      const profile = liquidProfile(item);
      const metric = profile?.metricLabel || '$/unidad';
      const unitPrice = profile?.pricePerLiter == null ? '' : `\t${metric} ${Number(profile.pricePerLiter).toFixed(1)}`;
      console.log(`${item.super}\t${item.category}\t${item.brand}\t$${item.price}\t${item.name}${unitPrice}`);
    }
  }
}

console.log(JSON.stringify({
  source,
  generatedAt: payload.generatedAt,
  total: items.length,
  metrics,
  confirmed: summary(confirmed),
  warnings: summary(warnings),
}, null, 2));
printSamples('CONFIRMADOS', confirmed);
printSamples('WARNINGS', warnings);

const confirmedCount = Object.values(confirmed).reduce((sum, arr) => sum + arr.length, 0);
if (confirmedCount > 0) process.exitCode = 2;
