// Base historica del observatorio (SQLite via node:sqlite, sin deps nativas).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { canonicalKey, competitiveSegment, extractSizeMl, liquidProfile } from './normalize.js';

export const DB_PATH = process.env.SARUBBI_DB || 'data/history/sarubbi.db';
export const MIN_USABLE_ITEMS = Number(process.env.SARUBBI_MIN_HISTORY_ITEMS || 120);

const num = (v) => (v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
const boolInt = (v) => (v ? 1 : 0);

function columns(db, table) {
  return new Set(db.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name));
}

function ensureColumn(db, table, name, definition) {
  if (!columns(db, table).has(name)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
}

function ensureViews(db) {
  db.exec(`
    DROP VIEW IF EXISTS v_observations_enriched;
    DROP VIEW IF EXISTS v_latest_observations;
    DROP VIEW IF EXISTS v_pvs_by_run;
    DROP VIEW IF EXISTS v_market_price_liter;

    CREATE VIEW v_observations_enriched AS
      SELECT
        r.run_id, r.captured_at, r.source, r.n_items, r.validated, r.quality_status, r.quality_note,
        p.product_key, p.super, p.sku, p.name, p.brand, p.brand_label, p.owner, p.company, p.category,
        p.canonical_key, p.size_ml, p.segment_key, p.segment_label, p.unit_ml, p.pack_units,
        p.total_ml, p.volume_bucket, p.format_label, p.url, p.image,
        o.price, o.list_price, o.price_per_liter, o.list_price_per_liter,
        o.suggested_price, o.suggested_dev_pct, o.suggested_status,
        o.offer_pct, o.branch, o.status
      FROM observations o
      JOIN runs r ON r.run_id = o.run_id
      JOIN products p ON p.product_key = o.product_key;

    CREATE VIEW v_latest_observations AS
      SELECT *
      FROM v_observations_enriched
      WHERE run_id = (
        SELECT run_id FROM runs
        WHERE quality_status = 'usable'
        ORDER BY captured_at DESC
        LIMIT 1
      );

    CREATE VIEW v_pvs_by_run AS
      SELECT
        captured_at,
        SUM(CASE WHEN suggested_status = 'above' THEN 1 ELSE 0 END) AS above,
        SUM(CASE WHEN suggested_status = 'ok' THEN 1 ELSE 0 END) AS ok,
        SUM(CASE WHEN suggested_status = 'below' THEN 1 ELSE 0 END) AS below
      FROM v_observations_enriched
      WHERE quality_status = 'usable' AND suggested_status IS NOT NULL
      GROUP BY captured_at;

    CREATE VIEW v_market_price_liter AS
      SELECT
        captured_at, category, segment_key, segment_label, owner, brand, brand_label, super,
        COUNT(*) AS n,
        AVG(price_per_liter) AS avg_price_per_liter,
        MIN(price_per_liter) AS min_price_per_liter,
        MAX(price_per_liter) AS max_price_per_liter
      FROM v_observations_enriched
      WHERE quality_status = 'usable' AND price_per_liter IS NOT NULL
      GROUP BY captured_at, category, segment_key, owner, brand, super;
  `);
}

export function openDb(path = DB_PATH) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS runs (
      run_id INTEGER PRIMARY KEY AUTOINCREMENT,
      captured_at TEXT UNIQUE NOT NULL,
      source TEXT,
      n_items INTEGER,
      validated INTEGER DEFAULT 1,
      quality_status TEXT DEFAULT 'usable',
      quality_note TEXT
    );
    CREATE TABLE IF NOT EXISTS products (
      product_key TEXT PRIMARY KEY,
      super TEXT, sku TEXT, name TEXT,
      brand TEXT, brand_label TEXT, owner TEXT, company TEXT, category TEXT,
      canonical_key TEXT, size_ml INTEGER,
      segment_key TEXT, segment_label TEXT,
      unit_ml INTEGER, pack_units INTEGER, total_ml INTEGER,
      volume_bucket TEXT, format_label TEXT,
      url TEXT, image TEXT,
      first_seen TEXT, last_seen TEXT
    );
    CREATE TABLE IF NOT EXISTS observations (
      run_id INTEGER NOT NULL,
      product_key TEXT NOT NULL,
      price REAL, list_price REAL,
      price_per_liter REAL, list_price_per_liter REAL,
      suggested_price REAL, suggested_dev_pct REAL, suggested_status TEXT,
      offer_pct REAL,
      branch TEXT, status TEXT,
      PRIMARY KEY (run_id, product_key)
    );
    CREATE INDEX IF NOT EXISTS idx_runs_quality_time ON runs(quality_status, captured_at);
    CREATE INDEX IF NOT EXISTS idx_obs_run ON observations(run_id);
    CREATE INDEX IF NOT EXISTS idx_obs_product ON observations(product_key);
    CREATE INDEX IF NOT EXISTS idx_prod_canon ON products(canonical_key);
    CREATE INDEX IF NOT EXISTS idx_prod_segment ON products(category, segment_key, brand, owner);
    CREATE INDEX IF NOT EXISTS idx_prod_store_brand ON products(super, brand);
    CREATE INDEX IF NOT EXISTS idx_obs_ppl ON observations(price_per_liter);
  `);

  ensureColumn(db, 'runs', 'validated', 'INTEGER DEFAULT 1');
  ensureColumn(db, 'runs', 'quality_status', "TEXT DEFAULT 'usable'");
  ensureColumn(db, 'runs', 'quality_note', 'TEXT');
  ensureColumn(db, 'products', 'segment_key', 'TEXT');
  ensureColumn(db, 'products', 'segment_label', 'TEXT');
  ensureColumn(db, 'products', 'unit_ml', 'INTEGER');
  ensureColumn(db, 'products', 'pack_units', 'INTEGER');
  ensureColumn(db, 'products', 'total_ml', 'INTEGER');
  ensureColumn(db, 'products', 'volume_bucket', 'TEXT');
  ensureColumn(db, 'products', 'format_label', 'TEXT');
  ensureColumn(db, 'observations', 'price_per_liter', 'REAL');
  ensureColumn(db, 'observations', 'list_price_per_liter', 'REAL');
  ensureColumn(db, 'observations', 'offer_pct', 'REAL');
  ensureViews(db);
  return db;
}

function inferQuality({ validated = true, nItems = 0, qualityStatus = null, qualityNote = '' }) {
  if (qualityStatus) return { qualityStatus, qualityNote };
  if (!validated) return { qualityStatus: 'excluded', qualityNote: qualityNote || 'snapshot sin validacion de calidad' };
  if (nItems < MIN_USABLE_ITEMS) return { qualityStatus: 'excluded', qualityNote: qualityNote || `menos de ${MIN_USABLE_ITEMS} items` };
  return { qualityStatus: 'usable', qualityNote };
}

// Ingesta idempotente de un relevamiento completo.
export function ingestRun(db, { capturedAt, source = 'scrape', items = [], validated = true, qualityStatus = null, qualityNote = '' }) {
  if (!capturedAt) throw new Error('ingestRun: captured_at requerido');
  const quality = inferQuality({ validated, nItems: items.length, qualityStatus, qualityNote });
  const existing = db.prepare('SELECT run_id FROM runs WHERE captured_at = ?').get(capturedAt);
  if (existing) {
    db.prepare(`
      UPDATE runs
      SET source = COALESCE(?, source),
        n_items = MAX(COALESCE(n_items, 0), ?),
        validated = ?,
        quality_status = ?,
        quality_note = ?
      WHERE run_id = ?
    `).run(source, items.length, boolInt(validated), quality.qualityStatus, quality.qualityNote, existing.run_id);
    return { skipped: true, runId: existing.run_id, n: 0, qualityStatus: quality.qualityStatus };
  }

  const insertRun = db.prepare(`
    INSERT INTO runs (captured_at, source, n_items, validated, quality_status, quality_note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const upsertProduct = db.prepare(`
    INSERT INTO products
      (product_key, super, sku, name, brand, brand_label, owner, company, category,
       canonical_key, size_ml, segment_key, segment_label, unit_ml, pack_units,
       total_ml, volume_bucket, format_label, url, image, first_seen, last_seen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(product_key) DO UPDATE SET
      name = excluded.name, brand = excluded.brand, brand_label = excluded.brand_label,
      owner = excluded.owner, company = excluded.company, category = excluded.category,
      canonical_key = excluded.canonical_key, size_ml = excluded.size_ml,
      segment_key = excluded.segment_key, segment_label = excluded.segment_label,
      unit_ml = excluded.unit_ml, pack_units = excluded.pack_units, total_ml = excluded.total_ml,
      volume_bucket = excluded.volume_bucket, format_label = excluded.format_label,
      url = excluded.url, image = excluded.image, last_seen = excluded.last_seen
  `);
  const insertObs = db.prepare(`
    INSERT OR IGNORE INTO observations
      (run_id, product_key, price, list_price, price_per_liter, list_price_per_liter,
       suggested_price, suggested_dev_pct, suggested_status, offer_pct, branch, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec('BEGIN');
  try {
    const info = insertRun.run(capturedAt, source, items.length, boolInt(validated), quality.qualityStatus, quality.qualityNote);
    const runId = Number(info.lastInsertRowid);
    for (const it of items) {
      const key = `${it.super}:${it.sku}`;
      const segment = competitiveSegment(it);
      const profile = liquidProfile(it);
      const price = num(it.price);
      const listPrice = num(it.listPrice);
      const sizeMl = profile?.unitMl ?? extractSizeMl(it.name);
      const listPricePerLiter = profile && listPrice != null ? listPrice / (profile.totalMl / 1000) : null;
      const offerPct = listPrice != null && price != null && listPrice > 0
        ? ((price - listPrice) / listPrice) * 100
        : null;
      upsertProduct.run(
        key, it.super ?? null, String(it.sku ?? ''), it.name ?? null,
        it.brand ?? null, it.brandLabel ?? it.brand ?? null, it.owner ?? it.group ?? null,
        it.company ?? null, it.category ?? null, canonicalKey(it), sizeMl,
        segment.key, segment.label, profile?.unitMl ?? null, profile?.units ?? null,
        profile?.totalMl ?? null, profile?.bucket?.label ?? null,
        profile ? `${profile.bucket.label}${profile.units > 1 ? ` x${profile.units}` : ''}` : null,
        it.url ?? null, it.image ?? null, capturedAt, capturedAt,
      );
      insertObs.run(
        runId, key, price, listPrice, profile?.pricePerLiter ?? null, listPricePerLiter,
        num(it.suggestedPrice), num(it.suggestedDeviationPct), it.suggestedStatus ?? null,
        offerPct, it.branch ?? null, it.price == null ? 'no_price' : 'found',
      );
    }
    db.exec('COMMIT');
    return { skipped: false, runId, n: items.length, qualityStatus: quality.qualityStatus };
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

// Serie temporal de precio para un product_key.
export function priceSeries(db, productKey) {
  return db.prepare(`
    SELECT r.captured_at AS t, o.price AS price
    FROM observations o JOIN runs r ON r.run_id = o.run_id
    WHERE o.product_key = ? AND o.price IS NOT NULL AND r.quality_status = 'usable'
    ORDER BY r.captured_at
  `).all(productKey);
}

export function listRuns(db) {
  return db.prepare(`
    SELECT run_id, captured_at, n_items, validated, quality_status, quality_note
    FROM runs
    WHERE quality_status = 'usable'
    ORDER BY captured_at
  `).all();
}

// Items (producto + precio) de la corrida usable mas reciente, para indicadores.
export function latestRunItems(db) {
  const run = db.prepare(`
    SELECT run_id, captured_at
    FROM runs
    WHERE quality_status = 'usable'
    ORDER BY captured_at DESC
    LIMIT 1
  `).get();
  if (!run) return { capturedAt: null, items: [] };
  const items = db.prepare(`
    SELECT p.name, p.brand, p.brand_label AS brandLabel, p.owner, p.category, o.price
    FROM observations o JOIN products p ON p.product_key = o.product_key
    WHERE o.run_id = ? AND o.price IS NOT NULL
  `).all(run.run_id);
  return { capturedAt: run.captured_at, items };
}

// Serie agregada por corrida, rubro, segmento y marca.
// Es la base para ver evolucion de price index sin exponer detalle PVS.
export function marketTimeline(db) {
  return db.prepare(`
    SELECT
      captured_at AS t,
      category,
      segment_key AS segmentKey,
      segment_label AS segmentLabel,
      owner,
      brand,
      brand_label AS brandLabel,
      SUM(n) AS n,
      SUM(avg_price_per_liter * n) / SUM(n) AS ppl
    FROM v_market_price_liter
    GROUP BY captured_at, category, segment_key, owner, brand
    ORDER BY captured_at, category, segment_label, brand_label
  `).all();
}

function recentRuns(db, n = 2) {
  return db.prepare(`
    SELECT run_id, captured_at
    FROM runs
    WHERE quality_status = 'usable'
    ORDER BY captured_at DESC
    LIMIT ?
  `).all(n);
}

// Mayores variaciones de precio entre las dos corridas usables mas recientes.
export function movers(db, { limit = 25 } = {}) {
  const recent = recentRuns(db, 2);
  if (recent.length < 2) return { prevAt: null, curAt: null, rows: [] };
  const [cur, prev] = recent;
  const rows = db.prepare(`
    SELECT cur.product_key AS product_key, p.name, p.super, p.brand_label AS brand, p.owner, prev.price AS prev, cur.price AS cur
    FROM observations cur
    JOIN observations prev ON prev.product_key = cur.product_key AND prev.run_id = ?
    JOIN products p ON p.product_key = cur.product_key
    WHERE cur.run_id = ? AND cur.price IS NOT NULL AND prev.price IS NOT NULL AND cur.price <> prev.price
  `).all(prev.run_id, cur.run_id)
    .map((x) => ({ ...x, pct: ((x.cur - x.prev) / x.prev) * 100 }))
    .sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  return { prevAt: prev.captured_at, curAt: cur.captured_at, rows: rows.slice(0, limit) };
}

// Cumplimiento de PVS por corrida usable (conteo de estados above/ok/below).
export function pvsTimeline(db) {
  const raw = db.prepare(`
    SELECT r.captured_at AS t, o.suggested_status AS s, COUNT(*) AS n
    FROM observations o JOIN runs r ON r.run_id = o.run_id
    WHERE o.suggested_status IS NOT NULL AND r.quality_status = 'usable'
    GROUP BY r.captured_at, o.suggested_status
    ORDER BY r.captured_at
  `).all();
  const byT = new Map();
  for (const row of raw) {
    const e = byT.get(row.t) || { t: row.t, above: 0, ok: 0, below: 0 };
    if (row.s === 'above' || row.s === 'ok' || row.s === 'below') e[row.s] = row.n;
    byT.set(row.t, e);
  }
  return [...byT.values()];
}
