import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import {
  CATEGORY_LABEL,
  OWNER_LABEL,
  STORE_LABEL,
  brandLabel as brandNameLabel,
  enrichProduct,
  normalizeProductText,
} from './brands.js';
import {
  benchmarkBrandForSegment,
  competitiveSegment,
  liquidProfile,
  normalizeName,
} from './lib/normalize.js';

async function latestJson() {
  if (existsSync('public/data/latest.json')) return 'public/data/latest.json';
  const dir = 'data/output';
  const files = existsSync(dir)
    ? (await readdir(dir)).filter((file) => file.endsWith('.json')).sort().reverse()
    : [];
  if (files.length) return join(dir, files[0]);
  throw new Error('No JSON data found. Run "node src/main.js" first.');
}

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtPrice = (p) => (p == null || !Number.isFinite(Number(p)) ? '-' : '$ ' + Number(p).toLocaleString('es-UY', { maximumFractionDigits: 0 }));
const fmtPct = (p) => (p == null || !Number.isFinite(Number(p)) ? '-' : `${Number(p) > 0 ? '+' : ''}${Number(p).toFixed(1)}%`);
const fmtDate = (value) => new Date(value || Date.now()).toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });
const labelStore = (s) => STORE_LABEL[s] || s || '-';
const labelCategory = (c) => CATEGORY_LABEL[c] || c || '-';
const labelOwner = (o) => OWNER_LABEL[o] || o || '-';
const labelBrand = (item) => item.brandLabel || brandNameLabel(item.brand) || item.brand || '-';
const SUGGESTED_LABEL = { above: 'Sobre referencia', ok: 'Cumple', below: 'Bajo referencia' };

function logoDataUrl() {
  const path = 'public/assets/sarubbi/sarubbi-brand.jpeg';
  if (!existsSync(path)) return '';
  return `data:image/jpeg;base64,${readFileSync(path).toString('base64')}`;
}

function normalizeItem(item) {
  const clean = { ...item, name: normalizeProductText(item.name) };
  const enriched = enrichProduct(clean, clean.name);
  if (!enriched) {
    return {
      ...clean,
      owner: clean.owner || clean.group || 'competencia',
      group: clean.group || clean.owner || 'competencia',
      brandLabel: clean.brandLabel || brandNameLabel(clean.brand),
      category: clean.category || 'otros',
      categoryLabel: CATEGORY_LABEL[clean.category] || CATEGORY_LABEL.otros,
    };
  }
  return { ...clean, ...enriched };
}

function avg(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  return nums.length ? nums.reduce((sum, n) => sum + n, 0) / nums.length : null;
}

function unitSuffix(profile) {
  if (profile?.metric === 'kg') return '$/kg';
  if (profile?.metric === 'unit') return '$/unidad';
  return '$/unidad';
}

function fmtComparable(value, profile = null) {
  if (value == null || !Number.isFinite(Number(value))) return '-';
  return `$ ${Number(value).toLocaleString('es-UY', { maximumFractionDigits: 1 })} ${unitSuffix(profile)}`;
}

function priceMode(items) {
  const buckets = new Map();
  for (const item of items) {
    if (item.price == null || !Number.isFinite(Number(item.price))) continue;
    const price = Number(item.price);
    const key = price.toFixed(2);
    const bucket = buckets.get(key) || { price, count: 0, items: [] };
    bucket.count += 1;
    bucket.items.push(item);
    buckets.set(key, bucket);
  }
  return [...buckets.values()].sort((a, b) => (b.count - a.count) || (a.price - b.price))[0] || null;
}

function comparableEntries(items) {
  return items
    .map((item) => {
      const profile = liquidProfile(item);
      if (!profile) return null;
      return { item, profile, segment: competitiveSegment(item) };
    })
    .filter(Boolean);
}

