import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

async function readJsonFile(filename, fallback) {
  try {
    const text = await readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function readHistorySnapshots() {
  const snapshots = [];
  try {
    const text = await readFile(path.join(DATA_DIR, 'history.jsonl'), 'utf8');
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      try {
        const row = JSON.parse(line);
        if (row?.t && row?.prices) snapshots.push(row);
      } catch {
        // Skip malformed local history rows.
      }
    }
  } catch {
    // Static deploys may start without history; the latest scan still works.
  }

  const latest = await readJsonFile('latest.json', null);
  if (latest?.generatedAt && Array.isArray(latest.items)) {
    const prices = {};
    for (const item of latest.items) {
      const key = item.key || item.productKey || item.id || `${item.source || item.super}:${item.name}`;
      const price = Number(item.price);
      if (key && Number.isFinite(price)) prices[key] = price;
    }
    snapshots.push({
      schemaVersion: 2,
      t: latest.generatedAt,
      itemCount: latest.items.length,
      validated: latest.validated,
      suggested: latest.suggested,
      prices,
    });
  }

  const byDate = new Map();
  for (const snapshot of snapshots) byDate.set(snapshot.t, snapshot);
  return [...byDate.values()].sort((a, b) => String(a.t).localeCompare(String(b.t)));
}

async function runs() {
  const snapshots = await readHistorySnapshots();
  return snapshots.map((row, index) => ({
    run_id: index + 1,
    captured_at: row.t,
    n_items: Number(row.itemCount || Object.keys(row.prices || {}).length || 0),
  }));
}

async function movers(limit = 25) {
  const snapshots = await readHistorySnapshots();
  if (snapshots.length < 2) return { prevAt: null, curAt: null, rows: [] };

  const [prev, cur] = snapshots.slice(-2);
  const products = await readJsonFile('products.json', {});
  const rows = [];

  for (const [key, curRaw] of Object.entries(cur.prices || {})) {
    if (!(key in (prev.prices || {}))) continue;
    const prevPrice = Number(prev.prices[key]);
    const curPrice = Number(curRaw);
    if (!Number.isFinite(prevPrice) || !Number.isFinite(curPrice) || prevPrice <= 0 || prevPrice === curPrice) continue;
    const meta = products[key] || {};
    rows.push({
      product_key: key,
      name: meta.name || key,
      super: meta.super || meta.source || key.split(':')[0],
      brand: meta.brandLabel || meta.brand || '-',
      owner: meta.owner || meta.group || null,
      prev: prevPrice,
      cur: curPrice,
      pct: ((curPrice - prevPrice) / prevPrice) * 100,
    });
  }

  rows.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
  return { prevAt: prev.t, curAt: cur.t, rows: rows.slice(0, limit) };
}

async function pvsTimeline() {
  const snapshots = await readHistorySnapshots();
  return snapshots
    .filter((row) => row.suggested)
    .map((row) => ({
      t: row.t,
      above: Number(row.suggested.above || 0),
      ok: Number(row.suggested.ok || 0),
      below: Number(row.suggested.below || 0),
    }));
}

export default async function handler(req, res) {
  const kind = Array.isArray(req.query?.kind) ? req.query.kind[0] : req.query?.kind;
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

  try {
    if (kind === 'runs') return res.status(200).json({ ok: true, mode: 'static', runs: await runs() });
    if (kind === 'movers') return res.status(200).json({ ok: true, mode: 'static', ...(await movers()) });
    if (kind === 'pvs') return res.status(200).json({ ok: true, mode: 'static', timeline: await pvsTimeline() });
    if (kind === 'index') return res.status(200).json({ ok: true, mode: 'static', capturedAt: null, groups: [] });
    if (kind === 'market') return res.status(200).json({ ok: true, mode: 'static', rows: [] });
    return res.status(404).json({ ok: false, error: 'Unknown history endpoint' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
