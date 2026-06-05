// Backfill de la base historica desde corridas completas, latest.json y history.jsonl.
// Idempotente: se puede correr todas las veces que haga falta.
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { openDb, ingestRun, DB_PATH, MIN_USABLE_ITEMS } from '../src/lib/db.js';
import { collapseByArticle } from '../src/scrapers/superencasa.js';

const SUPERENCASA = new Set(['ubesur', 'tamisur']);

function productKey(store, sku) {
  return `${store}:${sku}`;
}

function normalizeItems(items = []) {
  const out = items.filter((i) => !SUPERENCASA.has(i.super));
  for (const store of SUPERENCASA) {
    const subset = items.filter((i) => i.super === store);
    if (subset.length) out.push(...collapseByArticle(subset));
  }
  return out;
}

function qualityForFullPayload(payload, source) {
  const n = Array.isArray(payload?.items) ? payload.items.length : 0;
  if (source === 'latest') {
    return n >= MIN_USABLE_ITEMS
      ? { validated: true, qualityStatus: 'usable', qualityNote: '' }
      : { validated: false, qualityStatus: 'excluded', qualityNote: `latest con menos de ${MIN_USABLE_ITEMS} items` };
  }
  if (payload?.validated === true) return { validated: true, qualityStatus: 'usable', qualityNote: '' };
  return { validated: false, qualityStatus: 'excluded', qualityNote: 'corrida legacy sin sello de validacion' };
}

function qualityForSnapshot(snapshot) {
  const n = Number(snapshot?.itemCount ?? Object.keys(snapshot?.prices || {}).length);
  if (snapshot?.validated === true && n >= MIN_USABLE_ITEMS) {
    return { validated: true, qualityStatus: 'usable', qualityNote: '' };
  }
  const reason = snapshot?.validated === true
    ? `snapshot con menos de ${MIN_USABLE_ITEMS} items`
    : 'snapshot legacy sin sello de validacion';
  return { validated: false, qualityStatus: 'excluded', qualityNote: reason };
}

async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function normalizeMeta(raw) {
  const meta = new Map();
  for (const [key, value] of Object.entries(raw || {})) {
    meta.set(key, value);
    if (value?.super != null && value?.sku != null) meta.set(productKey(value.super, value.sku), value);
  }
  return meta;
}

function itemFromHistoryPrice(key, price, meta) {
  const i = String(key).indexOf(':');
  const store = i === -1 ? '' : String(key).slice(0, i);
  const sku = i === -1 ? String(key) : String(key).slice(i + 1);
  const base = meta.get(key) || meta.get(productKey(store, sku)) || {};
  return {
    ...base,
    super: base.super || store,
    sku: base.sku || sku,
    name: base.name || sku,
    price,
  };
}

async function ingestFullPayload(db, payload, source) {
  if (!payload?.generatedAt || !Array.isArray(payload.items)) return { skipped: true, n: 0 };
  const quality = qualityForFullPayload(payload, source);
  return ingestRun(db, {
    capturedAt: payload.generatedAt,
    source,
    items: normalizeItems(payload.items),
    ...quality,
  });
}

async function ingestHistoryJsonl(db) {
  if (!existsSync('public/data/history.jsonl')) return { added: 0, skipped: 0, obs: 0 };
  const meta = normalizeMeta(await readJson('public/data/products.json', {}));
  const text = await readFile('public/data/history.jsonl', 'utf8');
  let added = 0;
  let skipped = 0;
  let obs = 0;
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let snapshot;
    try { snapshot = JSON.parse(line); } catch { continue; }
    if (!snapshot?.t || !snapshot?.prices) continue;
    const quality = qualityForSnapshot(snapshot);
    const items = Object.entries(snapshot.prices).map(([key, price]) => itemFromHistoryPrice(key, price, meta));
    const res = ingestRun(db, {
      capturedAt: snapshot.t,
      source: 'history.jsonl',
      items,
      ...quality,
    });
    if (res.skipped) skipped++; else { added++; obs += res.n; }
  }
  return { added, skipped, obs };
}

const db = openDb();
let added = 0;
let skipped = 0;
let totalObs = 0;

const dir = 'data/output';
const files = existsSync(dir)
  ? (await readdir(dir)).filter((f) => /^sarubbi_.*\.json$/.test(f)).sort()
  : [];

for (const file of files) {
  const payload = await readJson(`${dir}/${file}`);
  if (!payload) { console.error(`SKIP ${file}: JSON invalido`); continue; }
  const capturedAt = payload.generatedAt || file.replace(/^sarubbi_(.*)\.json$/, '$1');
  const quality = qualityForFullPayload({ ...payload, generatedAt: capturedAt }, 'data/output');
  const res = ingestRun(db, {
    capturedAt,
    source: 'data/output',
    items: normalizeItems(payload.items || []),
    ...quality,
  });
  if (res.skipped) { skipped++; } else { added++; totalObs += res.n; }
}

const latest = await readJson('public/data/latest.json');
if (latest) {
  const res = await ingestFullPayload(db, latest, 'latest');
  if (res.skipped) skipped++; else { added++; totalObs += res.n; }
}

const history = await ingestHistoryJsonl(db);
added += history.added;
skipped += history.skipped;
totalObs += history.obs;

const stats = db.prepare(`
  SELECT
    (SELECT COUNT(*) FROM runs) AS runs,
    (SELECT COUNT(*) FROM runs WHERE quality_status = 'usable') AS usable_runs,
    (SELECT COUNT(*) FROM observations) AS obs,
    (SELECT COUNT(*) FROM observations o JOIN runs r ON r.run_id = o.run_id WHERE r.quality_status = 'usable') AS usable_obs,
    (SELECT COUNT(*) FROM products) AS prods,
    (SELECT COUNT(DISTINCT canonical_key) FROM products) AS canon
`).get();

console.log(`Backfill -> +${added} corridas, ${skipped} ya existian, +${totalObs} observaciones`);
console.log(`Base: ${stats.runs} corridas (${stats.usable_runs} usables) - ${stats.obs} observaciones (${stats.usable_obs} usables) - ${stats.prods} productos (${stats.canon} canonicos) - ${DB_PATH}`);
