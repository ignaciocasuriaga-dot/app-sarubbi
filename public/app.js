// App principal - vistas: Catálogo, Comparador, Ofertas, Informe Gerencial

const SUPER_LABEL = { tata: 'Tata', disco: 'Disco', devoto: 'Devoto', tiendainglesa: 'Tienda Inglesa' };
const SUPERS = ['tata', 'disco', 'devoto', 'tiendainglesa'];

const state = {
  items: [],
  generatedAt: null,
  view: 'catalog',
  catalog: { q: '', brands: new Set(), supers: new Set(), sort: { key: 'price', asc: true } },
  compare: { q: '', brand: '' },
  offers: { q: '' },
  clusters: [],
};

// ===== Util =====
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function escape(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtPrice(p) { return p == null ? '—' : '$ ' + p.toLocaleString('es-UY'); }
function fmtPriceNoSign(p) { return p == null ? '—' : p.toLocaleString('es-UY'); }
function stripAccents(s) { return s.normalize('NFD').replace(/\p{Diacritic}/gu, ''); }
function toast(msg, kind = '') {
  $$('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 5500);
}

// ===== Normalización para clustering =====
function extractSize(name) {
  // Extrae primera ocurrencia de tamaño/cantidad (gramos, ml, kg, litros, unidades)
  const rx = /(\d+(?:[.,]\d+)?)\s*(kg|kilos?|gr?\b|gramos|ml|cc|lts?|litros?|un|u\b|unid(?:ades?)?|x\s*\d+)/i;
  const m = name.match(rx);
  if (!m) return null;
  const num = Number(m[1].replace(',', '.'));
  let unit = m[2].toLowerCase().replace(/\s+/g, '');
  // Normalizar unidades
  if (/^(g|gr|gramos)$/.test(unit)) unit = 'g';
  else if (/^(kg|kilo|kilos)$/.test(unit)) { unit = 'g'; }
  else if (/^(ml|cc)$/.test(unit)) unit = 'ml';
  else if (/^(l|lt|lts|litro|litros)$/.test(unit)) { unit = 'ml'; }
  else if (/^(un|u|unid|unidad|unidades)$/.test(unit)) unit = 'u';
  // Pasar a unidad base
  let value = num;
  if (m[2].toLowerCase().startsWith('kg') || m[2].toLowerCase().startsWith('kilo')) value = num * 1000;
  if (/^(l|lt|lts|litro|litros)$/i.test(m[2])) value = num * 1000;
  return { value: Math.round(value), unit };
}

function normalizeName(name) {
  let n = stripAccents(name.toLowerCase());
  n = n.replace(/\b(bimbo|lalo|los\s*sorchantes|maestro\s*cubano|nutrabien|salmas|tia\s*rosa)\b/g, ' ');
  n = n.replace(/\d+(?:[.,]\d+)?\s*(kg|kilos?|gr?|gramos|ml|cc|lts?|litros?|un|u|unid(?:ades?)?|x\s*\d+)\b/g, ' ');
  n = n.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  // Eliminar stopwords cortas
  const stop = new Set(['de', 'la', 'el', 'con', 'sin', 'y', 'a', 'en', 'para', 'gr', 'g']);
  return n.split(' ').filter((w) => w && w.length > 1 && !stop.has(w)).join(' ');
}

function tokenize(name) { return new Set(normalizeName(name).split(' ').filter(Boolean)); }

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

// Agrupa productos equivalentes entre supers basándose en marca + tamaño + similitud de tokens
function clusterProducts(items) {
  const groups = [];
  // Pre-calcular tokens y tamaños
  const enriched = items.map((it) => ({
    item: it,
    tokens: tokenize(it.name),
    size: extractSize(it.name),
  }));

  for (const cur of enriched) {
    let bestGroup = null;
    let bestScore = 0;
    for (const g of groups) {
      // Misma marca obligatoria
      if (g.brand !== cur.item.brand) continue;
      // Mismo tamaño aprox (si ambos lo tienen)
      if (cur.size && g.size) {
        if (cur.size.unit !== g.size.unit) continue;
        const ratio = Math.min(cur.size.value, g.size.value) / Math.max(cur.size.value, g.size.value);
        if (ratio < 0.85) continue; // permitimos 15% de diferencia
      }
      const score = jaccard(cur.tokens, g.tokens);
      if (score > bestScore && score >= 0.55) { // umbral de similitud
        bestScore = score;
        bestGroup = g;
      }
    }
    if (bestGroup) {
      bestGroup.items.push(cur.item);
      // Unir tokens (intersección para mantener "core" del producto)
      const intersection = new Set();
      for (const t of cur.tokens) if (bestGroup.tokens.has(t)) intersection.add(t);
      if (intersection.size >= 2) bestGroup.tokens = intersection;
    } else {
      groups.push({
        brand: cur.item.brand,
        size: cur.size,
        tokens: new Set(cur.tokens),
        items: [cur.item],
        label: cur.item.name,
      });
    }
  }
  // Ordenar items dentro de cada cluster por precio asc
  for (const g of groups) {
    g.items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    // Mejor label: el nombre más corto y representativo
    g.label = g.items.slice().sort((a, b) => a.name.length - b.name.length)[0].name;
  }
  return groups;
}

// ===== Carga =====
async function load() {
  try {
    const r = await fetch('/data/latest.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('No se pudo cargar latest.json');
    const data = await r.json();
    state.items = data.items || [];
    state.generatedAt = data.generatedAt;
    state.clusters = clusterProducts(state.items);
    renderAll();
  } catch (e) {
    console.error(e);
    $('#lastUpdate').innerHTML = '<b>Sin datos.</b><br>Tocá "Actualizar precios" para hacer el primer scrape.';
  }
}

function renderAll() {
  renderHeader();
  renderKPIs();
  renderCatalog();
  renderCompare();
  renderOffers();
  renderExecutive();
  updateTabBadges();
}

// ===== Header =====
function renderHeader() {
  if (!state.generatedAt) return;
  const d = new Date(state.generatedAt);
  $('#lastUpdate').innerHTML = `<b>Última actualización</b><br>${d.toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' })}`;
}

// ===== KPIs =====
function renderKPIs() {
  const total = state.items.length;
  const supers = new Set(state.items.map((i) => i.super)).size;
  const offers = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);
  const avgPrice = total ? Math.round(state.items.reduce((s, i) => s + (i.price ?? 0), 0) / total) : 0;
  const cheapest = state.items.filter((i) => i.price != null).sort((a, b) => a.price - b.price)[0];

  $('#kpis').innerHTML = `
    <div class="kpi">
      <div class="kpi-label">Productos relevados</div>
      <div class="kpi-value">${total}</div>
      <div class="kpi-sub">en ${supers} supermercados</div>
    </div>
    <div class="kpi azul">
      <div class="kpi-label">Precio promedio</div>
      <div class="kpi-value">${fmtPrice(avgPrice)}</div>
      <div class="kpi-sub">en todos los productos</div>
    </div>
    <div class="kpi verde">
      <div class="kpi-label">Ofertas activas</div>
      <div class="kpi-value">${offers.length}</div>
      <div class="kpi-sub">${total ? Math.round(offers.length / total * 100) : 0}% del catálogo</div>
    </div>
    <div class="kpi amarillo">
      <div class="kpi-label">Más barato</div>
      <div class="kpi-value">${fmtPrice(cheapest?.price)}</div>
      <div class="kpi-sub">${cheapest ? escape(cheapest.name.slice(0, 28)) : '—'}</div>
    </div>
  `;
}

// ===== Vista: Catálogo =====
function buildChips(items, key, container, stateSet) {
  const values = [...new Set(items.map((i) => i[key]))].sort();
  container.innerHTML = values.map((v) => {
    const label = key === 'super' ? SUPER_LABEL[v] : v;
    const active = stateSet.has(v);
    return `<span class="chip ${active ? 'active' : ''}" data-${key}="${v}">${escape(label)}</span>`;
  }).join('');
  container.querySelectorAll('.chip').forEach((el) => {
    el.addEventListener('click', () => {
      const v = el.dataset[key];
      if (stateSet.has(v)) stateSet.delete(v); else stateSet.add(v);
      el.classList.toggle('active');
      renderCatalog();
    });
  });
}

function filterItems(items, q, brands, supers) {
  const qn = stripAccents(q.toLowerCase().trim());
  return items.filter((i) => {
    if (qn && !stripAccents(i.name.toLowerCase()).includes(qn)) return false;
    if (brands.size && !brands.has(i.brand)) return false;
    if (supers.size && !supers.has(i.super)) return false;
    return true;
  });
}

function sortItems(items, sort) {
  const dir = sort.asc ? 1 : -1;
  return items.slice().sort((a, b) => {
    const va = a[sort.key], vb = b[sort.key];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb), 'es') * dir;
  });
}

