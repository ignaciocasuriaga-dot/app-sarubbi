// App principal - vistas: Catálogo, Comparador, Ofertas, Posicionamiento, Informe Gerencial

const SUPER_LABEL = { tata: 'Tata', disco: 'Disco', devoto: 'Devoto', tiendainglesa: 'Tienda Inglesa' };
const SUPERS = ['tata', 'disco', 'devoto', 'tiendainglesa'];
const GROUP_LABEL = { bimbo: 'Grupo Bimbo', competencia: 'Competencia', otra: 'Otra' };

const state = {
  items: [],
  groups: { bimbo: [], competencia: [] },
  generatedAt: null,
  view: 'catalog',
  history: null,           // array de snapshots {t, prices}
  catalog: { q: '', brands: new Set(), supers: new Set(), groups: new Set(), sort: { key: 'price', asc: true } },
  compare: { q: '', brand: '' },
  offers: { q: '' },
  clusters: [],
};

// ===== Util =====
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtPrice = (p) => p == null ? '—' : '$ ' + p.toLocaleString('es-UY');
const stripAccents = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '');

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
  const rx = /(\d+(?:[.,]\d+)?)\s*(kg|kilos?|gr?\b|gramos|ml|cc|lts?|litros?|un|u\b|unid(?:ades?)?|x\s*\d+)/i;
  const m = name.match(rx);
  if (!m) return null;
  const num = Number(m[1].replace(',', '.'));
  let unit = m[2].toLowerCase().replace(/\s+/g, '');
  let value = num;
  if (/^(g|gr|gramos)$/.test(unit)) unit = 'g';
  else if (/^(kg|kilo|kilos)$/.test(unit)) { unit = 'g'; value = num * 1000; }
  else if (/^(ml|cc)$/.test(unit)) unit = 'ml';
  else if (/^(l|lt|lts|litro|litros)$/.test(unit)) { unit = 'ml'; value = num * 1000; }
  else if (/^(un|u|unid|unidad|unidades)$/.test(unit)) unit = 'u';
  return { value: Math.round(value), unit };
}

function normalizeName(name) {
  let n = stripAccents(name.toLowerCase());
  n = n.replace(/\b(bimbo|lalo|los\s*sorchantes|maestro\s*cubano|nutrabien|salmas|tia\s*rosa|pagnifique|pan\s*felipe|trigal|granix|el\s*trigal)\b/g, ' ');
  n = n.replace(/\d+(?:[.,]\d+)?\s*(kg|kilos?|gr?|gramos|ml|cc|lts?|litros?|un|u|unid(?:ades?)?|x\s*\d+)\b/g, ' ');
  n = n.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const stop = new Set(['de', 'la', 'el', 'con', 'sin', 'y', 'a', 'en', 'para', 'gr', 'g']);
  return n.split(' ').filter((w) => w && w.length > 1 && !stop.has(w)).join(' ');
}

const tokenize = (name) => new Set(normalizeName(name).split(' ').filter(Boolean));

function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

function clusterProducts(items) {
  const groups = [];
  const enriched = items.map((it) => ({ item: it, tokens: tokenize(it.name), size: extractSize(it.name) }));
  for (const cur of enriched) {
    let bestGroup = null;
    let bestScore = 0;
    for (const g of groups) {
      if (g.brand !== cur.item.brand) continue;
      if (cur.size && g.size) {
        if (cur.size.unit !== g.size.unit) continue;
        const ratio = Math.min(cur.size.value, g.size.value) / Math.max(cur.size.value, g.size.value);
        if (ratio < 0.85) continue;
      }
      const score = jaccard(cur.tokens, g.tokens);
      if (score > bestScore && score >= 0.55) { bestScore = score; bestGroup = g; }
    }
    if (bestGroup) {
      bestGroup.items.push(cur.item);
      const intersection = new Set();
      for (const t of cur.tokens) if (bestGroup.tokens.has(t)) intersection.add(t);
      if (intersection.size >= 2) bestGroup.tokens = intersection;
    } else {
      groups.push({ brand: cur.item.brand, group: cur.item.group, size: cur.size, tokens: new Set(cur.tokens), items: [cur.item], label: cur.item.name });
    }
  }
  for (const g of groups) {
    g.items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
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
    state.groups = data.groups || { bimbo: [], competencia: [] };
    state.generatedAt = data.generatedAt;
    state.clusters = clusterProducts(state.items);
    renderAll();
  } catch (e) {
    console.error(e);
    $('#lastUpdate').innerHTML = '<b>Sin datos.</b><br>Tocá "Actualizar precios" para hacer el primer scrape.';
  }
  loadHistory();
}

