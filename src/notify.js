// Compara las últimas 2 snapshots de history.jsonl y manda alertas por Telegram
// si hay cambios significativos. Si no hay TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID, sale sin hacer nada.
import { readFile, existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;
const THRESHOLD_PCT = Number(process.env.ALERT_THRESHOLD_PCT || 5); // % de cambio mínimo

const SUPER_LABEL = { tata: 'Tata', disco: 'Disco', devoto: 'Devoto', tiendainglesa: 'Tienda Inglesa' };

if (!TOKEN || !CHAT) {
  console.log('Telegram no configurado (faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID). Skip.');
  process.exit(0);
}

const HISTORY = 'public/data/history.jsonl';
const PRODUCTS = 'public/data/products.json';

let history;
try { history = (await fs.readFile(HISTORY, 'utf8')).split('\n').filter(Boolean).map((l) => JSON.parse(l)); }
catch { console.log('Sin history.jsonl. Skip.'); process.exit(0); }

if (history.length < 2) { console.log(`Solo ${history.length} snapshot(s). Necesito ≥2 para comparar. Skip.`); process.exit(0); }

let products = {};
try { products = JSON.parse(await fs.readFile(PRODUCTS, 'utf8')); } catch {}

const [prev, curr] = history.slice(-2);
const changes = [];
for (const key of Object.keys(curr.prices)) {
  const newP = curr.prices[key];
  const oldP = prev.prices[key];
  if (oldP == null || newP == null) continue;
  if (oldP === newP) continue;
  const diff = newP - oldP;
  const pct = (diff / oldP) * 100;
  if (Math.abs(pct) >= THRESHOLD_PCT) {
    const meta = products[key] || {};
    changes.push({ key, name: meta.name || key, brand: meta.brand, super: meta.super, group: meta.group, oldP, newP, diff, pct, url: meta.url });
  }
}

const newProducts = Object.keys(curr.prices).filter((k) => !(k in prev.prices));
const removedProducts = Object.keys(prev.prices).filter((k) => !(k in curr.prices));

if (!changes.length && !newProducts.length && !removedProducts.length) {
  console.log(`Sin cambios significativos (umbral: ${THRESHOLD_PCT}%). Skip.`);
  process.exit(0);
}

// Agrupar bajadas y subidas
const drops = changes.filter((c) => c.pct < 0).sort((a, b) => a.pct - b.pct).slice(0, 8);
const rises = changes.filter((c) => c.pct > 0).sort((a, b) => b.pct - a.pct).slice(0, 8);

const fmtChange = (c) => {
  const sup = SUPER_LABEL[c.super] || c.super;
  const arrow = c.pct < 0 ? '⬇️' : '⬆️';
  const sign = c.pct > 0 ? '+' : '';
  return `${arrow} ${c.name.slice(0, 50)}\n   ${sup} · $${c.oldP.toLocaleString('es-UY')} → $${c.newP.toLocaleString('es-UY')} (${sign}${c.pct.toFixed(1)}%)`;
};

const fmtDate = new Date(curr.t).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' });

let msg = `🛒 *Precios Bimbo · ${fmtDate}*\n\n`;
if (drops.length) {
  msg += `*💰 Bajadas (top ${drops.length}):*\n${drops.map(fmtChange).join('\n')}\n\n`;
}
if (rises.length) {
  msg += `*📈 Subidas (top ${rises.length}):*\n${rises.map(fmtChange).join('\n')}\n\n`;
}
if (newProducts.length) {
  msg += `🆕 *Productos nuevos:* ${newProducts.length}\n`;
}
if (removedProducts.length) {
  msg += `❌ *Productos que ya no aparecen:* ${removedProducts.length}\n`;
}
msg += `\nVer todo: https://precios-bimbo.vercel.app`;

const resp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: CHAT,
    text: msg,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  }),
});

const result = await resp.json();
if (resp.ok && result.ok) {
  console.log(`✓ Telegram enviado: ${drops.length} bajadas, ${rises.length} subidas, ${newProducts.length} nuevos, ${removedProducts.length} removidos`);
} else {
  console.error('Error Telegram:', result);
  process.exit(1);
}