function renderCatalog() {
  buildChips(state.items, 'brand', $('#brandChips'), state.catalog.brands);
  buildChips(state.items, 'super', $('#superChips'), state.catalog.supers);
  const items = sortItems(filterItems(state.items, state.catalog.q, state.catalog.brands, state.catalog.supers), state.catalog.sort);
  const tbody = $('#catalogRows');
  const empty = $('#catalogEmpty');
  if (!items.length) { tbody.innerHTML = ''; empty.style.display = 'block'; }
  else {
    empty.style.display = 'none';
    tbody.innerHTML = items.map((i) => {
      const isOffer = i.listPrice && i.price && i.listPrice > i.price;
      const discountPct = isOffer ? Math.round((1 - i.price / i.listPrice) * 100) : 0;
      return `<tr>
        <td>${i.url ? `<a href="${escape(i.url)}" target="_blank" rel="noopener">${escape(i.name)}</a>` : escape(i.name)}</td>
        <td class="brand">${escape(i.brand)}</td>
        <td><span class="pill ${i.super}">${SUPER_LABEL[i.super] || i.super}</span></td>
        <td class="price">${fmtPrice(i.price)}${isOffer ? `<br><span class="price list">${fmtPrice(i.listPrice)}</span>` : ''}</td>
        <td>${isOffer ? `<span class="discount-badge">−${discountPct}%</span>` : ''}</td>
      </tr>`;
    }).join('');
  }
  $('#catalogCount').textContent = items.length;
  // Update sort headers
  $$('#tableCatalog th[data-sort]').forEach((th) => {
    th.classList.toggle('sorted', th.dataset.sort === state.catalog.sort.key);
    th.classList.toggle('asc', th.dataset.sort === state.catalog.sort.key && state.catalog.sort.asc);
  });
}