async function loadHistory() {
  try {
    const r = await fetch('/data/history.jsonl', { cache: 'no-store' });
    if (!r.ok) return;
    const text = await r.text();
    state.history = text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (e) { console.warn('Sin histórico aún:', e.message); }
}

function renderAll() {
  renderHeader();
  renderKPIs();
  renderCatalog();
  renderCompare();
  renderOffers();
  renderPositioning();
  renderExecutive();
  updateTabBadges();
}

function renderHeader() {
  if (!state.generatedAt) return;
  const d = new Date(state.generatedAt);
  $('#lastUpdate').innerHTML = `<b>Última actualización</b><br>${d.toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' })}`;
}

function renderKPIs() {
  const bimboItems = state.items.filter((i) => i.group === 'bimbo');
  const compItems = state.items.filter((i) => i.group === 'competencia');
  const offers = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);
  const avgBimbo = bimboItems.length ? Math.round(bimboItems.reduce((s, i) => s + (i.price ?? 0), 0) / bimboItems.length) : 0;
  const avgComp = compItems.length ? Math.round(compItems.reduce((s, i) => s + (i.price ?? 0), 0) / compItems.length) : 0;
  const diff = avgComp ? Math.round((avgBimbo / avgComp - 1) * 100) : 0;

  $('#kpis').innerHTML = `
    <div class="kpi">
      <div class="kpi-label">Productos Bimbo</div>
      <div class="kpi-value">${bimboItems.length}</div>
      <div class="kpi-sub">prom ${fmtPrice(avgBimbo)}</div>
    </div>
    <div class="kpi azul">
      <div class="kpi-label">Productos Competencia</div>
      <div class="kpi-value">${compItems.length}</div>
      <div class="kpi-sub">prom ${fmtPrice(avgComp)}</div>
    </div>
    <div class="kpi ${diff >= 0 ? 'amarillo' : 'verde'}">
      <div class="kpi-label">Posición Bimbo vs Comp.</div>
      <div class="kpi-value">${diff >= 0 ? '+' : ''}${diff}%</div>
      <div class="kpi-sub">${diff >= 0 ? 'más caro que' : 'más barato que'} competencia</div>
    </div>
    <div class="kpi verde">
      <div class="kpi-label">Ofertas activas</div>
      <div class="kpi-value">${offers.length}</div>
      <div class="kpi-sub">${state.items.length ? Math.round(offers.length / state.items.length * 100) : 0}% del catálogo</div>
    </div>
  `;
}

