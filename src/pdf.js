import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { chromium } from 'playwright-extra';

const SUPER_LABEL = { tata: 'Tata', disco: 'Disco', devoto: 'Devoto', tiendainglesa: 'Tienda Inglesa' };

async function latestJson() {
  const dir = 'data/output';
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort().reverse();
  if (!files.length) throw new Error('No hay JSONs en data/output. Corré "node src/main.js" primero.');
  return join(dir, files[0]);
}

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtPrice = (p) => (p == null ? '—' : '$ ' + p.toLocaleString('es-UY'));
const cap = (s) => String(s).replace(/\b\w/g, (c) => c.toUpperCase());

function stripAccents(s) { return s.normalize('NFD').replace(/\p{Diacritic}/gu, ''); }

// Clustering simple para comparar productos entre supers en el reporte
function clusterProducts(items) {
  const normalize = (name) => stripAccents(name.toLowerCase())
    .replace(/\b(bimbo|los\s*sorchantes|maestro\s*cubano|nutrabien|salmas|tia\s*rosa|pagnifique|pan\s*felipe|trigal|granix|el\s*trigal)\b/g, ' ')
    .replace(/\d+(?:[.,]\d+)?\s*(kg|kilos?|gr?|gramos|ml|cc|lts?|litros?|un|u|unid(?:ades?)?)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const extractSize = (name) => {
    const m = name.match(/(\d+(?:[.,]\d+)?)\s*(kg|gr?|gramos|ml|cc|lts?|un|u|unidades?)/i);
    if (!m) return null;
    let value = Number(m[1].replace(',', '.'));
    let unit = m[2].toLowerCase();
    if (/^(g|gr|gramos)$/.test(unit)) unit = 'g';
    else if (/^(kg)$/.test(unit)) { unit = 'g'; value *= 1000; }
    else if (/^(ml|cc)$/.test(unit)) unit = 'ml';
    else if (/^l|lt|lts$/.test(unit)) { unit = 'ml'; value *= 1000; }
    else unit = 'u';
    return { value: Math.round(value), unit };
  };

  const tokens = (n) => new Set(normalize(n).split(' ').filter((w) => w.length > 1));

  const jaccard = (a, b) => {
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / (a.size + b.size - inter);
  };

  const groups = [];
  for (const it of items) {
    const t = tokens(it.name);
    const sz = extractSize(it.name);
    let best = null, bestScore = 0;
    for (const g of groups) {
      if (g.brand !== it.brand) continue;
      if (sz && g.size && (sz.unit !== g.size.unit || Math.min(sz.value, g.size.value) / Math.max(sz.value, g.size.value) < 0.85)) continue;
      const s = jaccard(t, g.tokens);
      if (s > bestScore && s >= 0.55) { bestScore = s; best = g; }
    }
    if (best) best.items.push(it);
    else groups.push({ brand: it.brand, group: it.group, size: sz, tokens: t, items: [it] });
  }
  for (const g of groups) g.label = g.items.slice().sort((a, b) => a.name.length - b.name.length)[0].name;
  return groups;
}

function buildHtml({ items, generatedAt, groups }) {
  const date = new Date(generatedAt);
  const fmtDate = date.toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });

  // Stats
  const total = items.length;
  const bimbo = items.filter((i) => i.group === 'bimbo');
  const comp = items.filter((i) => i.group === 'competencia');
  const offers = items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);
  const avgBimbo = bimbo.length ? Math.round(bimbo.reduce((s, i) => s + (i.price ?? 0), 0) / bimbo.length) : 0;
  const avgComp = comp.length ? Math.round(comp.reduce((s, i) => s + (i.price ?? 0), 0) / comp.length) : 0;
  const positioning = avgComp ? ((avgBimbo / avgComp - 1) * 100) : null;

  // Por marca
  const byBrand = {};
  for (const i of items) (byBrand[i.brand] ??= []).push(i);
  const brandStats = Object.entries(byBrand).map(([brand, arr]) => {
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    return {
      brand, group: arr[0].group, count: arr.length,
      avg: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : null,
      supers: new Set(arr.map((x) => x.super)).size,
      offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length,
    };
  }).sort((a, b) => b.count - a.count);

  // Por super
  const bySuper = {};
  for (const i of items) (bySuper[i.super] ??= []).push(i);
  const superStats = Object.entries(bySuper).map(([s, arr]) => {
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    return {
      super: s, count: arr.length,
      avg: prices.length ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : null,
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
      bimbo: arr.filter((i) => i.group === 'bimbo').length,
      comp: arr.filter((i) => i.group === 'competencia').length,
      offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length,
    };
  }).sort((a, b) => b.count - a.count);
  const maxSuperCount = Math.max(...superStats.map((s) => s.count), 1);

  // Clusters con mayor spread
  const clusters = clusterProducts(items).filter((g) => g.items.length >= 2);
  const topSpread = clusters.map((g) => {
    const prices = g.items.map((x) => x.price).filter((p) => p != null);
    const spread = prices.length ? Math.max(...prices) - Math.min(...prices) : 0;
    const pct = prices.length ? (1 - Math.min(...prices) / Math.max(...prices)) * 100 : 0;
    return { ...g, spread, pct };
  }).filter((g) => g.spread > 0).sort((a, b) => b.pct - a.pct).slice(0, 8);

  // Top descuentos
  const topDiscounts = offers
    .map((o) => ({ ...o, pct: (1 - o.price / o.listPrice) * 100, savings: o.listPrice - o.price }))
    .sort((a, b) => b.pct - a.pct).slice(0, 10);

  // Conclusiones automáticas
  const conclusions = [];
  if (positioning !== null) {
    if (positioning > 5) {
      conclusions.push(`<b>Posicionamiento premium:</b> el precio promedio de Bimbo (${fmtPrice(avgBimbo)}) se ubica ${positioning.toFixed(1)}% por encima de la competencia (${fmtPrice(avgComp)}). Revisar si el diferencial está justificado por la propuesta de valor de cada SKU.`);
    } else if (positioning < -5) {
      conclusions.push(`<b>Oportunidad de margen:</b> Bimbo está ${Math.abs(positioning).toFixed(1)}% por debajo de competencia en promedio. Hay espacio para revisar política de precios en categorías clave.`);
    } else {
      conclusions.push(`<b>Posicionamiento alineado:</b> el precio promedio de Bimbo (${fmtPrice(avgBimbo)}) está en línea con la competencia (${fmtPrice(avgComp)}), con un diferencial de solo ${positioning.toFixed(1)}%.`);
    }
  }
  if (topSpread.length) {
    const top = topSpread[0];
    const minIt = top.items.reduce((a, b) => (a.price < b.price ? a : b));
    const maxIt = top.items.reduce((a, b) => (a.price > b.price ? a : b));
    conclusions.push(`<b>Mayor dispersión:</b> "${top.label}" presenta una diferencia de ${top.pct.toFixed(1)}% entre supers (${SUPER_LABEL[minIt.super]} ${fmtPrice(minIt.price)} → ${SUPER_LABEL[maxIt.super]} ${fmtPrice(maxIt.price)}). Revisar consistencia comercial.`);
  }
  const supersWithoutBimbo = superStats.filter((s) => s.bimbo === 0);
  if (supersWithoutBimbo.length) conclusions.push(`<b>Distribución incompleta:</b> ${supersWithoutBimbo.map((s) => SUPER_LABEL[s.super]).join(', ')} no presenta SKUs de Bimbo en este relevamiento. Verificar disponibilidad.`);
  const bimboWithoutOffers = bimbo.length && offers.filter((o) => o.group === 'bimbo').length === 0;
  if (bimboWithoutOffers) conclusions.push(`<b>Sin ofertas activas:</b> no se detectaron descuentos en productos Bimbo durante este relevamiento.`);
  if (offers.length) {
    const compOffers = offers.filter((o) => o.group === 'competencia').length;
    const bimboOffers = offers.filter((o) => o.group === 'bimbo').length;
    if (compOffers > bimboOffers * 1.5 && compOffers > 3) {
      conclusions.push(`<b>Presión promocional de competencia:</b> ${compOffers} productos competidores en oferta vs ${bimboOffers} de Bimbo. Evaluar respuesta promocional.`);
    }
  }

  // KPI cards
  const kpiCards = [
    { label: 'SKUs totales', value: total, sub: `${bimbo.length} Bimbo · ${comp.length} comp.`, color: '#E1251B' },
    { label: 'Precio prom. Bimbo', value: fmtPrice(avgBimbo), sub: `${bimbo.length} productos`, color: '#002E6D' },
    { label: 'Precio prom. Competencia', value: fmtPrice(avgComp), sub: `${comp.length} productos`, color: '#002E6D' },
    { label: 'Ofertas vigentes', value: offers.length, sub: `${total ? Math.round(offers.length / total * 100) : 0}% del catálogo`, color: '#2e7d32' },
  ];

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe Ejecutivo Precios Bimbo</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; font-size: 10.5px; margin: 0; line-height: 1.5; }

  /* ===== Portada ===== */
  .cover { page-break-after: always; min-height: 95vh; display: flex; flex-direction: column; justify-content: space-between; padding: 30px 10px; }
  .cover-top { border-left: 6px solid #E1251B; padding-left: 22px; }
  .cover-eyebrow { font-size: 11px; color: #002E6D; text-transform: uppercase; letter-spacing: .15em; font-weight: 700; margin-bottom: 8px; }
  .cover h1 { font-size: 38px; margin: 0 0 8px; line-height: 1.15; color: #1a1a1a; font-weight: 800; letter-spacing: -.02em; }
  .cover h2 { font-size: 18px; margin: 12px 0 0; color: #555; font-weight: 500; }
  .cover-meta { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; line-height: 1.9; }
  .cover-meta b { color: #1a1a1a; font-weight: 700; }
  .cover-bottom { text-align: center; color: #999; font-size: 10px; }

  /* ===== Header de páginas ===== */
  .page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E1251B; padding-bottom: 8px; margin-bottom: 18px; }
  .page-header .title { font-size: 14px; font-weight: 800; color: #E1251B; }
  .page-header .meta { font-size: 10px; color: #888; }

  /* ===== Layout ===== */
  section { page-break-inside: avoid; margin-bottom: 22px; }
  section h2 { font-size: 14px; margin: 0 0 12px; padding: 7px 14px; background: #002E6D; color: #fff; border-radius: 4px; display: inline-block; }
  section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #002E6D; margin: 0 0 8px; }
  .lead { font-size: 12px; line-height: 1.7; padding: 14px 18px; background: #fff8e7; border-left: 4px solid #E1251B; border-radius: 4px; margin-bottom: 18px; }

  /* ===== KPIs ===== */
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; }
  .kpi { padding: 12px 14px; border: 1px solid #e8dfc8; border-radius: 8px; position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
  .kpi-label { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: .07em; font-weight: 700; }
  .kpi-value { font-size: 20px; font-weight: 800; margin-top: 3px; }
  .kpi-sub { font-size: 9px; color: #888; }

  /* ===== Tablas ===== */
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  th { background: #fff8e7; padding: 7px 8px; text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #002E6D; border-bottom: 2px solid #e8dfc8; }
  td { padding: 6px 8px; border-bottom: 1px solid #f0e8d0; vertical-align: top; }
  td.price, th.price { text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; white-space: nowrap; }
  td.brand { color: #666; font-size: 9.5px; text-transform: capitalize; }

  /* ===== Pills ===== */
  .pill { display: inline-block; padding: 1.5px 7px; border-radius: 8px; color: #fff; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .pill.tata { background: #e5002b; }
  .pill.disco { background: #0070d2; }
  .pill.devoto { background: #f15c22; }
  .pill.tiendainglesa { background: #19744a; }
  .badge-comp { font-size: 8px; color: #002E6D; background: #e3f2fd; padding: 1px 5px; border-radius: 6px; margin-left: 4px; font-weight: 700; }
  .badge-bimbo { font-size: 8px; color: #E1251B; background: #ffebee; padding: 1px 5px; border-radius: 6px; margin-left: 4px; font-weight: 700; }
  .discount { background: #e8f5e9; color: #2e7d32; padding: 1.5px 6px; border-radius: 6px; font-size: 9px; font-weight: 700; }

  /* ===== Grid 2 cols ===== */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
  .grid2 .card { border: 1px solid #e8dfc8; border-radius: 8px; padding: 14px; }

  /* ===== Barra ===== */
  .bar-wrap { background: #fff8e7; height: 8px; border-radius: 4px; overflow: hidden; margin: 2px 0; }
  .bar { height: 100%; background: #E1251B; }
  .bar.azul { background: #002E6D; }

  /* ===== Conclusiones ===== */
  .conclusions { padding: 16px 20px; background: #f5f7fa; border-radius: 8px; border-left: 4px solid #002E6D; }
  .conclusions li { margin-bottom: 10px; line-height: 1.6; font-size: 11px; }
  .conclusions li:last-child { margin-bottom: 0; }

  footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 8.5px; }

  .group-label { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .group-label.bimbo { background: #ffebee; color: #E1251B; }
  .group-label.competencia { background: #e3f2fd; color: #002E6D; }
</style>
</head>
<body>

<!-- ===== PORTADA ===== -->
<div class="cover">
  <div>
    <div class="cover-top">
      <div class="cover-eyebrow">Informe Ejecutivo</div>
      <h1>Análisis de Precios<br>Grupo Bimbo Uruguay</h1>
      <h2>Relevamiento en supermercados online</h2>
    </div>
    <div class="cover-meta">
      <b>Fecha de relevamiento:</b> ${escape(fmtDate)}<br>
      <b>Supermercados:</b> Tata · Disco · Devoto · Tienda Inglesa<br>
      <b>SKUs analizados:</b> ${total} (${bimbo.length} Grupo Bimbo · ${comp.length} Competencia)<br>
      <b>Marcas relevadas:</b> ${brandStats.length} (${groups?.bimbo?.length ?? 0} del grupo, ${groups?.competencia?.length ?? 0} competidoras)
    </div>
  </div>
  <div class="cover-bottom">
    Generado automáticamente · Datos relevados de los sitios web oficiales de cada supermercado.
  </div>
</div>

<!-- ===== RESUMEN EJECUTIVO ===== -->
<div class="page-header">
  <div class="title">Resumen Ejecutivo</div>
  <div class="meta">${escape(fmtDate)} · pág 2</div>
</div>

<section>
  <p class="lead">
    Se relevaron <b>${total} productos</b> de las marcas del Grupo Bimbo y de sus principales competidores en panificados industriales, en las cuatro principales cadenas online de Uruguay.
    ${positioning !== null ? `El precio promedio de Bimbo se ubica un <b>${Math.abs(positioning).toFixed(1)}% ${positioning >= 0 ? 'por encima' : 'por debajo'}</b> del promedio de la competencia.` : ''}
    Se identificaron <b>${offers.length} ofertas activas</b> (${total ? Math.round(offers.length / total * 100) : 0}% del catálogo) y <b>${clusters.length} productos comparables</b> presentes en al menos 2 supermercados.
  </p>

  <div class="kpis">
    ${kpiCards.map((k) => `
      <div class="kpi" style="--c:${k.color}"><style>.kpi::before { background: ${k.color}; }</style>
        <div class="kpi-label">${escape(k.label)}</div>
        <div class="kpi-value">${escape(String(k.value))}</div>
        <div class="kpi-sub">${escape(k.sub)}</div>
      </div>
    `).join('')}
  </div>
</section>

<section>
  <h2>Hallazgos clave</h2>
  <ul class="conclusions">
    ${conclusions.map((c) => `<li>${c}</li>`).join('') || '<li>Sin hallazgos relevantes en este relevamiento.</li>'}
  </ul>
</section>

<!-- ===== PERFORMANCE POR MARCA ===== -->
<section>
  <h2>Performance por marca</h2>
  <table>
    <thead><tr><th>Marca</th><th>Grupo</th><th class="price">SKUs</th><th class="price">Supers</th><th class="price">Precio prom.</th><th class="price">Ofertas</th></tr></thead>
    <tbody>
      ${brandStats.map((b) => `
        <tr>
          <td><b>${escape(cap(b.brand))}</b></td>
          <td><span class="group-label ${b.group}">${b.group === 'bimbo' ? 'Bimbo' : 'Competencia'}</span></td>
          <td class="price">${b.count}</td>
          <td class="price">${b.supers}/4</td>
          <td class="price">${fmtPrice(b.avg)}</td>
          <td class="price">${b.offers}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</section>

<!-- ===== COBERTURA POR SUPER ===== -->
<section>
  <h2>Cobertura por supermercado</h2>
  <table>
    <thead><tr><th>Super</th><th class="price">SKUs</th><th class="price">Bimbo</th><th class="price">Comp.</th><th class="price">Prom.</th><th class="price">Rango</th><th class="price">Ofertas</th></tr></thead>
    <tbody>
      ${superStats.map((s) => `
        <tr>
          <td><span class="pill ${s.super}">${SUPER_LABEL[s.super]}</span></td>
          <td class="price">${s.count}</td>
          <td class="price">${s.bimbo}</td>
          <td class="price">${s.comp}</td>
          <td class="price">${fmtPrice(s.avg)}</td>
          <td class="price">${fmtPrice(s.min)} - ${fmtPrice(s.max)}</td>
          <td class="price">${s.offers}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</section>

<!-- ===== TOP DIFERENCIAS ENTRE SUPERS ===== -->
<section style="page-break-before:always">
<div class="page-header">
  <div class="title">Oportunidades de Optimización</div>
  <div class="meta">${escape(fmtDate)}</div>
</div>

  <h2>Top diferencias de precio entre supers</h2>
  <p style="font-size:10.5px;color:#666;margin:0 0 10px">Productos con mayor variación porcentual entre el super más barato y el más caro. Indica oportunidades de arbitraje o inconsistencia en la estrategia comercial.</p>
  <table>
    <thead><tr><th>Producto</th><th>Marca</th><th class="price">Más barato</th><th class="price">Más caro</th><th class="price">Diferencia</th></tr></thead>
    <tbody>
      ${topSpread.map((g) => {
        const prices = g.items.map((x) => x.price).filter((p) => p != null);
        const minIt = g.items.find((x) => x.price === Math.min(...prices));
        const maxIt = g.items.find((x) => x.price === Math.max(...prices));
        return `<tr>
          <td>${escape(g.label)}</td>
          <td class="brand">${escape(g.brand)} ${g.group === 'competencia' ? '<span class="badge-comp">C</span>' : '<span class="badge-bimbo">B</span>'}</td>
          <td class="price"><span class="pill ${minIt.super}">${SUPER_LABEL[minIt.super]}</span> ${fmtPrice(minIt.price)}</td>
          <td class="price"><span class="pill ${maxIt.super}">${SUPER_LABEL[maxIt.super]}</span> ${fmtPrice(maxIt.price)}</td>
          <td class="price" style="color:#E1251B">$ ${g.spread.toLocaleString('es-UY')} · ${g.pct.toFixed(1)}%</td>
        </tr>`;
      }).join('') || '<tr><td colspan="5" style="text-align:center;color:#999">No hay productos comparables.</td></tr>'}
    </tbody>
  </table>
</section>

<!-- ===== TOP DESCUENTOS ===== -->
<section>
  <h2>Top ofertas / descuentos detectados</h2>
  <p style="font-size:10.5px;color:#666;margin:0 0 10px">Ranking de productos con mayor porcentaje de descuento entre precio de lista y precio actual.</p>
  <table>
    <thead><tr><th>Producto</th><th>Marca</th><th>Super</th><th class="price">Lista</th><th class="price">Oferta</th><th class="price">Ahorra</th><th>%</th></tr></thead>
    <tbody>
      ${topDiscounts.map((o) => `
        <tr>
          <td>${escape(o.name)}</td>
          <td class="brand">${escape(o.brand)} ${o.group === 'competencia' ? '<span class="badge-comp">C</span>' : '<span class="badge-bimbo">B</span>'}</td>
          <td><span class="pill ${o.super}">${SUPER_LABEL[o.super]}</span></td>
          <td class="price" style="text-decoration:line-through;color:#999;font-weight:400">${fmtPrice(o.listPrice)}</td>
          <td class="price">${fmtPrice(o.price)}</td>
          <td class="price" style="color:#2e7d32">$ ${o.savings.toLocaleString('es-UY')}</td>
          <td><span class="discount">−${Math.round(o.pct)}%</span></td>
        </tr>
      `).join('') || '<tr><td colspan="7" style="text-align:center;color:#999">No hay ofertas activas.</td></tr>'}
    </tbody>
  </table>
</section>

<footer>
  Informe generado automáticamente · Datos relevados de los sitios web oficiales de Tata, Disco, Devoto y Tienda Inglesa · Para uso interno.
</footer>

</body></html>`;
}

async function main() {
  const jsonPath = process.argv[2] || (await latestJson());
  const data = JSON.parse(await readFile(jsonPath, 'utf8'));
  console.log(`Input: ${jsonPath} (${data.items.length} productos)`);

  const html = buildHtml(data);
  const htmlPath = jsonPath.replace(/\.json$/, '.html');
  const pdfPath = jsonPath.replace(/\.json$/, '.pdf');
  await writeFile(htmlPath, html);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
  });
  await browser.close();

  // Copia a public/data/latest.pdf
  await mkdir('public/data', { recursive: true });
  await writeFile('public/data/latest.pdf', await readFile(pdfPath));

  console.log(`✓ HTML: ${htmlPath}`);
  console.log(`✓ PDF:  ${pdfPath}`);
  console.log(`✓ Copiado a public/data/latest.pdf`);
}

main().catch((e) => { console.error(e); process.exit(1); });