// ===== Vista: Comparador =====
function renderCompare() {
  const filteredClusters = state.clusters.filter((g) => {
    if (g.items.length < 2) return false; // mostrar solo si hay al menos 2 supers
    if (state.compare.brand && g.brand !== state.compare.brand) return false;
    if (state.compare.q) {
      const qn = stripAccents(state.compare.q.toLowerCase());
      if (!stripAccents(g.label.toLowerCase()).includes(qn)) return false;
    }
    return true;
  }).sort((a, b) => {
    // Ordenar por mayor diferencia de precio
    const ap = a.items.map((x) => x.price).filter((p) => p != null);
    const bp = b.items.map((x) => x.price).filter((p) => p != null);
    const ad = ap.length ? Math.max(...ap) - Math.min(...ap) : 0;
    const bd = bp.length ? Math.max(...bp) - Math.min(...bp) : 0;
    return bd - ad;
  });

  // Brand selector
  const brands = [...new Set(state.items.map((i) => i.brand))].sort();
  if (!$('#compareBrand').options.length) {
    $('#compareBrand').innerHTML = '<option value="">Todas las marcas</option>' +
      brands.map((b) => `<option value="${b}">${b.replace(/\b\w/g, (c) => c.toUpperCase())}</option>`).join('');
  }

  const html = filteredClusters.map((g) => {
    const prices = g.items.map((x) => x.price).filter((p) => p != null);
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    const savings = (min != null && max != null && max > min) ? max - min : 0;
    const savingsPct = savings && max ? Math.round((1 - min / max) * 100) : 0;

    const cells = SUPERS.map((s) => {
      const it = g.items.find((x) => x.super === s);
      if (!it) return `<div class="compare-cell empty">
        <div class="compare-cell-label">${SUPER_LABEL[s]}</div>
        <div class="compare-cell-price">—</div>
      </div>`;
      const isBest = it.price === min;
      const diff = it.price != null && min != null && it.price > min ? `+$${(it.price - min).toLocaleString('es-UY')}` : '';
      return `<div class="compare-cell ${isBest ? 'best' : ''}">
        <div class="compare-cell-label">${SUPER_LABEL[s]}</div>
        <div class="compare-cell-price">${it.url ? `<a href="${escape(it.url)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">${fmtPrice(it.price)}</a>` : fmtPrice(it.price)}</div>
        ${isBest ? '<div class="compare-cell-diff" style="color:var(--offer);font-weight:700">★ Más barato</div>' : (diff ? `<div class="compare-cell-diff">${diff}</div>` : '')}
      </div>`;
    }).join('');

    return `<div class="compare-row">
      <div class="compare-prod">
        <div>
          <div class="compare-prod-name">${escape(g.label)}</div>
          <div class="compare-prod-brand">${escape(g.brand)} · ${g.items.length} supers</div>
        </div>
        ${savings > 0 ? `<div style="text-align:right">
          <div style="font-size:11px;color:var(--texto-muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em">Ahorro máx</div>
          <div style="font-size:18px;font-weight:800;color:var(--offer)">$ ${savings.toLocaleString('es-UY')}</div>
          <div style="font-size:11px;color:var(--offer)">−${savingsPct}%</div>
        </div>` : ''}
      </div>
      <div class="compare-prices">${cells}</div>
    </div>`;
  }).join('');

  $('#compareList').innerHTML = html || '<div class="empty">No se encontraron productos comparables entre supers.</div>';
  $('#compareCount').textContent = filteredClusters.length;
}

