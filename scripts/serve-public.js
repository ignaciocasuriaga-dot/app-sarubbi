import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { priceIndex } from '../src/lib/indicators.js';
import { competitiveSegment, liquidProfile } from '../src/lib/normalize.js';
import { reportAutomationStatus, sendDailyReportEmail } from '../src/report-email.js';

let _db = null;
let _dbModule = null;
let _dbUnavailable = null;
async function getDbBackend() {
  if (process.env.SARUBBI_HISTORY_MODE === 'json') return null;
  if (_dbUnavailable) return null;
  try {
    if (!_dbModule) _dbModule = await import('../src/lib/db.js');
    if (!_db) _db = _dbModule.openDb();
    return { db: _db, mod: _dbModule };
  } catch (e) {
    _dbUnavailable = e;
    console.warn(`[history] SQLite no disponible, uso fallback JSON: ${e.message}`);
    return null;
  }
}

const port = Number(process.env.PORT || process.argv[2] || 4173);
const host = process.env.HOST || process.argv[3] || '127.0.0.1';
const root = resolve('public');
const AUTO_REFRESH_ENABLED = process.env.SARUBBI_AUTO_REFRESH !== '0';
const AUTO_REFRESH_TZ = process.env.SARUBBI_AUTO_REFRESH_TZ || 'America/Montevideo';
const AUTO_REFRESH_DAILY_TIME = parseDailyTime(process.env.SARUBBI_AUTO_REFRESH_TIME || '08:00');
let refreshState = { status: 'idle', conclusion: null, progress: null };
let autoRefreshTimer = null;
let nextAutoRefreshAt = null;
const MULTI_LOCAL_STORES = new Set(['ubesur', 'tamisur']);
const MIN_VALID_HISTORY_ITEMS = Number(process.env.SARUBBI_MIN_HISTORY_ITEMS || 120);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jsonl': 'application/x-ndjson; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

async function readJsonFile(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function splitProductKey(key) {
  const i = String(key).indexOf(':');
  return i === -1 ? { store: '', sku: String(key) } : { store: String(key).slice(0, i), sku: String(key).slice(i + 1) };
}

function collapsedSku(store, sku) {
  if (!MULTI_LOCAL_STORES.has(store)) return sku;
  const parts = String(sku).split('-');
  return parts.length >= 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])
    ? parts.slice(2).join('-')
    : sku;
}

function modePrice(values) {
  const counts = new Map();
  for (const value of values) {
    const n = Number(value);
    if (!Number.isFinite(n)) continue;
    counts.set(n, (counts.get(n) || 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
  return ranked.length ? ranked[0][0] : null;
}

function normalizeHistorySnapshot(row) {
  const groups = new Map();
  for (const [key, value] of Object.entries(row.prices || {})) {
    const { store, sku } = splitProductKey(key);
    const nextKey = `${store}:${collapsedSku(store, sku)}`;
    if (!groups.has(nextKey)) groups.set(nextKey, []);
    groups.get(nextKey).push(value);
  }
  const prices = {};
  for (const [key, values] of groups) {
    const price = modePrice(values);
    if (price != null) prices[key] = price;
  }
  return {
    ...row,
    schemaVersion: row.schemaVersion || 1,
    itemCount: Object.keys(prices).length,
    prices,
  };
}

function isValidHistorySnapshot(row) {
  return row.t && row.prices && row.validated === true && row.itemCount >= MIN_VALID_HISTORY_ITEMS;
}

function latestToSnapshot(latest) {
  if (!latest?.generatedAt || !Array.isArray(latest.items)) return null;
  return normalizeHistorySnapshot({
    schemaVersion: 2,
    t: latest.generatedAt,
    validated: true,
    suggested: latest.suggested || null,
    prices: Object.fromEntries(
      latest.items
        .filter((item) => item?.price != null)
        .map((item) => [`${item.super}:${item.sku}`, item.price]),
    ),
  });
}

async function readHistorySnapshots({ includeLatest = false } = {}) {
  let snapshots = [];
  try {
    const text = await readFile('public/data/history.jsonl', 'utf8');
    snapshots = text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line); }
        catch { return null; }
      })
      .filter((row) => row && row.t && row.prices)
      .map(normalizeHistorySnapshot)
      .filter(isValidHistorySnapshot);
  } catch {
    snapshots = [];
  }
  if (includeLatest) {
    const latestSnapshot = latestToSnapshot(await readJsonFile('public/data/latest.json', null));
    if (latestSnapshot && isValidHistorySnapshot(latestSnapshot)) {
      const existing = snapshots.findIndex((row) => row.t === latestSnapshot.t);
      if (existing >= 0) snapshots[existing] = latestSnapshot;
      else snapshots.push(latestSnapshot);
    }
  }
  return snapshots.sort((a, b) => String(a.t).localeCompare(String(b.t)));
}