// ===== Catálogo =====
function buildChips(items, key, container, stateSet, labels = null) {
  const values = [...new Set(items.map((i) => i[key]))].filter(Boolean).sort();
  container.innerHTML = values.map((v) => {
    const label = labels ? (labels[v] ?? v) : v;
    const active = stateSet.has(v);
    return `<span class="chip ${active ? 'active' : ''}" data-${key}="${escape(v)}">${escape(label)}</span>`;
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

function filterItems(items, q, brands, supers, groups) {
  const qn = stripAccents(q.toLowerCase().trim());
  return items.filter((i) => {
    if (qn && !stripAccents(i.name.toLowerCase()).includes(qn)) return false;
    if (brands.size && !brands.has(i.brand)) return false;
    if (supers.size && !supers.has(i.super)) return false;
    if (groups.size && !groups.has(i.group)) return false;
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
  buildChips(state.items, 'group', $('#groupChips'), state.catalog.groups, GROUP_LABEL);
  buildChips(state.items, 'brand', $('#brandChips'), state.catalog.brands);
  buildChips(state.items, 'super', $('#superChips'), state.catalog.supers, SUPER_LABEL);
  const items = sortItems(filterItems(state.items, state.catalog.q, state.catalog.brands, state.catalog.supers, state.catalog.groups), state.catalog.sort);
  const tbody = $('#catalogRows');
  const empty = $('#catalogEmpty');
  if (!items.length) { tbody.innerHTML = ''; empty.style.display = 'block'; }
  else {
    empty.style.display = 'none';
    tbody.innerHTML = items.map((i) => {
      const isOffer = i.listPrice && i.price && i.listPrice > i.price;
      const discountPct = isOffer ? Math.round((1 - i.price / i.listPrice) * 100) : 0;
      const key = `${i.super}:${i.sku}`;
      return `<tr>
        <td><a href="#" class="product-link" data-key="${escape(key)}">${escape(i.name)}</a></td>
        <td class="brand">${escape(i.brand)} ${i.group === 'competencia' ? '<span style="font-size:9px;color:var(--azul);background:#e3f2fd;padding:1px 5px;border-radius:6px;margin-left:4px">COMP</span>' : ''}</td>
        <td><span class="pill ${i.super}">${SUPER_LABEL[i.super] || i.super}</span></td>
        <td class="price">${fmtPrice(i.price)}${isOffer ? `<br><span class="price list">${fmtPrice(i.listPrice)}</span>` : ''}</td>
        <td>${isOffer ? `<span class="discount-badge">−${discountPct}%</span>` : ''}</td>
      </tr>`;
    }).join('');
    bindProductLinks(tbody);
  }
  $('#catalogCount').textContent = items.length;
  $$('#tableCatalog th[data-sort]').forEach((th) => {
    th.classList.toggle('sorted', th.dataset.sort === state.catalog.sort.key);
    th.classList.toggle('asc', th.dataset.sort === state.catalog.sort.key && state.catalog.sort.asc);
  });
}

// ===== Comparador =====
function renderCompare() {
  const filteredClusters = state.clusters.filter((g) => {
    if (g.items.length < 2) return false;
    if (state.compare.brand && g.brand !== state.compare.brand) return false;
    if (state.compare.q) {
      const qn = stripAccents(state.compare.q.toLowerCase());
      if (!stripAccents(g.label.toLowerCase()).includes(qn)) return false;
    }
    return true;
  }).sort((a, b) => {
    const ap = a.items.map((x) => x.price).filter((p) => p != null);
    const bp = b.items.map((x) => x.price).filter((p) => p != null);
    const ad = ap.length ? Math.max(...ap) - Math.min(...ap) : 0;
    const bd = bp.length ? Math.max(...bp) - Math.min(...bp) : 0;
    return bd - ad;
  });

  const brands = [...new Set(state.items.map((i) => i.brand))].sort();
  if (!$('#compareBrand').options.length) {
    $('#compareBrand').innerHTML = '<option value="">Todas las marcas</option>' +
      brands.map((b) => `<option value="${escape(b)}">${escape(b.replace(/\b\w/g, (c) => c.toUpperCase()))}</option>`).join('');
  }

  const html = filteredClusters.map((g) => {
    const prices = g.items.map((x) => x.price).filter((p) => p != null);
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    const savings = (min != null && max != null && max > min) ? max - min : 0;
    const savingsPct = savings && max ? Math.round((1 - min / max) * 100) : 0;
    const cells = SUPERS.map((s) => {
      const it = g.items.find((x) => x.super === s);
      if (!it) return `<div class="compare-cell empty"><div class="compare-cell-label">${SUPER_LABEL[s]}</div><div class="compare-cell-price">—</div></div>`;
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
          <div class="compare-prod-brand">${escape(g.brand)} · ${g.items.length} supers ${g.group === 'competencia' ? '· <span style="color:var(--azul);font-weight:700">Competencia</span>' : ''}</div>
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
  $('#compareList').innerHTML = html || '<div class="empty">No hay productos comparables.</div>';
  $('#compareCount').textContent = filteredClusters.length;
}

// ===== Ofertas =====
function renderOffers() {
  const offers = state.items
    .filter((i) => i.listPrice && i.price && i.listPrice > i.price)
    .map((i) => ({ ...i, discount: 1 - i.price / i.listPrice, savings: i.listPrice - i.price }))
    .sort((a, b) => b.discount - a.discount);
  const qn = stripAccents((state.offers.q || '').toLowerCase().trim());
  const filtered = qn ? offers.filter((o) => stripAccents(o.name.toLowerCase()).includes(qn)) : offers;
  const tbody = $('#offersRows');
  const empty = $('#offersEmpty');
  if (!filtered.length) { tbody.innerHTML = ''; empty.style.display = 'block'; }
  else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map((o) => {
      const key = `${o.super}:${o.sku}`;
      return `<tr>
        <td><a href="#" class="product-link" data-key="${escape(key)}">${escape(o.name)}</a></td>
        <td class="brand">${escape(o.brand)}</td>
        <td><span class="pill ${o.super}">${SUPER_LABEL[o.super] || o.super}</span></td>
        <td class="price list">${fmtPrice(o.listPrice)}</td>
        <td class="price">${fmtPrice(o.price)}</td>
        <td class="price" style="color:var(--offer)">${fmtPrice(o.savings)}</td>
        <td><span class="discount-badge">−${Math.round(o.discount * 100)}%</span></td>
      </tr>`;
    }).join('');
    bindProductLinks(tbody);
  }
  $('#offersCount').textContent = filtered.length;
}

// ===== Posicionamiento (Bimbo vs Competencia) =====
function renderPositioning() {
  const bimbo = state.items.filter((i) => i.group === 'bimbo');
  const comp = state.items.filter((i) => i.group === 'competencia');

  // Por super: precio promedio Bimbo vs Competencia
  const perSuper = SUPERS.map((s) => {
    const b = bimbo.filter((i) => i.super === s).map((i) => i.price).filter((p) => p != null);
    const c = comp.filter((i) => i.super === s).map((i) => i.price).filter((p) => p != null);
    const avgB = b.length ? Math.round(b.reduce((sum, x) => sum + x, 0) / b.length) : null;
    const avgC = c.length ? Math.round(c.reduce((sum, x) => sum + x, 0) / c.length) : null;
    return { super: s, countBimbo: b.length, countComp: c.length, avgBimbo: avgB, avgComp: avgC };
  });

  // Productos competidores ordenados por precio
  const compTop = comp.filter((i) => i.price != null).sort((a, b) => a.price - b.price);

  const maxAvg = Math.max(...perSuper.flatMap((s) => [s.avgBimbo, s.avgComp]).filter((x) => x != null), 1);

  $('#positioningContent').innerHTML = `
    <div class="exec-grid">
      <div class="exec-card">
        <h3>Precio promedio por super</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${perSuper.map((s) => `
            <div>
              <div style="font-size:12px;font-weight:700;margin-bottom:6px"><span class="pill ${s.super}">${SUPER_LABEL[s.super]}</span></div>
              <div style="font-size:11px;color:var(--texto-muted);margin-bottom:3px;display:flex;justify-content:space-between">
                <span>Bimbo (${s.countBimbo})</span><span style="font-weight:700;color:var(--rojo)">${fmtPrice(s.avgBimbo)}</span>
              </div>
              <div style="background:var(--crema);height:8px;border-radius:4px;overflow:hidden;margin-bottom:6px">
                <div style="background:var(--rojo);height:100%;width:${s.avgBimbo ? (s.avgBimbo / maxAvg * 100).toFixed(0) : 0}%"></div>
              </div>
              <div style="font-size:11px;color:var(--texto-muted);margin-bottom:3px;display:flex;justify-content:space-between">
                <span>Competencia (${s.countComp})</span><span style="font-weight:700;color:var(--azul)">${fmtPrice(s.avgComp)}</span>
              </div>
              <div style="background:var(--crema);height:8px;border-radius:4px;overflow:hidden">
                <div style="background:var(--azul);height:100%;width:${s.avgComp ? (s.avgComp / maxAvg * 100).toFixed(0) : 0}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="exec-card">
        <h3>Resumen ejecutivo</h3>
        <p style="font-size:13px;line-height:1.6;margin:0 0 12px;color:var(--texto)">${buildExecutiveSummary(bimbo, comp)}</p>
        <hr style="border:none;border-top:1px solid var(--border);margin:14px 0">
        <div style="font-size:12px;line-height:1.7">
          <div><b>SKUs Bimbo:</b> ${bimbo.length} en ${new Set(bimbo.map((i) => i.super)).size} supers</div>
          <div><b>SKUs Competencia:</b> ${comp.length} en ${new Set(comp.map((i) => i.super)).size} supers</div>
          <div><b>Marcas Bimbo:</b> ${new Set(bimbo.map((i) => i.brand)).size}</div>
          <div><b>Marcas Competencia:</b> ${new Set(comp.map((i) => i.brand)).size}</div>
        </div>
      </div>
    </div>

    <div class="exec-card">
      <h3>Productos de competencia (${compTop.length})</h3>
      ${compTop.length === 0 ? '<div class="empty" style="padding:20px">No se encontraron productos de competencia en el último scrape. Editá <code>src/brands.js</code> para sumar marcas.</div>' :
      `<table>
        <thead><tr><th>Producto</th><th>Marca</th><th>Super</th><th class="price">Precio</th></tr></thead>
        <tbody>${compTop.slice(0, 20).map((i) => `
          <tr>
            <td>${i.url ? `<a href="${escape(i.url)}" target="_blank" rel="noopener">${escape(i.name)}</a>` : escape(i.name)}</td>
            <td class="brand">${escape(i.brand)}</td>
            <td><span class="pill ${i.super}">${SUPER_LABEL[i.super]}</span></td>
            <td class="price">${fmtPrice(i.price)}</td>
          </tr>
        `).join('')}</tbody>
      </table>${compTop.length > 20 ? `<div style="margin-top:8px;font-size:11px;color:var(--texto-muted);text-align:center">Mostrando los 20 más baratos de ${compTop.length}</div>` : ''}`}
    </div>
  `;
}

function buildExecutiveSummary(bimbo, comp) {
  if (!bimbo.length) return 'Aún no hay datos de Bimbo. Tocá "Actualizar precios" para hacer el primer scrape.';
  if (!comp.length) return `Se relevaron <b>${bimbo.length}</b> productos del Grupo Bimbo. No se encontraron productos de las marcas competidoras configuradas. Considerá ajustar <code>src/brands.js</code>.`;
  const avgB = Math.round(bimbo.reduce((s, i) => s + (i.price ?? 0), 0) / bimbo.length);
  const avgC = Math.round(comp.reduce((s, i) => s + (i.price ?? 0), 0) / comp.length);
  const diff = ((avgB - avgC) / avgC * 100);
  const direction = diff > 0 ? 'por encima' : 'por debajo';
  const absDiff = Math.abs(diff).toFixed(1);
  return `El precio promedio del catálogo Bimbo es <b>${fmtPrice(avgB)}</b>, ubicándose <b>${absDiff}% ${direction}</b> del promedio de la competencia (<b>${fmtPrice(avgC)}</b>). Se relevaron ${bimbo.length} SKUs Bimbo y ${comp.length} de competencia en ${new Set(state.items.map((i) => i.super)).size} supermercados.`;
}

// ===== Informe Gerencial =====
function renderExecutive() {
  if (!state.items.length) {
    $('#execContent').innerHTML = '<div class="empty">Sin datos. Tocá "Actualizar precios" primero.</div>';
    return;
  }
  const items = state.items;
  const total = items.length;
  const bimbo = items.filter((i) => i.group === 'bimbo');
  const comp = items.filter((i) => i.group === 'competencia');
  const offers = items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);

  const byBrand = {};
  for (const i of items) (byBrand[i.brand] ??= []).push(i);
  const brandStats = Object.entries(byBrand).map(([brand, arr]) => {
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    const avg = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : null;
    return { brand, group: arr[0].group, count: arr.length, avg, supersCovered: new Set(arr.map((x) => x.super)).size, offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length };
  }).sort((a, b) => b.count - a.count);

  const bySuper = {};
  for (const i of items) (bySuper[i.super] ??= []).push(i);
  const superStats = SUPERS.map((s) => {
    const arr = bySuper[s] || [];
    const prices = arr.map((x) => x.price).filter((p) => p != null);
    return {
      super: s, count: arr.length,
      avg: prices.length ? Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length) : null,
      min: prices.length ? Math.min(...prices) : null,
      max: prices.length ? Math.max(...prices) : null,
      offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length,
      bimbo: arr.filter((i) => i.group === 'bimbo').length,
      comp: arr.filter((i) => i.group === 'competencia').length,
    };
  }).filter((s) => s.count);
  const maxCount = Math.max(...superStats.map((s) => s.count));

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

  const topDiscounts = offers
    .map((o) => ({ ...o, pct: (1 - o.price / o.listPrice) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const date = new Date(state.generatedAt).toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });

  $('#execContent').innerHTML = `
    <div class="print-only" style="margin-bottom:20px;border-bottom:2px solid var(--rojo);padding-bottom:14px">
      <h1 style="margin:0;font-size:24px;color:var(--rojo)">Informe Ejecutivo · Precios Bimbo Uruguay</h1>
      <p style="margin:6px 0 0;color:#555;font-size:12px">Generado: ${escape(date)} · Tata · Disco · Devoto · Tienda Inglesa</p>
    </div>

    <div class="kpis" style="margin-bottom:20px">
      <div class="kpi"><div class="kpi-label">SKUs totales</div><div class="kpi-value">${total}</div><div class="kpi-sub">${bimbo.length} Bimbo · ${comp.length} comp.</div></div>
      <div class="kpi azul"><div class="kpi-label">Marcas relevadas</div><div class="kpi-value">${brandStats.length}</div></div>
      <div class="kpi verde"><div class="kpi-label">Ofertas vigentes</div><div class="kpi-value">${offers.length}</div><div class="kpi-sub">${Math.round(offers.length / total * 100)}% del catálogo</div></div>
      <div class="kpi amarillo"><div class="kpi-label">Productos comparables</div><div class="kpi-value">${clustersWithSpread.length}</div><div class="kpi-sub">presentes en 2+ supers</div></div>
    </div>

    <div class="exec-card" style="margin-bottom:16px">
      <h3>Resumen</h3>
      <p style="margin:0;font-size:13px;line-height:1.6">${buildExecutiveSummary(bimbo, comp)}</p>
    </div>

    <div class="exec-grid">
      <div class="exec-card">
        <h3>Performance por marca</h3>
        <div class="brand-stats">
          ${brandStats.map((b) => `
            <div class="brand-stat">
              <div>
                <div class="brand-stat-name">${escape(b.brand)} ${b.group === 'competencia' ? '<span style="font-size:9px;color:var(--azul);background:#e3f2fd;padding:1px 5px;border-radius:6px;margin-left:4px">COMP</span>' : ''}</div>
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
                <span><span class="pill ${s.super}">${SUPER_LABEL[s.super]}</span> ${s.count} SKUs (${s.bimbo}B · ${s.comp}C) · ${s.offers} ofertas</span>
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
      <p style="margin:0 0 10px;font-size:12px;color:var(--texto-muted)">Productos con mayor diferencia % de precio entre supers (oportunidad de optimización de compra/venta).</p>
      <table>
        <thead><tr><th>Producto</th><th>Marca</th><th class="price">Más barato</th><th class="price">Más caro</th><th class="price">Diferencia</th></tr></thead>
        <tbody>
          ${clustersWithSpread.map((g) => {
            const prices = g.items.map((x) => x.price).filter((p) => p != null);
            const minIt = g.items.find((x) => x.price === Math.min(...prices));
            const maxIt = g.items.find((x) => x.price === Math.max(...prices));
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

    <div class="exec-card" style="margin-bottom:16px">
      <h3>Top 5 mayores descuentos</h3>
      <table>
        <thead><tr><th>Producto</th><th>Marca</th><th>Super</th><th class="price">Lista</th><th class="price">Oferta</th><th>Descuento</th></tr></thead>
        <tbody>
          ${topDiscounts.map((o) => `<tr>
              <td>${escape(o.name)}</td>
              <td class="brand">${escape(o.brand)}</td>
              <td><span class="pill ${o.super}">${SUPER_LABEL[o.super]}</span></td>
              <td class="price list">${fmtPrice(o.listPrice)}</td>
              <td class="price">${fmtPrice(o.price)}</td>
              <td><span class="discount-badge">−${Math.round(o.pct)}%</span></td>
            </tr>`).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--texto-muted)">No hay ofertas.</td></tr>'}
        </tbody>
      </table>
    </div>

    <div style="text-align:center;margin-top:24px" class="no-print">
      <button class="btn azul btn-print" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
      <a class="btn" href="/data/latest.pdf" download style="margin-left:8px">📄 Descargar PDF generado</a>
    </div>
    <p class="print-only" style="margin-top:30px;font-size:10px;color:#555;text-align:center;border-top:1px solid #ccc;padding-top:10px">Datos relevados automáticamente.</p>
  `;
}

// ===== Tabs =====
function updateTabBadges() {
  const offers = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length;
  const comparable = state.clusters.filter((g) => g.items.length >= 2).length;
  $('#badgeCatalog').textContent = state.items.length;
  $('#badgeCompare').textContent = comparable;
  $('#badgeOffers').textContent = offers;
}

function switchTab(name) {
  state.view = name;
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
}

// ===== Modal de evolución de precio =====
function bindProductLinks(root) {
  root.querySelectorAll('.product-link').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal(a.dataset.key);
    });
  });
}

function openProductModal(key) {
  const item = state.items.find((i) => `${i.super}:${i.sku}` === key);
  if (!item) return;
  const points = (state.history || [])
    .map((s) => ({ t: new Date(s.t).getTime(), p: s.prices[key] }))
    .filter((x) => x.p != null);

  $('#modalContent').innerHTML = `
    <h2 style="margin:0 0 4px;font-size:18px">${escape(item.name)}</h2>
    <div style="font-size:13px;color:var(--texto-muted);margin-bottom:14px">
      <span style="text-transform:capitalize;font-weight:600">${escape(item.brand)}</span> ·
      <span class="pill ${item.super}">${SUPER_LABEL[item.super]}</span> ·
      ${item.group === 'competencia' ? '<span style="color:var(--azul);font-weight:700">Competencia</span>' : '<span style="color:var(--rojo);font-weight:700">Grupo Bimbo</span>'}
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
      <div class="kpi" style="padding:10px 12px"><div class="kpi-label">Precio actual</div><div style="font-size:20px;font-weight:800">${fmtPrice(item.price)}</div></div>
      <div class="kpi azul" style="padding:10px 12px"><div class="kpi-label">Precio lista</div><div style="font-size:20px;font-weight:800">${fmtPrice(item.listPrice)}</div></div>
      <div class="kpi verde" style="padding:10px 12px"><div class="kpi-label">Snapshots</div><div style="font-size:20px;font-weight:800">${points.length}</div></div>
    </div>

    <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--azul);margin:18px 0 8px">Evolución del precio</h3>
    ${renderSparkline(points)}
    ${points.length >= 2 ? buildHistoryTable(points) : '<div class="empty" style="padding:14px">Hay ${points.length} snapshot(s). Necesitamos ≥2 para mostrar evolución. Volvé a actualizar precios en un rato.</div>'.replace('${points.length}', points.length)}

    ${item.url ? `<div style="margin-top:16px;text-align:right"><a class="btn" href="${escape(item.url)}" target="_blank" rel="noopener">Ver en el super →</a></div>` : ''}
  `;
  $('#modal').classList.add('show');
}

function renderSparkline(points) {
  if (points.length < 2) {
    return '<div style="padding:40px;text-align:center;background:var(--crema);border-radius:10px;color:var(--texto-muted);font-size:13px">📈 Histórico aún no disponible (necesita al menos 2 snapshots).</div>';
  }
  const W = 600, H = 140, P = 20;
  const xs = points.map((x) => x.t);
  const ys = points.map((x) => x.p);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const padY = (maxY - minY) * 0.15 || 5;
  const ymin = minY - padY, ymax = maxY + padY;
  const xFor = (t) => P + ((t - minX) / Math.max(1, maxX - minX)) * (W - 2 * P);
  const yFor = (p) => H - P - ((p - ymin) / Math.max(1, ymax - ymin)) * (H - 2 * P);
  const d = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(pt.t).toFixed(1)} ${yFor(pt.p).toFixed(1)}`).join(' ');
  const area = `${d} L ${xFor(maxX).toFixed(1)} ${H - P} L ${xFor(minX).toFixed(1)} ${H - P} Z`;
  const dots = points.map((pt) => `<circle cx="${xFor(pt.t).toFixed(1)}" cy="${yFor(pt.p).toFixed(1)}" r="3" fill="var(--rojo)" stroke="#fff" stroke-width="1.5"/>`).join('');
  const labels = points.length <= 8 ? points.map((pt) => `<text x="${xFor(pt.t).toFixed(1)}" y="${(yFor(pt.p) - 8).toFixed(1)}" font-size="10" text-anchor="middle" fill="var(--azul)" font-weight="700">${pt.p}</text>`).join('') : '';
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;background:var(--crema);border-radius:10px;display:block">
    <path d="${area}" fill="var(--rojo)" opacity=".12"/>
    <path d="${d}" fill="none" stroke="var(--rojo)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}${labels}
  </svg>`;
}

function buildHistoryTable(points) {
  const rows = points.slice().reverse().slice(0, 10).map((pt, i, arr) => {
    const prev = arr[i + 1];
    const diff = prev ? pt.p - prev.p : 0;
    const arrow = diff > 0 ? '<span style="color:var(--rojo)">▲</span>' : diff < 0 ? '<span style="color:var(--offer)">▼</span>' : '<span style="color:var(--texto-muted)">—</span>';
    return `<tr><td>${new Date(pt.t).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</td><td class="price">${fmtPrice(pt.p)}</td><td>${arrow} ${diff ? (diff > 0 ? '+' : '') + diff : ''}</td></tr>`;
  }).join('');
  return `<table style="margin-top:10px">
    <thead><tr><th>Fecha</th><th class="price">Precio</th><th>Cambio</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function closeModal() { $('#modal').classList.remove('show'); }

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
        if (sd.status === 'completed' && sd.conclusion === 'failure') throw new Error('El scrape falló.');
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
  $$('.tab').forEach((t) => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  $('#refreshBtn').addEventListener('click', refresh);
  $('#catalogQ').addEventListener('input', (e) => { state.catalog.q = e.target.value; renderCatalog(); });
  $$('#tableCatalog th[data-sort]').forEach((th) => th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (state.catalog.sort.key === key) state.catalog.sort.asc = !state.catalog.sort.asc;
    else state.catalog.sort = { key, asc: key !== 'price' };
    renderCatalog();
  }));
  $('#compareQ').addEventListener('input', (e) => { state.compare.q = e.target.value; renderCompare(); });
  $('#compareBrand').addEventListener('change', (e) => { state.compare.brand = e.target.value; renderCompare(); });
  $('#offersQ').addEventListener('input', (e) => { state.offers.q = e.target.value; renderOffers(); });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  $('#modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ===== Auto-swap de assets =====
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