// ===== Vista: Ofertas =====
function renderOffers() {
  const offers = state.items
    .filter((i) => i.listPrice && i.price && i.listPrice > i.price)
    .map((i) => ({ ...i, discount: 1 - i.price / i.listPrice, savings: i.listPrice - i.price }))
    .sort((a, b) => b.discount - a.discount);

  const qn = stripAccents((state.offers.q || '').toLowerCase().trim());
  const filtered = qn ? offers.filter((o) => stripAccents(o.name.toLowerCase()).includes(qn)) : offers;

  const tbody = $('#offersRows');
  const empty = $('#offersEmpty');
  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map((o) => `
      <tr>
        <td>${o.url ? `<a href="${escape(o.url)}" target="_blank" rel="noopener">${escape(o.name)}</a>` : escape(o.name)}</td>
        <td class="brand">${escape(o.brand)}</td>
        <td><span class="pill ${o.super}">${SUPER_LABEL[o.super] || o.super}</span></td>
        <td class="price list">${fmtPrice(o.listPrice)}</td>
        <td class="price">${fmtPrice(o.price)}</td>
        <td class="price" style="color:var(--offer)">${fmtPrice(o.savings)}</td>
        <td><span class="discount-badge">−${Math.round(o.discount * 100)}%</span></td>
      </tr>
    `).join('');
  }
  $('#offersCount').textContent = filtered.length;
}