async function fallbackRuns() {
  const snapshots = await readHistorySnapshots({ includeLatest: true });
  return snapshots.map((row, index) => ({
    run_id: index + 1,
    captured_at: row.t,
    n_items: row.itemCount,
  }));
}

async function fallbackMovers(limit = 25) {
  const snapshots = await readHistorySnapshots({ includeLatest: true });
  if (snapshots.length < 2) return { prevAt: null, curAt: null, rows: [] };
  const [prev, cur] = snapshots.slice(-2);
  const products = await readJsonFile('public/data/products.json', {});
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
      super: meta.super || key.split(':')[0],
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

async function fallbackPvsTimeline() {
  const snapshots = await readHistorySnapshots({ includeLatest: true });
  const rows = snapshots
    .filter((row) => row.suggested)
    .map((row) => ({
      t: row.t,
      above: Number(row.suggested.above || 0),
      ok: Number(row.suggested.ok || 0),
      below: Number(row.suggested.below || 0),
    }));
  if (rows.length) return rows;
  const latest = await readJsonFile('public/data/latest.json', null);
  return latest?.suggested ? [{
    t: latest.generatedAt,
    above: Number(latest.suggested.above || 0),
    ok: Number(latest.suggested.ok || 0),
    below: Number(latest.suggested.below || 0),
  }] : [];
}

async function fallbackLatestItems() {
  const latest = await readJsonFile('public/data/latest.json', { generatedAt: null, items: [] });
  return { capturedAt: latest.generatedAt || null, items: latest.items || [] };
}

async function fallbackMarketTimeline() {
  const { capturedAt, items } = await fallbackLatestItems();
  if (!capturedAt) return [];
  const groups = new Map();
  for (const item of items) {
    const profile = liquidProfile(item);
    if (!profile) continue;
    const segment = competitiveSegment(item);
    const key = `${capturedAt}|${item.category}|${segment.key}|${item.owner || item.group}|${item.brand}`;
    const group = groups.get(key) || {
      t: capturedAt,
      category: item.category,
      segmentKey: segment.key,
      segmentLabel: segment.label,
      owner: item.owner || item.group,
      brand: item.brand,
      brandLabel: item.brandLabel || item.brand,
      n: 0,
      weighted: 0,
    };
    group.n += 1;
    group.weighted += profile.pricePerLiter;
    groups.set(key, group);
  }
  return [...groups.values()].map((group) => ({
    t: group.t,
    category: group.category,
    segmentKey: group.segmentKey,
    segmentLabel: group.segmentLabel,
    owner: group.owner,
    brand: group.brand,
    brandLabel: group.brandLabel,
    n: group.n,
    ppl: group.n ? group.weighted / group.n : null,
  }));
}

async function fallbackPriceSeries(productKey) {
  const snapshots = await readHistorySnapshots({ includeLatest: true });
  return snapshots
    .map((row) => ({ t: row.t, price: Number(row.prices?.[productKey]) }))
    .filter((row) => Number.isFinite(row.price));
}

function fileFor(url) {
  const pathname = decodeURIComponent(new URL(url, `http://127.0.0.1:${port}`).pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const clean = normalize(relative).replace(/^(\.\.[/\\])+/, '');
  const full = resolve(join(root, clean));
  return full.startsWith(root) ? full : null;
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolveBody(raw.trim() ? JSON.parse(raw) : {});
      } catch (err) {
        rejectBody(err);
      }
    });
    req.on('error', rejectBody);
  });
}

function reportAuth(req) {
  const secret = process.env.REPORT_TRIGGER_SECRET || process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 500, error: 'Missing REPORT_TRIGGER_SECRET or CRON_SECRET' };
  if (req.headers.authorization !== `Bearer ${secret}`) return { ok: false, status: 401, error: 'Unauthorized' };
  return { ok: true };
}

function shortText(value, max = 160) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseDailyTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) return { hour: 8, minute: 0, label: '08:00' };
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return { hour: 8, minute: 0, label: '08:00' };
  }
  return {
    hour,
    minute,
    label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  };
}

function zonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function addDays({ year, month, day }, amount) {
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12, 0, 0));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function zonedTimeToUtc(year, month, day, hour, minute, timeZone) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  const actual = zonedParts(guess, timeZone);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const actualUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second, 0);
  return new Date(guess.getTime() + (desiredUtc - actualUtc));
}