function modeRows(items) {
  const groups = {};
  for (const entry of comparableEntries(items)) {
    const { item, profile, segment } = entry;
    const key = [
      item.group,
      item.category,
      item.brand,
      segment.key,
      profile.bucket?.label,
      normalizeName(item.name, labelBrand(item)),
    ].join('|');
    (groups[key] ??= { sample: item, segment, profile, items: [] }).items.push(item);
  }
  return Object.values(groups)
    .map((group) => {
      const mode = priceMode(group.items);
      if (!mode) return null;
      const prices = group.items.map((item) => Number(item.price)).filter(Number.isFinite);
      const stores = [...new Set(group.items.map((item) => item.super))];
      return {
        ...group,
        label: group.sample.name,
        count: prices.length,
        stores: stores.length,
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: avg(prices),
        modePrice: mode.price,
        modeShare: prices.length ? (mode.count / prices.length) * 100 : 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) =>
      (a.sample.group === b.sample.group ? 0 : a.sample.group === 'sarubbi' ? -1 : 1)
      || labelCategory(a.sample.category).localeCompare(labelCategory(b.sample.category), 'es')
      || labelBrand(a.sample).localeCompare(labelBrand(b.sample), 'es')
      || a.label.localeCompare(b.label, 'es'));
}

function competitiveRows(items) {
  const entries = comparableEntries(items);
  const competitors = new Map();
  const own = new Map();
  for (const entry of entries) {
    const { item, segment } = entry;
    const commonKey = `${item.category}|${segment.key}`;
    if (item.group === 'sarubbi') {
      const ownKey = `${commonKey}|${item.brand}`;
      const group = own.get(ownKey) || {
        category: item.category,
        brand: item.brand,
        brandLabel: labelBrand(item),
        segment,
        sarubbi: [],
      };
      group.sarubbi.push(entry);
      own.set(ownKey, group);
    } else {
      const group = competitors.get(commonKey) || [];
      group.push(entry);
      competitors.set(commonKey, group);
    }
  }
  return [...own.values()]
    .map((row) => {
      const comp = competitors.get(`${row.category}|${row.segment.key}`) || [];
      if (!comp.length) return null;
      const sarubbiAvg = avg(row.sarubbi.map((entry) => entry.profile.pricePerLiter));
      const compAvg = avg(comp.map((entry) => entry.profile.pricePerLiter));
      if (sarubbiAvg == null || compAvg == null) return null;
      const profile = row.sarubbi[0]?.profile || comp[0]?.profile;
      return {
        ...row,
        comp,
        profile,
        sarubbiAvg,
        compAvg,
        diff: sarubbiAvg - compAvg,
        pct: compAvg ? ((sarubbiAvg / compAvg) - 1) * 100 : null,
        benchmarkBrand: benchmarkBrandForSegment(row.segment.key),
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.pct || 0) - Math.abs(a.pct || 0));
}

function brandRows(items) {
  return Object.entries(items.reduce((acc, item) => {
    (acc[item.brand || 'sin_marca'] ??= []).push(item);
    return acc;
  }, {}))
    .map(([brand, arr]) => ({
      brand,
      label: labelBrand(arr[0]),
      owner: arr[0].group,
      category: arr[0].category,
      count: arr.length,
      stores: new Set(arr.map((item) => item.super)).size,
      avg: avg(arr.map((item) => item.price)),
    }))
    .sort((a, b) => b.count - a.count);
}

function storeRows(items) {
  return Object.entries(items.reduce((acc, item) => {
    (acc[item.super || 'manual'] ??= []).push(item);
    return acc;
  }, {}))
    .map(([store, arr]) => ({
      store,
      count: arr.length,
      sarubbi: arr.filter((item) => item.group === 'sarubbi').length,
      competitors: new Set(arr.filter((item) => item.group !== 'sarubbi').map((item) => item.brand)).size,
      avg: avg(arr.map((item) => item.price)),
      offers: arr.filter((item) => item.listPrice && item.price && item.listPrice > item.price).length,
    }))
    .sort((a, b) => b.count - a.count);
}

function metricRows(items) {
  const rows = { kg: 0, unit: 0, item: 0 };
  for (const item of items) {
    const profile = liquidProfile(item);
    rows[profile?.metric || 'item'] = (rows[profile?.metric || 'item'] || 0) + 1;
  }
  return [
    { key: '$/kg', label: 'Peso', count: rows.kg || 0 },
    { key: '$/unidad', label: 'Unidades', count: rows.unit || 0 },
    { key: '$/pieza', label: 'Sin formato explicito', count: rows.item || 0 },
  ];
}

function buildHtml({ items, generatedAt, scrapeResults = [] }) {
  const data = items.map(normalizeItem);
  const logoSrc = logoDataUrl();
  const generated = fmtDate(generatedAt);
  const sarubbi = data.filter((item) => item.group === 'sarubbi');
  const comp = data.filter((item) => item.group !== 'sarubbi');
  const suggested = data.filter((item) => item.suggestedPrice != null);
  const mode = modeRows(data);
  const competitive = competitiveRows(data).slice(0, 14);
  const brands = brandRows(data);
  const stores = storeRows(data);
  const metrics = metricRows(data);
  const offers = data
    .filter((item) => item.listPrice && item.price && item.listPrice > item.price)
    .sort((a, b) => (1 - a.price / a.listPrice) - (1 - b.price / b.listPrice))
    .reverse()
    .slice(0, 12);
  const suggestedRows = suggested
    .slice()
    .sort((a, b) => Math.abs(b.suggestedDeviationPct ?? 0) - Math.abs(a.suggestedDeviationPct ?? 0))
    .slice(0, 12);
  const categories = Object.keys(CATEGORY_LABEL).map((category) => {
    const sarubbiRows = comparableEntries(data.filter((item) => item.category === category && item.group === 'sarubbi'));
    const compRows = comparableEntries(data.filter((item) => item.category === category && item.group !== 'sarubbi'));
    const sarubbiAvg = avg(sarubbiRows.map((entry) => entry.profile.pricePerLiter));
    const compAvg = avg(compRows.map((entry) => entry.profile.pricePerLiter));
    return {
      category,
      sarubbi: sarubbiRows.length,
      comp: compRows.length,
      sarubbiAvg,
      compAvg,
      profile: sarubbiRows[0]?.profile || compRows[0]?.profile,
      gap: sarubbiAvg != null && compAvg ? ((sarubbiAvg / compAvg) - 1) * 100 : null,
    };
  }).filter((row) => row.sarubbi || row.comp);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Sarubbi Retail Watch - Informe</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #14213d; font-size: 10.5px; line-height: 1.45; }
  .cover { min-height: 96vh; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; padding: 26px 0 28px 24px; border-left: 9px solid #16359a; }
  .brand { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
  .logo { width: 158px; height: auto; border-radius: 4px; }
  .brand-sub { color: #16359a; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
  .brand-strip { height: 8px; width: 315px; margin-top: 10px; display: grid; grid-template-columns: 36% 18% 18% 14% 14%; overflow: hidden; border-radius: 999px; }
  .brand-strip span:nth-child(1) { background: #16359a; }
  .brand-strip span:nth-child(2) { background: #d91e36; }
  .brand-strip span:nth-child(3) { background: #f3b61f; }
  .brand-strip span:nth-child(4) { background: #159a6a; }
  .brand-strip span:nth-child(5) { background: #212529; }
  h1 { margin: 0; font-size: 37px; line-height: 1.08; color: #0d2583; }
  h2 { display: inline-block; margin: 0 0 10px; padding: 6px 10px; background: #16359a; color: #fff; border-radius: 4px; font-size: 12px; }
  h3 { margin: 0 0 8px; color: #16359a; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
  .meta { margin-top: 24px; padding-top: 14px; border-top: 1px solid #d9e2f2; color: #4b587c; line-height: 1.85; font-size: 12px; }
  .page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d91e36; padding-bottom: 8px; margin-bottom: 16px; }
  .title { color: #d91e36; font-weight: 900; font-size: 14px; }
  .lead { background: #f6f8ff; border-left: 4px solid #16359a; padding: 12px 14px; margin-bottom: 16px; font-size: 11px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px; }
  .kpi { border: 1px solid #d9e2f2; border-left: 4px solid #16359a; border-radius: 6px; padding: 10px; }
  .kpi-label { color: #59677d; font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
  .kpi-value { font-size: 18px; font-weight: 900; margin-top: 2px; }
  section { margin-bottom: 18px; page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; font-size: 9.2px; }
  th { background: #f3f6ff; color: #16359a; text-align: left; padding: 6px 7px; border-bottom: 1px solid #d9e2f2; font-size: 7.8px; text-transform: uppercase; letter-spacing: .05em; }
  td { padding: 5px 7px; border-bottom: 1px solid #edf1f8; vertical-align: top; }
  .price { text-align: right; font-weight: 800; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .positive { color: #d91e36; }
  .negative { color: #108158; }
  .pill { display: inline-block; border-radius: 999px; padding: 1px 6px; background: #16359a; color: #fff; font-size: 7.5px; font-weight: 800; text-transform: uppercase; }
  .status { display: inline-block; border-radius: 4px; padding: 1px 5px; font-size: 7.5px; font-weight: 900; text-transform: uppercase; }
  .status.above { background: rgba(217,30,54,.12); color: #d91e36; }
  .status.ok { background: #e8f6ef; color: #108158; }
  .status.below { background: rgba(22,53,154,.12); color: #16359a; }
  .muted { color: #59677d; font-size: 8.3px; }
  footer { margin-top: 24px; border-top: 1px solid #d9e2f2; padding-top: 8px; color: #59677d; text-align: center; font-size: 8px; }
</style>
</head>
<body>
<div class="cover">
  <div>
    <div class="brand">
      ${logoSrc ? `<img class="logo" src="${logoSrc}" alt="Sarubbi">` : '<div class="brand-sub">Sarubbi</div>'}
      <div><div class="brand-sub">Sarubbi Retail Watch</div><div class="brand-strip"><span></span><span></span><span></span><span></span><span></span></div></div>
    </div>
    <h1>Monitor comercial<br>de precios y gondola</h1>
    <div class="meta">
      <b>Fecha:</b> ${escape(generated)}<br>
      <b>Registros:</b> ${data.length}<br>
      <b>Productos Sarubbi:</b> ${sarubbi.length}<br>
      <b>Competencia:</b> ${comp.length}<br>
      <b>Cadenas:</b> ${stores.length}<br>
      <b>Referencia/PVS:</b> ${suggested.length} productos cruzados<br>
      <b>Fuentes OK:</b> ${scrapeResults.filter((r) => r.ok).length}/${scrapeResults.length}
    </div>
  </div>
  <div>Datos online y cargas manuales para presentar la oportunidad Sarubbi.</div>
</div>

<div class="page-header"><div class="title">Resumen ejecutivo</div><div>${escape(generated)}</div></div>
<p class="lead">Se consolidaron <b>${data.length}</b> registros de chacinados, carnes y congelados. El tablero compara Sarubbi contra Schneck, Centenario, Cattivelli, Ottonello, Camposur, La Constancia y Picorel con metricas normalizadas por peso, por 100 g y por unidad cuando el formato lo permite.</p>

<div class="kpis">
  <div class="kpi"><div class="kpi-label">SKUs Sarubbi</div><div class="kpi-value">${sarubbi.length}</div></div>
  <div class="kpi"><div class="kpi-label">Competencia</div><div class="kpi-value">${comp.length}</div></div>
  <div class="kpi"><div class="kpi-label">Cadenas</div><div class="kpi-value">${stores.length}</div></div>
  <div class="kpi"><div class="kpi-label">Marcas</div><div class="kpi-value">${brands.length}</div></div>
</div>

<section>
  <h2>Cobertura de datos</h2>
  <table>
    <thead><tr><th>Cadena</th><th class="price">Registros</th><th class="price">Sarubbi</th><th class="price">Competidores</th><th class="price">Promedio</th><th class="price">Ofertas</th></tr></thead>
    <tbody>${stores.map((s) => `<tr><td><span class="pill">${escape(labelStore(s.store))}</span></td><td class="price">${s.count}</td><td class="price">${s.sarubbi}</td><td class="price">${s.competitors}</td><td class="price">${fmtPrice(s.avg)}</td><td class="price">${s.offers}</td></tr>`).join('')}</tbody>
  </table>
</section>

<section>
  <h2>Metricas comparables</h2>
  <table>
    <thead><tr><th>Tipo</th><th>Uso</th><th class="price">Registros</th></tr></thead>
    <tbody>${metrics.map((m) => `<tr><td><b>${escape(m.key)}</b></td><td>${escape(m.label)}</td><td class="price">${m.count}</td></tr>`).join('')}</tbody>
  </table>
</section>

<section>
  <h2>Sarubbi vs competencia por categoria</h2>
  <table>
    <thead><tr><th>Categoria</th><th class="price">Sarubbi</th><th class="price">Comp.</th><th class="price">Prom. Sarubbi</th><th class="price">Prom. comp.</th><th class="price">Brecha</th></tr></thead>
    <tbody>${categories.map((c) => `<tr><td>${escape(labelCategory(c.category))}</td><td class="price">${c.sarubbi}</td><td class="price">${c.comp}</td><td class="price">${fmtComparable(c.sarubbiAvg, c.profile)}</td><td class="price">${fmtComparable(c.compAvg, c.profile)}</td><td class="price ${c.gap > 0 ? 'positive' : 'negative'}">${fmtPct(c.gap)}</td></tr>`).join('') || '<tr><td colspan="6">Sin categorias comparables.</td></tr>'}</tbody>
  </table>
</section>

<section>
  <h2>Precio moda por SKU</h2>
  <table>
    <thead><tr><th>Dueno</th><th>SKU</th><th>Marca</th><th>Categoria</th><th>Presentacion</th><th class="price">Moda</th><th class="price">Rango</th></tr></thead>
    <tbody>${mode.slice(0, 18).map((r) => `<tr><td>${escape(labelOwner(r.sample.group))}</td><td><b>${escape(r.label)}</b><br><span class="muted">${r.count} obs. / ${r.stores} cadenas</span></td><td>${escape(labelBrand(r.sample))}</td><td>${escape(labelCategory(r.sample.category))}</td><td>${escape(r.segment.label)}</td><td class="price">${fmtPrice(r.modePrice)}<br><span class="muted">${r.modeShare.toFixed(0)}%</span></td><td class="price">${fmtPrice(r.min)} - ${fmtPrice(r.max)}</td></tr>`).join('') || '<tr><td colspan="7">Sin precios moda.</td></tr>'}</tbody>
  </table>
</section>

<section style="page-break-before: always">
  <div class="page-header"><div class="title">Brechas accionables</div><div>${escape(generated)}</div></div>
  <h2>Presentaciones comparables</h2>
  <p class="muted">Cada fila compara una marca Sarubbi contra competidores de la misma categoria y presentacion. El benchmark sugerido es automatico por rubro.</p>
  <table>
    <thead><tr><th>Categoria</th><th>Marca Sarubbi</th><th>Presentacion</th><th>Benchmark</th><th class="price">Sarubbi</th><th class="price">Comp.</th><th class="price">Brecha</th></tr></thead>
    <tbody>${competitive.map((r) => `<tr><td>${escape(labelCategory(r.category))}</td><td><b>${escape(r.brandLabel)}</b></td><td>${escape(r.segment.label)}<br><span class="muted">${r.sarubbi.length} propios / ${r.comp.length} comp.</span></td><td>${escape(brandNameLabel(r.benchmarkBrand) || r.benchmarkBrand)}</td><td class="price">${fmtComparable(r.sarubbiAvg, r.profile)}</td><td class="price">${fmtComparable(r.compAvg, r.profile)}</td><td class="price ${r.diff > 0 ? 'positive' : 'negative'}">${fmtComparable(Math.abs(r.diff), r.profile)}<br>${fmtPct(r.pct)}</td></tr>`).join('') || '<tr><td colspan="7">Sin presentaciones comparables.</td></tr>'}</tbody>
  </table>
</section>

<section>
  <h2>Control referencia/PVS</h2>
  <table>
    <thead><tr><th>Producto</th><th>Cadena</th><th class="price">Precio</th><th class="price">Referencia</th><th class="price">Desvio</th><th>Estado</th></tr></thead>
    <tbody>${suggestedRows.map((item) => `<tr><td><b>${escape(item.name)}</b><br><span class="muted">${escape(item.suggestedProduct || '-')} - ${escape(item.suggestedSource || '-')}</span></td><td>${escape(labelStore(item.super))}</td><td class="price">${fmtPrice(item.price)}</td><td class="price">${fmtPrice(item.suggestedPrice)}</td><td class="price ${item.suggestedStatus === 'above' ? 'positive' : item.suggestedStatus === 'below' ? 'negative' : ''}">${fmtPct(item.suggestedDeviationPct)}</td><td><span class="status ${escape(item.suggestedStatus || '')}">${escape(SUGGESTED_LABEL[item.suggestedStatus] || '-')}</span></td></tr>`).join('') || '<tr><td colspan="6">Sin lista oficial cargada todavia. El modulo queda preparado para CSV/JSON.</td></tr>'}</tbody>
  </table>
</section>

<section>
  <h2>Top descuentos detectados</h2>
  <table>
    <thead><tr><th>Producto</th><th>Marca</th><th>Cadena</th><th class="price">Lista</th><th class="price">Oferta</th><th class="price">%</th></tr></thead>
    <tbody>${offers.map((o) => `<tr><td>${escape(o.name)}</td><td>${escape(labelBrand(o))}</td><td>${escape(labelStore(o.super))}</td><td class="price">${fmtPrice(o.listPrice)}</td><td class="price">${fmtPrice(o.price)}</td><td class="price">${Math.round((1 - o.price / o.listPrice) * 100)}%</td></tr>`).join('') || '<tr><td colspan="6">Sin ofertas detectadas.</td></tr>'}</tbody>
  </table>
</section>

<section>
  <h2>Marcas relevadas</h2>
  <table>
    <thead><tr><th>Marca</th><th>Dueno</th><th>Categoria dominante</th><th class="price">Registros</th><th class="price">Cadenas</th><th class="price">Promedio</th></tr></thead>
    <tbody>${brands.map((b) => `<tr><td><b>${escape(b.label)}</b></td><td>${escape(labelOwner(b.owner))}</td><td>${escape(labelCategory(b.category))}</td><td class="price">${b.count}</td><td class="price">${b.stores}</td><td class="price">${fmtPrice(b.avg)}</td></tr>`).join('')}</tbody>
  </table>
</section>

<footer>Informe generado automaticamente para propuesta Sarubbi Retail Watch.</footer>
</body>
</html>`;
}

async function main() {
  const jsonPath = process.argv[2] || (await latestJson());
  const data = JSON.parse(await readFile(jsonPath, 'utf8'));
  console.log(`Input: ${jsonPath} (${(data.items || []).length} productos)`);

  const html = buildHtml(data);
  const htmlPath = jsonPath.replace(/\.json$/, '.html');
  const pdfPath = jsonPath.replace(/\.json$/, '.pdf');
  await writeFile(htmlPath, html, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
  });
  await browser.close();

  await mkdir('public/data', { recursive: true });
  await writeFile('public/data/latest.pdf', await readFile(pdfPath));

  console.log(`OK HTML: ${htmlPath}`);
  console.log(`OK PDF:  ${pdfPath}`);
  console.log('OK Copiado a public/data/latest.pdf');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