// ===== Vista: Informe Gerencial =====
function renderExecutive() {
  if (!state.items.length) {
    $('#execContent').innerHTML = '<div class="empty">Sin datos. Tocá "Actualizar precios" primero.</div>';
    return;
  }

  const items = state.items;
  const total = items.length;
  const offers = items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);

  // Por marca
  const byBrand = {};
  for (const i of items) (byBrand[i.brand] ??= []).push(i);
  const brandStats = Object.entries(byBrand).map(([brand, arr]) => {
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    const avg = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : null;
    const supersCovered = new Set(arr.map((x) => x.super)).size;
    return { brand, count: arr.length, avg, supersCovered, offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length };
  }).sort((a, b) => b.count - a.count);

  // Por super
  const bySuper = {};
  for (const i of items) (bySuper[i.super] ??= []).push(i);
  const superStats = SUPERS.map((s) => {
    const arr = bySuper[s] || [];
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    return {
      super: s,
      count: arr.length,
      avg: prices.length ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : null,
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
      offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length,
    };
  }).filter((s) => s.count);

  const maxCount = Math.max(...superStats.map((s) => s.count));

  // Diferencias de precio entre supers (top 5)
  const clustersWithSpread = state.clusters
    .filter((g) => g.items.length >= 2)
    .map((g) => {
      const prices = g.items.map((x) => x.price).filter((p) => p != null);
      const spread = prices.length ? Math.max(...prices) - Math.min(...prices) : 0;
      const pct = prices.length ? (1 - Math.min(...prices) / Math.max(...prices)) * 100 : 0;
      return { ...g, spread, pct };
    })
    .filter((g) => g.spread > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  // Top descuentos
  const topDiscounts = offers
    .map((o) => ({ ...o, pct: (1 - o.price / o.listPrice) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const date = state.generatedAt ? new Date(state.generatedAt).toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' }) : '—';

  $('#execContent').innerHTML = `
    <div class="print-only" style="margin-bottom:20px;border-bottom:2px solid #000;padding-bottom:10px">
      <h1 style="margin:0;font-size:22px">Informe Ejecutivo - Precios Bimbo Uruguay</h1>
      <p style="margin:4px 0 0;color:#555;font-size:12px">Generado: ${escape(date)} · Cobertura: Tata, Disco, Devoto, Tienda Inglesa</p>
    </div>

    <div class="kpis" style="margin-bottom:20px">
      <div class="kpi"><div class="kpi-label">SKUs totales</div><div class="kpi-value">${total}</div></div>
      <div class="kpi azul"><div class="kpi-label">Marcas relevadas</div><div class="kpi-value">${brandStats.length}</div></div>
      <div class="kpi verde"><div class="kpi-label">Ofertas vigentes</div><div class="kpi-value">${offers.length}</div><div class="kpi-sub">${Math.round(offers.length / total * 100)}% del catálogo</div></div>
      <div class="kpi amarillo"><div class="kpi-label">Productos comparables</div><div class="kpi-value">${clustersWithSpread.length}</div><div class="kpi-sub">presentes en 2+ supers</div></div>
    </div>

    <div class="exec-grid">
      <div class="exec-card">
        <h3>Performance por marca</h3>
        <div class="brand-stats">
          ${brandStats.map((b) => `
            <div class="brand-stat">
              <div>
                <div class="brand-stat-name">${escape(b.brand)}</div>
                <div class="brand-stat-detail">${b.count} SKUs · ${b.supersCovered}/4 supers · ${b.offers} ofertas</div>
              </div>
              <div style="text-align:right">
                <div class="brand-stat-value">${fmtPrice(b.avg)}</div>
                <div class="brand-stat-detail">precio promedio</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="exec-card">
        <h3>Cobertura por supermercado</h3>
        <div class="super-bars">
          ${superStats.map((s) => `
            <div class="super-bar">
              <div class="super-bar-header">
                <span><span class="pill ${s.super}">${SUPER_LABEL[s.super]}</span> ${s.count} SKUs · ${s.offers} ofertas</span>
                <span style="font-variant-numeric:tabular-nums">prom ${fmtPrice(s.avg)}</span>
              </div>
              <div class="super-bar-track">
                <div class="super-bar-fill ${s.super}" style="width:${(s.count / maxCount * 100).toFixed(1)}%"></div>
              </div>
              <div style="font-size:11px;color:var(--texto-muted);margin-top:3px">Rango: ${fmtPrice(s.min)} — ${fmtPrice(s.max)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="exec-card" style="margin-bottom:16px">
      <h3>Top 5 diferencias entre supermercados</h3>
      <p style="margin:0 0 10px;font-size:12px;color:var(--texto-muted)">Productos con la mayor diferencia porcentual de precio entre supers.</p>
      <table>
        <thead><tr><th>Producto</th><th>Marca</th><th class="price">Más barato</th><th class="price">Más caro</th><th class="price">Diferencia</th></tr></thead>
        <tbody>
          ${clustersWithSpread.map((g) => {
            const prices = g.items.map((x) => x.price).filter((p) => p != null);
            const minIdx = g.items.findIndex((x) => x.price === Math.min(...prices));
            const maxIdx = g.items.findIndex((x) => x.price === Math.max(...prices));
            const minIt = g.items[minIdx];
            const maxIt = g.items[maxIdx];
            return `<tr>
              <td>${escape(g.label)}</td>
              <td class="brand">${escape(g.brand)}</td>
              <td class="price">${fmtPrice(minIt.price)} <span class="pill ${minIt.super}" style="font-size:9px">${SUPER_LABEL[minIt.super]}</span></td>
              <td class="price">${fmtPrice(maxIt.price)} <span class="pill ${maxIt.super}" style="font-size:9px">${SUPER_LABEL[maxIt.super]}</span></td>
              <td class="price" style="color:var(--rojo)">$ ${g.spread.toLocaleString('es-UY')} · ${g.pct.toFixed(1)}%</td>
            </tr>`;
          }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--texto-muted)">No hay productos comparables.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div class="exec-card">
      <h3>Top 5 mayores descuentos</h3>
      <table>
        <thead><tr><th>Producto</th><th>Marca</th><th>Super</th><th class="price">Lista</th><th class="price">Oferta</th><th>Descuento</th></tr></thead>
        <tbody>
          ${topDiscounts.map((o) => `
            <tr>
              <td>${escape(o.name)}</td>
              <td class="brand">${escape(o.brand)}</td>
              <td><span class="pill ${o.super}">${SUPER_LABEL[o.super]}</span></td>
              <td class="price list">${fmtPrice(o.listPrice)}</td>
              <td class="price">${fmtPrice(o.price)}</td>
              <td><span class="discount-badge">−${Math.round(o.pct)}%</span></td>
            </tr>
          `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--texto-muted)">No hay ofertas activas.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div style="text-align:center;margin-top:24px" class="no-print">
      <button class="btn azul btn-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
    </div>

    <p class="print-only" style="margin-top:30px;font-size:10px;color:#555;text-align:center;border-top:1px solid #ccc;padding-top:10px">
      Datos relevados automáticamente de los sitios web oficiales de cada supermercado.
    </p>
  `;
}

// ===== Badges en tabs =====
function updateTabBadges() {
  const offers = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length;
  const comparable = state.clusters.filter((g) => g.items.length >= 2).length;
  $('#badgeCatalog').textContent = state.items.length;
  $('#badgeCompare').textContent = comparable;
  $('#badgeOffers').textContent = offers;
}

// ===== Tabs =====
function switchTab(name) {
  state.view = name;
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
}

// ===== Refresh =====
async function pollUntilDone(initialGeneratedAt) {
  const start = Date.now();
  const maxMs = 8 * 60 * 1000;
  while (Date.now() - start < maxMs) {
    await new Promise((r) => setTimeout(r, 15000));
    try {
      const r = await fetch('/data/latest.json', { cache: 'no-store' });
      if (r.ok) {
        const d = await r.json();
        if (d.generatedAt && d.generatedAt !== initialGeneratedAt) return d;
      }
      const s = await fetch('/api/status', { cache: 'no-store' });
      if (s.ok) {
        const sd = await s.json();
        const elapsed = Math.round((Date.now() - start) / 1000);
        $('#refreshBtn').innerHTML = `<span class="spinner"></span> ${sd.status === 'queued' ? 'En cola…' : 'Scraping…'} (${elapsed}s)`;
        if (sd.status === 'completed' && sd.conclusion === 'failure') {
          throw new Error('El scrape falló. Mirá los logs en GitHub Actions.');
        }
      }
    } catch (e) { console.warn('poll', e); }
  }
  throw new Error('Timeout esperando el nuevo scrape (>8 min).');
}

async function refresh() {
  const btn = $('#refreshBtn');
  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  const initial = state.generatedAt;
  try {
    btn.innerHTML = '<span class="spinner"></span> Disparando…';
    const resp = await fetch('/api/refresh', { method: 'POST' });
    const data = await resp.json();
    if (!resp.ok || data.ok === false) throw new Error(data.error || `HTTP ${resp.status}`);
    toast('Scrape disparado. Esperando resultados (~3-5 min)…');
    btn.innerHTML = '<span class="spinner"></span> Scraping…';
    await pollUntilDone(initial);
    toast('Listo. Datos actualizados.', 'success');
    await load();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

// ===== Eventos =====
function initEvents() {
  // Tabs
  $$('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  // Refresh
  $('#refreshBtn').addEventListener('click', refresh);

  // Catálogo
  $('#catalogQ').addEventListener('input', (e) => { state.catalog.q = e.target.value; renderCatalog(); });
  $$('#tableCatalog th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.catalog.sort.key === key) state.catalog.sort.asc = !state.catalog.sort.asc;
      else state.catalog.sort = { key, asc: key !== 'price' };
      renderCatalog();
    });
  });

  // Comparador
  $('#compareQ').addEventListener('input', (e) => { state.compare.q = e.target.value; renderCompare(); });
  $('#compareBrand').addEventListener('change', (e) => { state.compare.brand = e.target.value; renderCompare(); });

  // Ofertas
  $('#offersQ').addEventListener('input', (e) => { state.offers.q = e.target.value; renderOffers(); });
}

// ===== Auto-swap de assets oficiales si están subidos en public/ =====
// Busca /mascot.{png,svg,jpg,webp} y /logo.{png,svg,jpg,webp}. Si encuentra, swappea el placeholder.
function trySwapAsset(name, slotEl, imgClass) {
  if (!slotEl) return;
  const candidates = [`/${name}.svg`, `/${name}.png`, `/${name}.webp`, `/${name}.jpg`];
  let i = 0;
  const tryNext = () => {
    if (i >= candidates.length) return;
    const test = new Image();
    test.onload = () => {
      const img = document.createElement('img');
      img.src = candidates[i];
      img.className = imgClass;
      img.alt = '';
      slotEl.replaceWith(img);
    };
    test.onerror = () => { i++; tryNext(); };
    test.src = candidates[i];
  };
  tryNext();
}

trySwapAsset('mascot', document.getElementById('mascotSlot'), 'brand-mark-img');
trySwapAsset('logo', document.getElementById('logoSlot'), 'brand-logo-img');

initEvents();
load();