function nextDailyRefreshDate(now = new Date()) {
  const today = zonedParts(now, AUTO_REFRESH_TZ);
  let target = zonedTimeToUtc(
    today.year,
    today.month,
    today.day,
    AUTO_REFRESH_DAILY_TIME.hour,
    AUTO_REFRESH_DAILY_TIME.minute,
    AUTO_REFRESH_TZ,
  );
  if (target <= now) {
    const tomorrow = addDays(today, 1);
    target = zonedTimeToUtc(
      tomorrow.year,
      tomorrow.month,
      tomorrow.day,
      AUTO_REFRESH_DAILY_TIME.hour,
      AUTO_REFRESH_DAILY_TIME.minute,
      AUTO_REFRESH_TZ,
    );
  }
  return target;
}

function refreshSchedule() {
  return {
    enabled: AUTO_REFRESH_ENABLED,
    time: AUTO_REFRESH_DAILY_TIME.label,
    timeZone: AUTO_REFRESH_TZ,
    nextRunAt: nextAutoRefreshAt ? nextAutoRefreshAt.toISOString() : null,
  };
}

function scheduleAutoRefresh() {
  if (!AUTO_REFRESH_ENABLED) return;
  if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
  nextAutoRefreshAt = nextDailyRefreshDate();
  const delay = Math.max(1000, nextAutoRefreshAt.getTime() - Date.now());
  autoRefreshTimer = setTimeout(() => {
    if (refreshState.status === 'in_progress') {
      console.warn('[auto-refresh] Saltado: ya hay un relevamiento en curso');
    } else {
      console.log(`[auto-refresh] Iniciando relevamiento automatico ${AUTO_REFRESH_DAILY_TIME.label} ${AUTO_REFRESH_TZ}`);
      startRefresh('automatico');
    }
    scheduleAutoRefresh();
  }, delay);
  autoRefreshTimer.unref?.();
  console.log(`[auto-refresh] Proximo relevamiento: ${nextAutoRefreshAt.toISOString()} (${AUTO_REFRESH_DAILY_TIME.label} ${AUTO_REFRESH_TZ})`);
}

function updateProgress(payload) {
  const clean = {};
  for (const key of ['phase', 'status', 'store', 'storeLabel', 'local', 'term', 'message', 'error']) {
    if (payload[key] != null) clean[key] = shortText(payload[key], key === 'error' ? 220 : 120);
  }
  for (const key of ['termIndex', 'termTotal', 'taskIndex', 'taskTotal', 'found', 'fetched', 'completedStores', 'totalStores', 'elapsedSeconds']) {
    const n = cleanNumber(payload[key]);
    if (n !== undefined) clean[key] = n;
  }
  clean.updatedAt = new Date().toISOString();
  refreshState = {
    ...refreshState,
    updatedAt: clean.updatedAt,
    progress: clean,
  };
}

function parseProgressLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('@@progress ')) return;
  try {
    updateProgress(JSON.parse(trimmed.slice('@@progress '.length)));
  } catch (err) {
    console.error('[refresh] progress parse error:', err.message);
  }
}

function runStep(command, args, logPrefix) {
  return new Promise((resolveStep, rejectStep) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdoutBuffer = '';
    child.stdout.on('data', (chunk) => {
      const text = chunk.toString('utf8');
      process.stdout.write(`[${logPrefix}] ${text}`);
      stdoutBuffer += text;
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || '';
      for (const line of lines) parseProgressLine(line);
    });
    child.stderr.on('data', (chunk) => process.stderr.write(`[${logPrefix}] ${chunk}`));
    child.on('error', rejectStep);
    child.on('close', (code) => {
      if (stdoutBuffer) parseProgressLine(stdoutBuffer);
      if (code === 0) resolveStep();
      else rejectStep(new Error(`${logPrefix} exited with code ${code}`));
    });
  });
}

function startRefresh(trigger = 'manual') {
  if (refreshState.status === 'in_progress') return false;
  const automatic = trigger === 'automatico';
  const refreshLabel = 'relevamiento';
  const now = new Date().toISOString();
  refreshState = {
    status: 'in_progress',
    conclusion: null,
    trigger,
    startedAt: now,
    updatedAt: now,
    progress: {
      phase: 'scrape',
      status: 'starting',
      message: automatic ? `Actualizacion automatica ${AUTO_REFRESH_DAILY_TIME.label}` : `Actualizando ${refreshLabel}`,
      updatedAt: now,
    },
  };

  (async () => {
    await runStep(
      process.execPath,
      ['src/main.js'],
      'scrape',
    );
    updateProgress({
      phase: 'pdf',
      status: 'building_pdf',
      message: 'Generando informe PDF',
    });
    await runStep(process.execPath, ['src/pdf.js'], 'pdf');
    refreshState = {
      ...refreshState,
      status: 'completed',
      conclusion: 'success',
      updatedAt: new Date().toISOString(),
      progress: {
        phase: 'done',
        status: 'success',
        message: 'Datos actualizados',
        updatedAt: new Date().toISOString(),
      },
    };
  })().catch((err) => {
    refreshState = {
      ...refreshState,
      status: 'completed',
      conclusion: 'failure',
      error: err.message,
      updatedAt: new Date().toISOString(),
      progress: {
        phase: 'error',
        status: 'failure',
        error: err.message,
        message: 'El relevamiento fallo',
        updatedAt: new Date().toISOString(),
      },
    };
    console.error('[refresh]', err);
  });
  return true;
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, `http://${host}:${port}`).pathname;

  if (pathname === '/api/status') {
    sendJson(res, 200, { ok: true, ...refreshState, schedule: refreshSchedule() });
    return;
  }

  if (pathname === '/api/refresh') {
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST' });
      res.end('Method not allowed');
      return;
    }
    if (refreshState.status === 'in_progress') {
      sendJson(res, 202, { ok: true, message: 'Refresh already running', ...refreshState, schedule: refreshSchedule() });
      return;
    }
    startRefresh('manual');
    sendJson(res, 202, { ok: true, message: 'Refresh started', ...refreshState, schedule: refreshSchedule() });
    return;
  }

  if (pathname === '/api/report/status') {
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      res.end('Method not allowed');
      return;
    }
    try {
      sendJson(res, 200, await reportAutomationStatus());
    } catch (e) {
      sendJson(res, 500, { ok: false, error: e.message });
    }
    return;
  }

  if (pathname === '/api/report/send') {
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST' });
      res.end('Method not allowed');
      return;
    }
    const auth = reportAuth(req);
    if (!auth.ok) {
      sendJson(res, auth.status, { ok: false, error: auth.error });
      return;
    }
    try {
      const body = await readBody(req);
      const result = await sendDailyReportEmail({
        trigger: 'manual-local',
        to: body.to,
        cc: body.cc,
        bcc: body.bcc,
        subject: body.subject,
        dryRun: body.dryRun === true,
      });
      sendJson(res, 200, result);
    } catch (e) {
      sendJson(res, 500, { ok: false, error: e.message });
    }
    return;
  }

  if (pathname.startsWith('/api/history')) {
    try {
      const backend = await getDbBackend();
      if (!backend) {
        if (pathname === '/api/history/runs') { sendJson(res, 200, { ok: true, mode: 'json', runs: await fallbackRuns() }); return; }
        if (pathname === '/api/history/movers') { sendJson(res, 200, { ok: true, mode: 'json', ...(await fallbackMovers()) }); return; }
        if (pathname === '/api/history/pvs') { sendJson(res, 200, { ok: true, mode: 'json', timeline: await fallbackPvsTimeline() }); return; }
        if (pathname === '/api/history/index') {
          const { capturedAt, items } = await fallbackLatestItems();
          sendJson(res, 200, { ok: true, mode: 'json', capturedAt, groups: priceIndex(items) });
          return;
        }
        if (pathname === '/api/history/market') {
          sendJson(res, 200, { ok: true, mode: 'json', rows: await fallbackMarketTimeline() });
          return;
        }
        if (pathname === '/api/history/series') {
          const key = new URL(req.url, `http://${host}:${port}`).searchParams.get('key');
          sendJson(res, 200, { ok: true, mode: 'json', key, series: key ? await fallbackPriceSeries(key) : [] });
          return;
        }
      }
      const { db, mod } = backend;
      if (pathname === '/api/history/runs') { sendJson(res, 200, { ok: true, mode: 'sqlite', runs: mod.listRuns(db) }); return; }
      if (pathname === '/api/history/movers') { sendJson(res, 200, { ok: true, mode: 'sqlite', ...mod.movers(db) }); return; }
      if (pathname === '/api/history/pvs') { sendJson(res, 200, { ok: true, mode: 'sqlite', timeline: mod.pvsTimeline(db) }); return; }
      if (pathname === '/api/history/index') {
        const { capturedAt, items } = mod.latestRunItems(db);
        sendJson(res, 200, { ok: true, mode: 'sqlite', capturedAt, groups: priceIndex(items) });
        return;
      }
      if (pathname === '/api/history/market') {
        sendJson(res, 200, { ok: true, mode: 'sqlite', rows: mod.marketTimeline(db) });
        return;
      }
      if (pathname === '/api/history/series') {
        const key = new URL(req.url, `http://${host}:${port}`).searchParams.get('key');
        sendJson(res, 200, { ok: true, mode: 'sqlite', key, series: key ? mod.priceSeries(db, key) : [] });
        return;
      }
      sendJson(res, 404, { ok: false, error: 'unknown history endpoint' });
    } catch (e) {
      sendJson(res, 500, { ok: false, error: e.message });
    }
    return;
  }

  const file = fileFor(req.url);
  if (!file || !existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const info = await stat(file);
  if (!info.isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Sarubbi Retail Watch: http://${host}:${port} (sarubbi.com.uy)`);
  scheduleAutoRefresh();
});
