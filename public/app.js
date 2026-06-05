const STORE_LABEL = {
  tata: 'Ta-Ta',
  tiendainglesa: 'Tienda Inglesa',
  disco: 'Disco',
  devoto: 'Devoto',
  geant: 'Geant',
  eldorado: 'El Dorado',
  frog: 'Frog',
  tamisur: 'Tamisur',
  ubesur: 'Ubesur',
  kinko: 'Kinko',
  macromercado: 'Macro Mercado',
  macro: 'Macro Mercado',
  elvencedor: 'El Vencedor',
  manual: 'Carga manual',
};
const STORE_FILTER_ORDER = [
  'tata',
  'tiendainglesa',
  'disco',
  'devoto',
  'geant',
  'eldorado',
  'frog',
  'tamisur',
  'ubesur',
  'kinko',
  'macromercado',
  'elvencedor',
];
const TARGET_OWNER = 'sarubbi';
const COMPETITOR_OWNER = 'competencia';
const APP_COPY = {
  productName: 'Sarubbi Retail Watch',
  shortName: 'Sarubbi',
  domain: 'sarubbi.com.uy',
  targetOwnerLabel: 'Sarubbi',
  targetOwnerPlural: 'Marcas Sarubbi',
  targetSkuLabel: 'SKUs Sarubbi',
  targetShortLabel: 'Sarubbi',
  competitorLabel: 'Competencia',
  suggestedLabel: 'Precio referencia',
  suggestedShortLabel: 'Referencia',
  strategySourceFallback: 'Estrategia retail Sarubbi',
  redactTargetBrands: false,
};
const TARGET_BRAND_ALIAS = {};
const OWNER_LABEL = { [TARGET_OWNER]: APP_COPY.targetOwnerLabel, [COMPETITOR_OWNER]: APP_COPY.competitorLabel };
const CATEGORY_LABEL = {
  jamon_cocido: 'Jamon cocido',
  jamon_crudo: 'Jamon crudo',
  panchos: 'Panchos y frankfurters',
  salames: 'Salames y salamini',
  chorizos: 'Chorizos',
  mortadela: 'Mortadela',
  panceta: 'Panceta',
  fiambres: 'Fiambres y feteados',
  hamburguesas: 'Hamburguesas',
  empanadas: 'Empanadas',
  carnes: 'Carnes y cortes',
  congelados: 'Congelados',
  otros: 'Otros chacinados',
};
const SUGGESTED_LABEL = { above: 'Sobre referencia', ok: 'Cumple', below: 'Bajo referencia' };
const MODE_TARGET_INDEX = 100;
const MODE_RUBRO_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'fiambres', label: 'Fiambres' },
  { key: 'panchos', label: 'Panchos' },
  { key: 'salames', label: 'Salames' },
  { key: 'chorizos', label: 'Chorizos' },
  { key: 'congelados', label: 'Congelados' },
  { key: 'carnes', label: 'Carnes' },
];
const PORTFOLIO_CATEGORIES = ['jamon_cocido', 'jamon_crudo', 'panchos', 'salames', 'chorizos', 'mortadela', 'panceta', 'fiambres', 'hamburguesas', 'empanadas', 'carnes', 'congelados'];
const PORTFOLIO_INDEX_MIN = 45;
const PORTFOLIO_INDEX_MAX = 180;
const MODE_BENCHMARK_BRAND = {
  jamon_cocido_general: 'schneck',
  jamon_crudo_general: 'schneck',
  panchos_general: 'schneck',
  salames_general: 'schneck',
  chorizos_general: 'schneck',
  mortadela_general: 'ottonello',
  panceta_general: 'ottonello',
  fiambres_general: 'schneck',
  hamburguesas_general: 'cattivelli',
  empanadas_general: 'cattivelli',
  carnes_general: 'camposur',
  congelados_general: 'cattivelli',
  otros_general: 'schneck',
};
const SARUBBI_COMPACT_LOGO = '/assets/sarubbi/site/imgs/sarubbi-logo.png';
const SARUBBI_CATEGORY_IMAGE = {
  jamon_cocido: '/assets/sarubbi/site/imgs/productos/jamon_cocido.png',
  jamon_crudo: '/assets/sarubbi/site/imgs/productos/jamon_gran_verona.jpg',
  panchos: '/assets/sarubbi/site/imgs/productos/frankfurters.png',
  salames: '/assets/sarubbi/site/imgs/productos/salame_milan.png',
  chorizos: '/assets/sarubbi/site/imgs/productos/chorizos.png',
  mortadela: '/assets/sarubbi/site/imgs/productos/mortadela.png',
  panceta: '/assets/sarubbi/site/imgs/productos/panceta_ahumada.png',
  fiambres: '/assets/sarubbi/site/imgs/productos/fiambre_de_cerdo_linea_roja.png',
  hamburguesas: '/assets/sarubbi/site/imgs/productos/hamburguesas_2.png',
  empanadas: '/assets/sarubbi/site/imgs/productos/empanadas_jamon.jpg',
  carnes: '/assets/sarubbi/site/imgs/productos/lomo.jpeg',
  congelados: '/assets/sarubbi/site/imgs/productos/hamburguesas_2.png',
  otros: '/assets/sarubbi/site/imgs/productos/jamon_cocido.png',
};
const OWNER_LOGO = {
  sarubbi: { text: APP_COPY.targetOwnerLabel, color: '#0b2f93', src: SARUBBI_COMPACT_LOGO, imageOnly: true, compact: true },
  competencia: { text: APP_COPY.competitorLabel, color: '#b42318' },
};
const BRAND_LOGO = {
  sarubbi: { text: 'Sarubbi', color: '#0b2f93', src: SARUBBI_COMPACT_LOGO, imageOnly: true, compact: true },
  schneck: { text: 'Schneck', color: '#0f766e', src: '/assets/logos/brands/schneck.svg' },
  centenario: { text: 'Centenario', color: '#7c2d12', src: '/assets/logos/brands/centenario.svg' },
  cattivelli: { text: 'Cattivelli', color: '#b42318', src: '/assets/logos/brands/cattivelli.svg' },
  ottonello: { text: 'Ottonello', color: '#344054', src: '/assets/logos/brands/ottonello.svg' },
  camposur: { text: 'Camposur', color: '#166534', src: '/assets/logos/brands/camposur.svg' },
  constancia: { text: 'La Constancia', color: '#7f1d1d', src: '/assets/logos/brands/constancia.svg' },
  picorel: { text: 'Picorel', color: '#9333ea', src: '/assets/logos/brands/picorel.svg' },
};
const STORE_LOGO = {
  tata: { text: 'Ta-Ta', color: '#e5002b', src: '/assets/logos/stores/tata.svg', imageOnly: true, bg: '#e5002b' },
  tiendainglesa: { text: 'Tienda Inglesa', color: '#19744a', src: '/assets/logos/stores/tiendainglesa.svg', imageOnly: true },
  disco: { text: 'Disco', color: '#0070d2', src: '/assets/logos/stores/disco.svg', imageOnly: true },
  devoto: { text: 'Devoto', color: '#f15c22', src: '/assets/logos/stores/devoto.svg', imageOnly: true },
  geant: { text: 'Geant', color: '#7f2dbb', src: '/assets/logos/stores/geant.svg', imageOnly: true },
  eldorado: { text: 'El Dorado', color: '#c8102e', src: '/assets/logos/stores/eldorado.svg', imageOnly: true },
  frog: { text: 'Frog', color: '#45a23f', src: '/assets/logos/stores/frog.png', imageOnly: true },
  tamisur: { text: 'Tamisur', color: '#195d9c', src: '/assets/logos/stores/tamisur.png', imageOnly: true },
  ubesur: { text: 'Ubesur', color: '#2563eb', src: '/assets/logos/stores/ubesur.png', imageOnly: true },
  kinko: { text: 'Kinko', color: '#111827', src: '/assets/logos/stores/kinko.png', imageOnly: true },
  macromercado: { text: 'Macro Mercado', color: '#0f766e', src: '/assets/logos/stores/macromercado.svg', imageOnly: true },
  macro: { text: 'Macro Mercado', color: '#0f766e', src: '/assets/logos/stores/macromercado.svg', imageOnly: true },
  elvencedor: { text: 'El Vencedor', color: '#6b7280' },
  manual: { text: 'Manual', color: '#475467' },
};
const state = {
  items: [],
  generatedAt: null,
  scrapeResults: [],
  suggested: null,
  history: null,
  evolution: null,
  visualAssets: null,
  view: 'catalog',
  clusters: [],
  catalog: {
    q: '',
    brands: new Set(),
    supers: new Set(),
    owners: new Set(),
    categories: new Set(),
    sort: { key: 'price', asc: true },
  },
  compare: { q: '', brand: '', category: '', format: '', store: '' },
  mode: { q: '', brand: '', owner: '', category: '', rubro: 'all', segment: '', store: '' },
  offers: { q: '', brand: '', owner: '', category: '', store: '' },
  suggestedFilters: { q: '', status: '' },
  positioning: { category: '', stores: new Set() },
  portfolio: {
    category: PORTFOLIO_CATEGORIES[0] || 'jamon_cocido',
    segment: '',
    brand: '',
    date: '',
    orientation: 'horizontal',
    pinZ: 40,
    pinOrder: {},
    laneOrder: {},
    selectedPins: [],
    selectedStores: [],
    selectedBuckets: [],
    selectionQ: '',
    rawQ: '',
    rawOwner: '',
    rawStatus: '',
    rawBenchmark: '',
    detailQ: '',
    detailStatus: '',
    detailBucket: '',
  },
  strategy: null,
  strategyFilters: { category: '', status: '' },
  reportAutomation: {
    status: null,
    loading: false,
    sending: false,
    error: '',
    actionError: '',
    message: '',
  },
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const stripAccents = (s) => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '');
const fmtPrice = (p) => p == null ? '-' : '$ ' + Number(p).toLocaleString('es-UY');
const fmtPct = (p) => p == null ? '-' : `${Number(p) > 0 ? '+' : ''}${Number(p).toFixed(1)}%`;
const labelOwner = (owner) => OWNER_LABEL[owner] || owner || '-';
const labelCategory = (category) => CATEGORY_LABEL[category] || category || '-';
const labelStore = (store) => STORE_LABEL[store] || store || '-';

function isTargetOwner(itemOrOwner) {
  const value = typeof itemOrOwner === 'string'
    ? itemOrOwner
    : itemOrOwner?.group || itemOrOwner?.owner || '';
  return String(value).toLowerCase() === TARGET_OWNER || String(value).toLowerCase().includes('sarubbi');
}

function targetBrandAlias(item) {
  const key = String(item?.brand || '').toLowerCase();
  return TARGET_BRAND_ALIAS[key] || `${APP_COPY.targetShortLabel} ${String(key || 'linea').slice(0, 1).toUpperCase()}`;
}

function labelBrand(item = {}) {
  if (APP_COPY.redactTargetBrands && isTargetOwner(item)) return targetBrandAlias(item);
  return item.brandLabel || item.brand || '-';
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayProductName(item = {}) {
  const original = String(item.name || labelBrand(item) || '-');
  if (!APP_COPY.redactTargetBrands || !isTargetOwner(item)) return original;
  let next = original;
  const replacements = new Map();
  for (const [brand, alias] of Object.entries(TARGET_BRAND_ALIAS)) {
    replacements.set(brand, alias);
    if (BRAND_LOGO[brand]?.text) replacements.set(BRAND_LOGO[brand].text, alias);
  }
  if (item.brandLabel) replacements.set(item.brandLabel, labelBrand(item));
  if (item.brand) replacements.set(item.brand, labelBrand(item));
  for (const [needle, alias] of replacements) {
    if (!needle) continue;
    next = next.replace(new RegExp(escapeRegExp(needle), 'ig'), alias);
  }
  return next;
}

function textMatchesQuery(text, qn) {
  const terms = stripAccents(qn || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = stripAccents(String(text || '').toLowerCase());
  return terms.every((term) => haystack.includes(term));
}

function strategyConfig() {
  return state.strategy || { defaultTargetRange: [MODE_TARGET_INDEX, MODE_TARGET_INDEX], segments: {} };
}

function dynamicStrategyRule(segmentKey) {
  const key = String(segmentKey || '');
  const category = PORTFOLIO_CATEGORIES.find((cat) => key === `${cat}_general` || key.startsWith(`${cat}_presentacion_`));
  if (!category) return null;
  const benchmarkByCategory = {
    jamon_cocido: 'schneck',
    jamon_crudo: 'schneck',
    panchos: 'schneck',
    salames: 'schneck',
    chorizos: 'schneck',
    mortadela: 'ottonello',
    panceta: 'ottonello',
    fiambres: 'schneck',
    hamburguesas: 'cattivelli',
    empanadas: 'cattivelli',
    carnes: 'camposur',
    congelados: 'cattivelli',
    otros: 'schneck',
  };
  return {
    category,
    label: `${CATEGORY_LABEL[category] || category} por presentacion`,
    benchmarkBrand: benchmarkByCategory[category] || 'schneck',
    sarubbiBrands: ['sarubbi'],
    competitorBrands: ['schneck', 'centenario', 'cattivelli', 'ottonello', 'camposur', 'constancia', 'picorel'],
    targetRange: [95, 105],
    note: 'Rango demo inicial hasta validar estrategia comercial con Sarubbi.',
  };
}

function strategyRule(segmentKey) {
  return strategyConfig().segments?.[segmentKey] || dynamicStrategyRule(segmentKey);
}

function benchmarkBrandForSegment(segmentKey) {
  return strategyRule(segmentKey)?.benchmarkBrand || MODE_BENCHMARK_BRAND[segmentKey] || '';
}

function indexBenchmarkBrandForSegment(segmentKey) {
  const rule = strategyRule(segmentKey);
  return rule?.indexBenchmarkBrand || rule?.portfolioBenchmarkBrand || benchmarkBrandForSegment(segmentKey);
}

function indexBenchmarkSegmentForSegment(segmentKey) {
  const rule = strategyRule(segmentKey);
  return rule?.indexBenchmarkSegmentKey || rule?.portfolioBenchmarkSegmentKey || segmentKey;
}

function strategyTargetRange(segmentKey, brand) {
  const rule = strategyRule(segmentKey);
  const range = rule?.brandTargets?.[brand] || rule?.targetRange || strategyConfig().defaultTargetRange || [MODE_TARGET_INDEX, MODE_TARGET_INDEX];
  const min = Number(range?.[0]);
  const max = Number(range?.[1] ?? range?.[0]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [MODE_TARGET_INDEX, MODE_TARGET_INDEX];
  return min <= max ? [min, max] : [max, min];
}

function strategyTargetMid(segmentKey, brand) {
  const [min, max] = strategyTargetRange(segmentKey, brand);
  return (min + max) / 2;
}

function strategyTargetLabel(range) {
  if (!range) return '-';
  const [min, max] = range;
  return Math.round(min) === Math.round(max) ? `${Math.round(min)}%` : `${Math.round(min)}-${Math.round(max)}%`;
}

function strategyStatus(index, range) {
  if (index == null || !Number.isFinite(index)) return { key: 'missing', label: 'Sin base', delta: null };
  const [min, max] = range;
  if (index < min) return { key: 'below', label: 'Debajo objetivo', delta: index - min };
  if (index > max) return { key: 'above', label: 'Sobre objetivo', delta: index - max };
  return { key: 'ok', label: 'En objetivo', delta: 0 };
}

function strategyBadge(index, range) {
  const status = strategyStatus(index, range);
  if (status.key === 'missing') return '<span class="strategy-status missing">Sin base</span>';
  return `<span class="strategy-status ${status.key}">${escape(status.label)}</span>`;
}

function logoBadge(meta, label, className = '') {
  const text = meta?.text || label || '-';
  const color = meta?.color || '#64748b';
  const bg = meta?.bg || '';
  const imgSrc = meta?.src || (meta?.domain ? `https://www.google.com/s2/favicons?sz=64&domain_url=https://${escape(meta.domain)}` : '');
  const img = imgSrc
    ? `<img src="${escape(imgSrc)}" alt="" loading="lazy" onerror="this.remove();this.closest('.logo-badge')?.classList.remove('with-img','image-only')" />`
    : '';
  const imageOnly = img && meta?.imageOnly ? ' image-only' : '';
  const filled = bg ? ' filled-logo' : '';
  const compact = meta?.compact ? ' compact-logo' : '';
  const style = `--logo-color:${escape(color)}${bg ? `;--logo-bg:${escape(bg)}` : ''}`;
  return `<span class="logo-badge ${className}${compact}${img ? ' with-img' : ''}${imageOnly}${filled}" style="${style}" aria-label="${escape(text)}">${img}<span class="logo-text">${escape(text)}</span></span>`;
}

function brandLogo(item) {
  if (APP_COPY.redactTargetBrands && isTargetOwner(item)) {
    return logoBadge({ text: labelBrand(item), color: '#148a55' }, labelBrand(item), 'brand-logo');
  }
  return logoBadge(BRAND_LOGO[item.brand], labelBrand(item), 'brand-logo');
}

function storeLogo(store) {
  return logoBadge(STORE_LOGO[store], labelStore(store), 'store-logo');
}

function ownerBadge(owner) {
  const meta = OWNER_LOGO[owner];
  const text = meta?.text || labelOwner(owner);
  if (meta?.src) {
    const compact = meta?.compact ? ' compact-logo' : '';
    return `<span class="owner owner-logo ${escape(owner)}${compact}" aria-label="${escape(text)}"><img src="${escape(meta.src)}" alt="" loading="lazy" /><span class="owner-text">${escape(text)}</span></span>`;
  }
  return `<span class="owner ${escape(owner)}">${escape(text)}</span>`;
}

function normalizedProductText(item) {
  return stripAccents(`${item.name || ''} ${item.brandLabel || ''} ${item.brand || ''}`)
    .toLowerCase()
    .replace(/\bs\s*\/\s*azucar\b/g, 'sin azucar')
    .replace(/\bs\s*\/\s*gas\b/g, 'sin gas')
    .replace(/\bc\s*\/\s*gas\b/g, 'con gas')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hasWord(text, word) {
  return new RegExp(`(^| )${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`).test(text);
}

function isSugarFreeProduct(text) {
  return hasWord(text, 'cero') || hasWord(text, 'zero') || hasWord(text, 'light') || hasWord(text, 'black') ||
    text.includes('sin azucar') || text.includes('s azucar') || text.includes('s a') || hasWord(text, 'sa');
}

function productVariant(text) {
  if (hasWord(text, 'light') || hasWord(text, 'black')) return 'light';
  if (hasWord(text, 'zero') || hasWord(text, 'cero') || text.includes('sin azucar') ||
      text.includes('s azucar') || text.includes('s a') || hasWord(text, 'sa')) return 'zero';
  return 'regular';
}

function isPackProduct(text) {
  return hasWord(text, 'pack') || /\b[2-9]\s*x\s*[2-9]\b/.test(text) || /\bx\s*[2-9]\b/.test(text) || text.includes('4x3');
}

function gasMatches(text, expected) {
  const conGas = text.includes('con gas') || text.includes('c gas') || text.includes('levemente gasificada') || text.includes('gasificada');
  const sinGas = text.includes('sin gas') || text.includes('s gas') || hasWord(text, 'sg') || hasWord(text, 'bidon') || hasWord(text, 'sport');
  if (expected === 'con') return conGas && !sinGas;
  if (expected === 'sin') return sinGas || (!conGas && text.includes('agua'));
  return true;
}

function sourceProductImageFor(item) {
  const src = String(item.image || '').trim();
  if (!src) return '';
  if (/^https:\/\/imagenesipos\.scanntech\.com\/imagenes\//i.test(src)) return src;
  return '';
}

function normalizeAssetText(value) {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sarubbiProductImageCandidates() {
  const assets = state.visualAssets?.assets || [];
  return assets.filter((asset) => asset.theme === 'producto' && asset.webPath?.includes('/imgs/productos/'));
}

function sarubbiProductImageScore(item, asset, text) {
  const keywords = Array.isArray(asset.keywords) ? asset.keywords : [];
  let score = asset.productCategory && asset.productCategory === item.category ? 3 : 0;
  const specificTerms = new Set(['rausa', 'donna', 'vegani', 'seara', 'lebon', 'embuchado', 'angus', 'cheddar', 'bbq', 'queso', 'americana', 'bologna', 'suprema', 'verona', 'gigante']);
  for (const keyword of keywords) {
    const term = normalizeAssetText(keyword);
    if (term.length > 2 && text.includes(term)) score += term.length >= 6 ? 2 : 1;
    else if (specificTerms.has(term)) score -= 2;
  }
  for (const title of asset.productTitles || []) {
    const titleText = normalizeAssetText(title);
    const titleWords = titleText.split(' ').filter((word) => word.length > 2);
    const hits = titleWords.filter((word) => text.includes(word)).length;
    if (hits >= 2) score += hits;
  }
  return score;
}

function sarubbiProductImageFor(item) {
  const text = normalizeAssetText(`${item.name || ''} ${item.suggestedProduct || ''} ${item.category || ''} ${labelCategory(item.category)}`);
  let best = null;
  for (const asset of sarubbiProductImageCandidates()) {
    const score = sarubbiProductImageScore(item, asset, text);
    if (score > (best?.score || 0)) best = { asset, score };
  }
  if (best?.score >= 4) return best.asset.webPath;
  return SARUBBI_CATEGORY_IMAGE[item.category] || SARUBBI_COMPACT_LOGO;
}

function productImageFor(item) {
  if (APP_COPY.redactTargetBrands && isTargetOwner(item)) return '';
  if (isTargetOwner(item)) return sarubbiProductImageFor(item);
  const sourceImage = sourceProductImageFor(item);
  if (sourceImage) return sourceImage;
  return '';
}

function productThumb(item, className = '') {
  const src = productImageFor(item);
  if (!src) return '';
  const alt = escape(displayProductName(item) || item.brand || APP_COPY.targetSkuLabel);
  return `<img class="product-thumb ${className}" src="${escape(src)}" alt="${alt}" title="${alt}" loading="lazy" onerror="this.remove()" />`;
}

function productSourceUrl(item) {
  if (!item || state.demo || item.demo) return '';
  return item.url || '';
}

function productLinkCell(item, subHtml = '', label = displayProductName(item)) {
  const key = `${item.super}:${item.sku}`;
  const thumb = productThumb(item);
  const body = `<a href="#" class="product-link" data-key="${escape(key)}">${escape(label)}</a>${subHtml}`;
  return thumb
    ? `<div class="product-title-cell">${thumb}<div class="product-title-body">${body}</div></div>`
    : body;
}

function productTextCell(item, subHtml = '', label = displayProductName(item)) {
  const key = `${item.super}:${item.sku}`;
  return `<a href="#" class="product-link" data-key="${escape(key)}">${escape(label)}</a>${subHtml}`;
}

function chipContent(key, value, labels = {}) {
  if (key === 'group') {
    const meta = OWNER_LOGO[value];
    if (meta?.src) {
      return `<span class="chip-content"><img class="chip-logo" src="${escape(meta.src)}" alt="" loading="lazy" /><span class="chip-text">${escape(meta.text)}</span></span>`;
    }
  }
  if (key === 'super') {
    const meta = STORE_LOGO[value];
    if (meta?.src) {
      const text = meta.text || labels[value] || labelStore(value);
      return `<span class="chip-content"><img class="chip-logo store-chip-logo" src="${escape(meta.src)}" alt="" loading="lazy" onerror="this.remove();this.closest('.chip')?.classList.remove('logo-chip')" /><span class="chip-text">${escape(text)}</span></span>`;
    }
  }
  if (key === 'brand') {
    const meta = BRAND_LOGO[value];
    if (meta?.src) {
      const text = meta.text || labels[value] || value;
      return `<span class="chip-content"><img class="chip-logo brand-chip-logo" src="${escape(meta.src)}" alt="" loading="lazy" onerror="this.remove();this.closest('.chip')?.classList.remove('logo-chip')" /><span class="chip-text">${escape(text)}</span></span>`;
    }
  }
  return escape(labels[value] ?? value);
}

function suggestedBadge(item) {
  if (item.suggestedPrice == null) return `<span class="suggested-empty">Sin ${escape(APP_COPY.suggestedShortLabel)}</span>`;
  const status = item.suggestedStatus || 'ok';
  return `<span class="suggested-badge ${escape(status)}">${escape(SUGGESTED_LABEL[status] || status)}</span>`;
}

function suggestedCell(item) {
  if (item.suggestedPrice == null) return '<span class="suggested-empty">-</span>';
  const status = item.suggestedStatus || '';
  return `<div class="suggested-cell">
    <span class="suggested-price">${fmtPrice(item.suggestedPrice)}</span>
    <span class="suggested-dev ${escape(status)}">${fmtPct(item.suggestedDeviationPct)}</span>
  </div>`;
}

function toast(msg, kind = '') {
  $$('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 5200);
}

function values(items, key) {
  return [...new Set(items.map((i) => i[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'es'));
}

function selectOptions(items, key, labelFn) {
  return values(items, key)
    .map((value) => ({ value, label: labelFn(value, items.find((item) => item[key] === value)) }))
    .sort((a, b) => String(a.label).localeCompare(String(b.label), 'es'));
}

function uniqueOptions(rows, valueFn, labelFn) {
  const found = new Map();
  for (const row of rows) {
    const value = valueFn(row);
    if (value == null || value === '' || found.has(value)) continue;
    found.set(value, labelFn(value, row));
  }
  return [...found.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => String(a.label).localeCompare(String(b.label), 'es'));
}

function validSelectValue(options, selected) {
  return options.some((option) => option.value === selected) ? selected : '';
}

function filterSelectHtml(id, allLabel, options, selected) {
  const value = validSelectValue(options, selected);
  return `<select id="${escape(id)}" class="th-filter" aria-label="${escape(allLabel)}">
    <option value="">${escape(allLabel)}</option>
    ${options.map((option) => `<option value="${escape(option.value)}"${option.value === value ? ' selected' : ''}>${escape(option.label)}</option>`).join('')}
  </select>`;
}

function fillSelect(selector, allLabel, options, selected) {
  const el = $(selector);
  if (!el) return '';
  const valid = validSelectValue(options, selected);
  el.innerHTML = `<option value="">${escape(allLabel)}</option>` +
    options.map((option) => `<option value="${escape(option.value)}">${escape(option.label)}</option>`).join('');
  el.value = valid;
  return valid;
}

function avg(nums) {
  const clean = nums.filter((n) => n != null && Number.isFinite(Number(n))).map(Number);
  return clean.length ? Math.round(clean.reduce((s, n) => s + n, 0) / clean.length) : null;
}

function weightedAvg(items, valueFn, weightFn = () => 1) {
  let total = 0;
  let weight = 0;
  for (const item of items) {
    const raw = valueFn(item);
    if (raw == null || raw === '') continue;
    const value = Number(raw);
    const w = Math.max(1, Number(weightFn(item)) || 1);
    if (!Number.isFinite(value)) continue;
    total += value * w;
    weight += w;
  }
  return weight ? total / weight : null;
}

function minItem(items) {
  return items.filter((i) => i.price != null).sort((a, b) => a.price - b.price)[0] || null;
}

function extractSize(name) {
  const m = String(name ?? '').match(/(\d+(?:[.,]\d+)?)\s*(lts?|litros?|l\b|ml|cc|cm3|kg|kilos?|gr?\b|gramos|un|u\b|x\s*\d+)/i);
  if (!m) return null;
  const num = Number(m[1].replace(',', '.'));
  let unit = m[2].toLowerCase().replace(/\s+/g, '');
  let value = num;
  if (/^(g|gr|gramos)$/.test(unit)) unit = 'g';
  else if (/^(kg|kilo|kilos)$/.test(unit)) { unit = 'g'; value = num * 1000; }
  else if (/^(ml|cc|cm3)$/.test(unit)) unit = 'ml';
  else if (/^(l|lt|lts|litro|litros)$/.test(unit)) { unit = 'ml'; value = num * 1000; }
  else if (/^(un|u)$/.test(unit)) unit = 'u';
  return { value: Math.round(value), unit };
}

function sizeLabel(size) {
  if (!size) return 'Sin formato';
  if (size.unit === 'ml' && size.value >= 1000) return `${(size.value / 1000).toLocaleString('es-UY')} L`;
  if (size.unit === 'g' && size.value >= 1000) return `${(size.value / 1000).toLocaleString('es-UY')} kg`;
  return `${size.value} ${size.unit}`;
}

const WEIGHT_BUCKETS = [
  { value: 100, min: 1, max: 150, label: 'hasta 150 g' },
  { value: 200, min: 151, max: 275, label: '151-275 g' },
  { value: 350, min: 276, max: 425, label: '276-425 g' },
  { value: 500, min: 426, max: 650, label: '426-650 g' },
  { value: 800, min: 651, max: 900, label: '651-900 g' },
  { value: 1000, min: 901, max: 1250, label: '1 kg aprox.' },
  { value: 1500, min: 1251, max: 1750, label: '1,25-1,75 kg' },
  { value: 2000, min: 1751, max: 2500, label: '2 kg aprox.' },
];

const SEGMENT_LABEL = Object.fromEntries(Object.entries(CATEGORY_LABEL).map(([key, label]) => [`${key}_general`, label]));

function weightBucket(grams) {
  return WEIGHT_BUCKETS.find((bucket) => grams >= bucket.min && grams <= bucket.max) ||
    { value: grams, min: grams, max: grams, label: `${grams.toLocaleString('es-UY')} g` };
}

function comparableProfile(item) {
  if (!item || item.price == null) return null;
  const text = stripAccents(item.name || '').toLowerCase().replace(',', '.');
  let match = text.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilos)\b/);
  if (match) return weightProfile(Number(match[1]) * 1000, item.price);
  match = text.match(/(\d+(?:\.\d+)?)\s*(g|gr|gramos)\b/);
  if (match) return weightProfile(Number(match[1]), item.price);
  match = text.match(/\bx\s*(\d{1,2})\b/) || text.match(/(\d{1,2})\s*(u|un|unid|unidades)\b/);
  if (match) {
    const count = Number(match[1]);
    if (Number.isFinite(count) && count > 0) {
      return {
        metric: 'unit',
        unitMl: count,
        units: count,
        totalMl: count,
        bucket: { value: count, min: count, max: count, label: `${count} un.` },
        pricePerLiter: Number(item.price) / count,
        metricLabel: '$/unidad',
      };
    }
  }
  return {
    metric: 'item',
    unitMl: 1,
    units: 1,
    totalMl: 1,
    bucket: { value: 1, min: 1, max: 1, label: 'Unidad' },
    pricePerLiter: Number(item.price),
    metricLabel: '$/unidad',
  };
}

function weightProfile(rawGrams, price) {
  const grams = Math.round(Number(rawGrams));
  if (!Number.isFinite(grams) || grams <= 0) return null;
  const pricePerKg = Number(price) / (grams / 1000);
  return {
    metric: 'kg',
    unitMl: grams,
    units: 1,
    totalMl: grams,
    bucket: weightBucket(grams),
    pricePerLiter: pricePerKg,
    pricePerKg,
    pricePer100g: pricePerKg / 10,
    metricLabel: '$/kg',
  };
}

function competitiveSegment(item) {
  const category = item.category || 'otros';
  const profile = comparableProfile(item);
  const key = profile?.bucket?.value ? `${category}_presentacion_${profile.metric}_${profile.bucket.value}` : `${category}_general`;
  const categoryLabel = CATEGORY_LABEL[category] || category;
  const label = profile?.bucket?.label ? `${categoryLabel} / ${profile.bucket.label}` : categoryLabel;
  return { key, label };
}

function liquidProfile(item) {
  const profile = comparableProfile(item);
  if (!profile || profile.pricePerLiter == null || !Number.isFinite(Number(profile.pricePerLiter))) return null;
  return profile;
}

function metricSuffix(profile = null) {
  if (profile?.metric === 'kg') return '/kg';
  if (profile?.metric === 'unit') return '/un.';
  if (profile?.metric === 'item') return '/unidad';
  return '/normalizado';
}

const fmtPerLiter = (p, profile = null) => p == null ? '-' : `$ ${Number(p).toLocaleString('es-UY', { maximumFractionDigits: 1 })}${metricSuffix(profile)}`;
function entryDetail(entry) {
  const pack = entry.profile.units > 1 ? `  -  pack x${entry.profile.units}` : '';
  return `${labelBrand(entry.item)}  -  ${labelStore(entry.item.super)}  -  ${fmtPrice(entry.item.price)}  -  ${fmtPerLiter(entry.profile.pricePerLiter)}${pack}`;
}

function formatProfile(item) {
  const profile = liquidProfile(item);
  if (!profile) return 'Unidad';
  return profile.units > 1 ? `Pack x${profile.units}` : 'Unidad';
}

function clusterProfile(item) {
  const profile = liquidProfile(item);
  return {
    unitMl: profile?.unitMl || null,
    packUnits: profile?.units || 1,
    formatLabel: profile?.units > 1 ? `Pack x${profile.units}` : 'Unidad',
  };
}

function brandRegex() {
  const words = values(state.items, 'brandLabel')
    .concat(values(state.items, 'brand'))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((w) => stripAccents(w.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return words.length ? new RegExp(`\\b(${words.join('|')})\\b`, 'gi') : null;
}

function normalizeName(name) {
  let n = stripAccents(name).toLowerCase();
  const rx = brandRegex();
  if (rx) n = n.replace(rx, ' ');
  n = n
    .replace(/\d+(?:[.,]\d+)?\s*(lts?|litros?|l\b|ml|cc|cm3|kg|kilos?|gr?|gramos|un|u|x\s*\d+)\b/g, ' ')
    .replace(/\b(jamon|cocido|crudo|fiambre|feteado|fetas|pancho|panchos|frankfurter|salchicha|salame|salamin|chorizo|mortadela|panceta|hamburguesa|empanada|carne|corte|pack|unidad|unidades)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const stop = new Set(['de', 'la', 'el', 'los', 'las', 'y', 'a', 'en', 'para', 'por']);
  return n.split(' ').filter((w) => w.length > 1 && !stop.has(w)).join(' ');
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
  const enriched = items.map((item) => ({ item, tokens: tokenize(item.name), size: extractSize(item.name), profile: clusterProfile(item) }));
  for (const cur of enriched) {
    let best = null;
    let bestScore = 0;
    for (const group of groups) {
      if (group.brand !== cur.item.brand) continue;
      if (group.profile.packUnits !== cur.profile.packUnits) continue;
      if ((group.profile.unitMl || cur.profile.unitMl) && group.profile.unitMl !== cur.profile.unitMl) continue;
      if (cur.size && group.size) {
        if (cur.size.unit !== group.size.unit) continue;
        const ratio = Math.min(cur.size.value, group.size.value) / Math.max(cur.size.value, group.size.value);
        if (ratio < 0.88) continue;
      }
      const score = jaccard(cur.tokens, group.tokens);
      if (score >= 0.52 && score > bestScore) {
        best = group;
        bestScore = score;
      }
    }
    if (best) best.items.push(cur.item);
    else groups.push({
      brand: cur.item.brand,
      brandLabel: labelBrand(cur.item),
      category: cur.item.category,
      size: cur.size,
      profile: cur.profile,
      tokens: cur.tokens,
      items: [cur.item],
      label: cur.item.name,
    });
  }
  for (const group of groups) {
    group.items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    group.label = group.items.slice().sort((a, b) => a.name.length - b.name.length)[0].name;
  }
  return groups;
}

function priceMode(items) {
  const buckets = new Map();
  for (const item of items) {
    if (item.price == null || !Number.isFinite(Number(item.price))) continue;
    const price = Number(item.price);
    const key = price.toFixed(2);
    const bucket = buckets.get(key) || { price, count: 0, items: [] };
    bucket.count++;
    bucket.items.push(item);
    buckets.set(key, bucket);
  }
  const ranked = [...buckets.values()].sort((a, b) => (b.count - a.count) || (a.price - b.price));
  return ranked[0] || null;
}

function skuModeRows() {
  return state.clusters.map((group) => {
    const priced = group.items.filter((item) => item.price != null && Number.isFinite(Number(item.price)));
    if (!priced.length) return null;
    const mode = priceMode(priced);
    const prices = priced.map((item) => Number(item.price));
    const first = priced[0];
    const profile = liquidProfile(first);
    const segment = competitiveSegment(first);
    const modeStores = [...new Set(mode.items.map((item) => labelStore(item.super)))].sort((a, b) => a.localeCompare(b, 'es'));
    const modeStoreKeys = [...new Set(mode.items.map((item) => item.super))].sort((a, b) => labelStore(a).localeCompare(labelStore(b), 'es'));
    const modePricePerLiter = profile ? mode.price / (profile.totalMl / 1000) : null;
    return {
      label: group.label,
      brand: group.brand,
      brandLabel: group.brandLabel,
      group: first.group,
      category: group.category,
      segment,
      bucket: profile?.bucket || null,
      unitMl: profile?.unitMl || null,
      packUnits: profile?.units || 1,
      sizeLabel: profile?.bucket?.label || sizeLabel(group.size),
      count: priced.length,
      stores: new Set(priced.map((item) => item.super)).size,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: avg(prices),
      modePrice: mode.price,
      modePricePerLiter,
      modeCount: mode.count,
      modeShare: priced.length ? (mode.count / priced.length) * 100 : 0,
      modeStores,
      modeStoreKeys,
      modeItems: mode.items,
      sample: first,
    };
  }).filter(Boolean).sort((a, b) =>
    (a.group === b.group ? 0 : a.group === 'sarubbi' ? -1 : 1) ||
    labelCategory(a.category).localeCompare(labelCategory(b.category), 'es') ||
    a.brandLabel.localeCompare(b.brandLabel, 'es') ||
    a.label.localeCompare(b.label, 'es'));
}

async function load() {
  try {
    const [r, strategy, visualAssets] = await Promise.all([
      fetch('/data/latest.json', { cache: 'no-store' }),
      loadStrategyConfig(),
      loadVisualAssets(),
    ]);
    if (!r.ok) throw new Error('No se pudo cargar latest.json');
    const data = await r.json();
    state.items = (data.items || []).filter((i) => i.category && i.group);
    state.generatedAt = data.generatedAt;
    state.scrapeResults = data.scrapeResults || [];
    state.suggested = data.suggested || null;
    state.strategy = strategy;
    state.visualAssets = visualAssets;
    state.clusters = clusterProducts(state.items);
    renderAll();
    loadReportAutomation();
  } catch (e) {
    console.error(e);
    $('#lastUpdate').innerHTML = '<b>Sin datos.</b><br>Ejecuta el primer relevamiento.';
    renderEmptyShell();
  }
  loadHistory();
  loadEvolution();
}

async function loadVisualAssets() {
  try {
    const r = await fetch('/data/sarubbi-assets.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('No se pudo cargar sarubbi-assets.json');
    return await r.json();
  } catch (e) {
    console.warn('Sin biblioteca visual Sarubbi:', e.message);
    return null;
  }
}

async function loadStrategyConfig() {
  try {
    const r = await fetch('/config/portfolio-strategy.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('No se pudo cargar portfolio-strategy.json');
    return await r.json();
  } catch (e) {
    console.warn('Sin estrategia de marketing:', e.message);
    return { defaultTargetRange: [MODE_TARGET_INDEX, MODE_TARGET_INDEX], segments: {} };
  }
}

function reportAutomationReady(status) {
  const cfg = status?.configured || {};
  return Boolean(cfg.resendApiKey && cfg.cronSecret && Array.isArray(cfg.to) && cfg.to.length);
}

function reportAutomationPending(status) {
  const cfg = status?.configured || {};
  const pending = [];
  if (!cfg.resendApiKey) pending.push('Resend');
  if (!Array.isArray(cfg.to) || !cfg.to.length) pending.push('destinatarios');
  if (!cfg.cronSecret) pending.push('secreto cron');
  if (!cfg.manualSecret) pending.push('secreto manual');
  return pending;
}

function reportScheduleText(status) {
  const schedule = status?.schedule || '0 11 * * *';
  return schedule === '0 11 * * *' ? 'Diario 11:00 UTC / 08:00 Uruguay' : `Cron ${schedule}`;
}

function reportAutomationHtml() {
  const automation = state.reportAutomation;
  const status = automation.status;
  const cfg = status?.configured || {};
  const ready = reportAutomationReady(status);
  const pending = reportAutomationPending(status);
  const messageClass = automation.actionError ? 'error' : automation.message ? 'success' : '';
  const recipients = Array.isArray(cfg.to) && cfg.to.length ? cfg.to.join(', ') : 'Sin destinatarios';
  const canDryRun = Boolean(cfg.manualSecret);
  const canSend = Boolean(cfg.manualSecret && cfg.resendApiKey);
  const busy = automation.loading || automation.sending;
  const statusText = automation.loading
    ? 'Cargando'
    : automation.error
      ? 'No disponible'
      : ready
        ? 'Activo'
        : 'Pendiente';

  return `
    <div class="exec-card report-automation-card no-print">
      <div class="report-automation-head">
        <div>
          <h3>Automatizacion de informes</h3>
          <div class="report-automation-sub">${escape(reportScheduleText(status))}</div>
        </div>
        <span class="automation-badge ${ready ? 'ready' : automation.error ? 'error' : 'pending'}">${escape(statusText)}</span>
      </div>

      <div class="automation-status-grid">
        <div><span>Proveedor</span><b>${cfg.resendApiKey ? 'Resend' : 'Pendiente'}</b></div>
        <div><span>Destinatarios</span><b title="${escape(recipients)}">${escape(recipients)}</b></div>
        <div><span>PDF</span><b>${status?.assets?.latestPdf ? 'Disponible' : 'Pendiente'}</b></div>
        <div><span>Manual</span><b>${cfg.manualSecret ? 'Habilitado' : 'Pendiente'}</b></div>
      </div>

      ${pending.length && !automation.error ? `<div class="automation-note">Falta: ${escape(pending.join(', '))}</div>` : ''}
      ${automation.error ? `<div class="automation-note error">${escape(automation.error)}</div>` : ''}

      <form class="automation-form" id="reportAutomationForm">
        <input id="reportEmailTo" type="text" placeholder="destino@empresa.com" autocomplete="off" />
        <input id="reportSecret" type="password" placeholder="secreto de envio" autocomplete="off" />
        <button type="button" class="btn" id="reportDryRunBtn" ${busy || !canDryRun ? 'disabled' : ''}>Probar</button>
        <button type="button" class="btn blue" id="reportSendBtn" ${busy || !canSend ? 'disabled' : ''}>Enviar PDF</button>
        <button type="button" class="btn" id="reportStatusBtn" ${busy ? 'disabled' : ''}>Refrescar</button>
      </form>

      <div class="automation-result ${messageClass}" id="reportAutomationResult">
        ${automation.sending ? 'Enviando...' : escape(automation.actionError || automation.message || '')}
      </div>
    </div>`;
}

function renderReportAutomationPanel() {
  const el = $('#reportAutomationPanel');
  if (!el) return;
  el.innerHTML = reportAutomationHtml();
  bindReportAutomationControls();
  applyClientCopy(el);
}

async function loadReportAutomation() {
  state.reportAutomation.loading = true;
  state.reportAutomation.error = '';
  renderReportAutomationPanel();
  try {
    const resp = await fetch('/api/report/status', { cache: 'no-store' });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.ok === false) throw new Error(data.error || `HTTP ${resp.status}`);
    state.reportAutomation.status = data;
    state.reportAutomation.error = '';
  } catch (err) {
    state.reportAutomation.error = 'Estado no disponible';
  } finally {
    state.reportAutomation.loading = false;
    renderReportAutomationPanel();
  }
}

function reportRecipientsFromInput(value) {
  return String(value || '')
    .split(/[,\n;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function sendReportFromPanel(dryRun = false) {
  const secret = $('#reportSecret')?.value?.trim();
  if (!secret) {
    state.reportAutomation.message = '';
    state.reportAutomation.actionError = 'Falta secreto de envio';
    renderReportAutomationPanel();
    return;
  }

  const to = reportRecipientsFromInput($('#reportEmailTo')?.value);
  state.reportAutomation.sending = true;
  state.reportAutomation.actionError = '';
  state.reportAutomation.message = '';
  renderReportAutomationPanel();

  try {
    const resp = await fetch('/api/report/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dryRun, ...(to.length ? { to } : {}) }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.ok === false) throw new Error(data.error || `HTTP ${resp.status}`);
    state.reportAutomation.message = dryRun
      ? `Prueba OK: ${data.attachment || 'PDF listo'}`
      : `Enviado: ${data.to?.join(', ') || 'destinatarios configurados'}`;
    state.reportAutomation.actionError = '';
    toast(dryRun ? 'Prueba de informe lista.' : 'Informe enviado.', 'success');
  } catch (err) {
    state.reportAutomation.actionError = err.message || 'No se pudo enviar';
    toast('Error: ' + state.reportAutomation.actionError, 'error');
  } finally {
    state.reportAutomation.sending = false;
    renderReportAutomationPanel();
  }
}

function bindReportAutomationControls() {
  $('#reportAutomationForm')?.addEventListener('submit', (e) => e.preventDefault());
  $('#reportStatusBtn')?.addEventListener('click', loadReportAutomation);
  $('#reportDryRunBtn')?.addEventListener('click', () => sendReportFromPanel(true));
  $('#reportSendBtn')?.addEventListener('click', () => sendReportFromPanel(false));
}

async function loadHistory() {
  try {
    const r = await fetch('/data/history.jsonl', { cache: 'no-store' });
    if (!r.ok) return;
    const text = await r.text();
    state.history = text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (e) {
    console.warn('Sin historico:', e.message);
  }
}

async function loadEvolution() {
  state.evolution = 'loading';
  renderEvolution();
  try {
    const [mr, pr, ir, rr, tr] = await Promise.all([
      fetch('/api/history/movers', { cache: 'no-store' }),
      fetch('/api/history/pvs', { cache: 'no-store' }),
      fetch('/api/history/index', { cache: 'no-store' }),
      fetch('/api/history/runs', { cache: 'no-store' }),
      fetch('/api/history/market', { cache: 'no-store' }),
    ]);
    if (!mr.ok || !pr.ok || !ir.ok || !rr.ok || !tr.ok) throw new Error('API de historial no disponible');
    const movers = await mr.json();
    const pvs = await pr.json();
    const index = await ir.json();
    const runs = await rr.json();
    const market = await tr.json();
    state.evolution = {
      movers,
      pvs: pvs.timeline || [],
      index: index.groups || [],
      indexAt: index.capturedAt || null,
      runs: runs.runs || [],
      market: market.rows || [],
    };
  } catch (e) {
    state.evolution = { error: e.message };
  }
  renderPortfolio();
  renderEvolution();
}

function renderEvolution() {
  const el = $('#evolutionContent');
  if (!el) return;
  const data = state.evolution;
  if (data == null || data === 'loading') {
    el.innerHTML = '<div class="panel"><div class="empty">Cargando historico...</div></div>';
    return;
  }
  if (data.error) {
    el.innerHTML = '<div class="panel"><div class="empty">El historico se sirve desde la base local.<br><span style="font-size:12px">Corre <code>npm run serve</code> para verlo (y <code>npm run backfill</code> si es la primera vez).</span></div></div>';
    return;
  }
  const fmtD = (t) => (t ? new Date(t).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }) : '-');
  const m = data.movers || { rows: [] };
  const pvs = data.pvs || [];
  const runs = data.runs || [];
  const firstRun = runs[0];
  const lastRun = runs[runs.length - 1];
  const indexGroups = data.index || [];
  const indexOwner = (row) => String(row.owner || '').toLowerCase().includes('sarubbi') ? 'sarubbi' : 'competencia';
  const indexBrandLine = (row) => `
    <div class="history-brand-line">
      ${brandLogo({ brand: row.brand, brandLabel: row.brandLabel, group: indexOwner(row) })}
      <b>${row.index}</b>
      <span>${fmtPerLiter(row.ppl)}  -  ${row.n} obs.</span>
    </div>`;

  const moversRows = m.rows && m.rows.length ? m.rows.map((r) => {
    const up = r.pct > 0;
    const rowItem = { ...r, group: indexOwner(r) };
    return `<tr>
      <td>${escape(displayProductName(rowItem))}</td>
      <td class="brand">${brandLogo(rowItem)}</td>
      <td>${storeLogo(r.super)}</td>
      <td class="price">${fmtPrice(r.prev)}</td>
      <td class="price">${fmtPrice(r.cur)}</td>
      <td class="price" style="color:${up ? '#d71920' : '#148a55'}">${up ? 'UP' : 'DOWN'} ${fmtPct(r.pct)}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="6" class="empty">Sin variaciones aun (se necesitan al menos dos relevamientos).</td></tr>';

  const maxPvs = Math.max(1, ...pvs.map((p) => p.above + p.ok + p.below));
  const w = (n) => `${(n / maxPvs * 100).toFixed(1)}%`;
  const pvsRows = pvs.length ? pvs.map((p) => `
    <div class="pvs-row">
      <div class="pvs-date">${fmtD(p.t)}</div>
      <div class="pvs-bar">
        <span class="seg above" style="width:${w(p.above)}" title="Sobre PVS: ${p.above}"></span>
        <span class="seg ok" style="width:${w(p.ok)}" title="Cumple: ${p.ok}"></span>
        <span class="seg below" style="width:${w(p.below)}" title="Bajo PVS: ${p.below}"></span>
      </div>
      <div class="pvs-counts">${p.above} / ${p.ok} / ${p.below}</div>
    </div>`).join('') : '<div class="empty">Aun no hay historico de PVS (se acumula con cada relevamiento).</div>';

  const indexRows = indexGroups.length ? indexGroups.map((group) => {
    const base = group.rows.find((row) => row.isBase) || group.rows[0];
    const ownRows = group.rows.filter((row) => indexOwner(row) === 'sarubbi').sort((a, b) => Math.abs(a.index - 100) - Math.abs(b.index - 100));
    const compRows = group.rows.filter((row) => indexOwner(row) !== 'sarubbi').sort((a, b) => Math.abs(a.index - 100) - Math.abs(b.index - 100));
    return `<tr>
      <td>${escape(labelCategory(group.category))}</td>
      <td><b>${escape(group.label)}</b><br><span class="table-sub">Base 100: ${escape(base?.brandLabel || '-')}</span></td>
      <td><div class="history-brand-stack">${ownRows.length ? ownRows.slice(0, 3).map(indexBrandLine).join('') : '<span class="table-sub">Sin Sarubbi en esta gama</span>'}</div></td>
      <td><div class="history-brand-stack">${compRows.slice(0, 3).map(indexBrandLine).join('')}</div></td>
    </tr>`;
  }).join('') : '<tr><td colspan="4" class="empty">Aun no hay indice competitivo para la ultima corrida.</td></tr>';

  el.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">Base historica local</h2>
      <div class="history-overview">
        <span><b>${runs.length}</b> relevamientos</span>
        <span><b>${escape(fmtD(firstRun?.captured_at))}</b> primer dato</span>
        <span><b>${escape(fmtD(lastRun?.captured_at))}</b> ultimo dato</span>
        <span><b>${Number(lastRun?.n_items || 0).toLocaleString('es-UY')}</b> SKUs ultima corrida</span>
      </div>
    </div>
    <div class="panel">
      <h2 class="panel-title">Mayores variaciones de precio</h2>
      <p style="margin:0 0 12px;font-size:12px;color:#667085">Entre ${escape(fmtD(m.prevAt))} y ${escape(fmtD(m.curAt))}. Calculado por producto (no por promedio), asi que no lo distorsiona el cambio de mezcla.</p>
      <table><thead><tr><th>Producto</th><th>Marca</th><th>Cadena</th><th class="price">Antes</th><th class="price">Ahora</th><th class="price">Cambio</th></tr></thead><tbody>${moversRows}</tbody></table>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2 class="panel-title">Cumplimiento PVS por relevamiento</h2>
      <p style="margin:0 0 12px;font-size:12px;color:#667085"><span style="color:#d71920">Sobre</span> / <span style="color:#148a55">Cumple</span> / <span style="color:#0067b1">Bajo</span> PVS en cada corrida.</p>
      <div class="pvs-timeline">${pvsRows}</div>
    </div>
    <div class="panel" style="margin-top:16px">
      <h2 class="panel-title">Indice competitivo vigente</h2>
      <p style="margin:0 0 12px;font-size:12px;color:#667085">Ultima corrida: ${escape(fmtD(data.indexAt || lastRun?.captured_at))}. Cada segmento compara marcas dentro de la misma gama; la base queda en 100.</p>
      <table class="history-index-table"><thead><tr><th>Rubro</th><th>Gama</th><th>Sarubbi</th><th>Competencia cercana</th></tr></thead><tbody>${indexRows}</tbody></table>
    </div>`;
}

function renderAll() {
  renderHeader();
  renderKPIs();
  renderCatalog();
  renderCompare();
  renderMode();
  renderOffers();
  renderSuggested();
  renderCompetitive();
  renderPortfolio();
  renderStrategy();
  renderEvolution();
  renderExecutive();
  updateTabBadges();
  applyClientCopy();
}

function applyClientCopy(root = document.body) {
  document.title = APP_COPY.productName;
  const replacements = [
    ['Gondola', APP_COPY.shortName],
    ['Gondola', APP_COPY.shortName],
    ['gondola.sarubbi.uy', APP_COPY.domain],
    ['PVS', APP_COPY.suggestedShortLabel],
    
    ['POR LITRO', 'NORMALIZADO'],
    ['Por litro', 'Normalizado'],
    
    ['Presentacions', 'Presentaciones'],
    ['presentacions', 'presentaciones'],
    ['presentacion', 'presentacion'],
    ['Presentacion', 'Presentacion'],
    ['Gama', 'Segmento'],
    ['gama', 'segmento'],
  ];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    let text = node.nodeValue;
    for (const [from, to] of replacements) text = text.split(from).join(to);
    node.nodeValue = text;
  }
  $$('[title],[aria-label]').forEach((el) => {
    for (const attr of ['title', 'aria-label']) {
      const value = el.getAttribute(attr);
      if (!value) continue;
      let next = value;
      for (const [from, to] of replacements) next = next.split(from).join(to);
      el.setAttribute(attr, next);
    }
  });
}

function renderEmptyShell() {
  $('#kpis').innerHTML = '';
  $('#catalogRows').innerHTML = '';
  $('#catalogEmpty').style.display = 'block';
  $('#compareList').innerHTML = '<div class="empty">Sin datos.</div>';
  $('#modeRows').innerHTML = '';
  $('#modeEmpty').style.display = 'block';
  $('#offersRows').innerHTML = '';
  $('#offersEmpty').style.display = 'block';
  $('#suggestedRows').innerHTML = '';
  $('#suggestedSummary').innerHTML = '';
  $('#suggestedEmpty').style.display = 'block';
  $('#positioningContent').innerHTML = '<div class="empty">Sin datos.</div>';
  $('#portfolioContent').innerHTML = '<div class="empty">Sin datos.</div>';
  $('#strategyContent').innerHTML = '<div class="empty">Sin datos.</div>';
  $('#execContent').innerHTML = '<div class="empty">Sin datos.</div>';
  applyClientCopy();
}

function renderHeader() {
  if (!state.generatedAt) return;
  const d = new Date(state.generatedAt);
  const ok = state.scrapeResults.filter((r) => r.ok).length;
  const total = state.scrapeResults.length;
  const title = state.demo ? 'Dataset demo' : 'Ultima actualizacion';
  const note = state.demo ? 'datos simulados' : `${ok}/${total} fuentes`;
  $('#lastUpdate').innerHTML = `<b>${escape(title)}</b><br>${d.toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' })} - ${escape(note)}`;
}

function elapsedSecondsFromStatus(statusData, fallbackStart) {
  const started = Date.parse(statusData?.startedAt || '');
  const from = Number.isFinite(started) ? started : fallbackStart;
  return Math.max(0, Math.round((Date.now() - from) / 1000));
}

function refreshUnavailableMessage(data = {}) {
  const raw = String(data.message || data.error || '');
  if (/GITHUB_TOKEN|GITHUB_REPO|workflow scrape\.yml|GitHub returned 404/i.test(raw)) {
    return 'Relevamiento remoto no configurado en este despliegue.';
  }
  return raw || 'Relevamiento remoto no disponible.';
}

function isRefreshUnavailable(data) {
  return data?.status === 'unavailable' || data?.configured === false || data?.skipped === true;
}

function renderRefreshProgress(statusData, elapsedSeconds) {
  if (isRefreshUnavailable(statusData)) {
    $('#lastUpdate').innerHTML = `
      <b>Ultima actualizacion</b><br>
      <span class="refresh-live-detail">${escape(refreshUnavailableMessage(statusData))}</span>
    `;
    return;
  }
  const p = statusData?.progress || {};
  const isPdf = p.phase === 'pdf';
  const isDemo = p.phase === 'demo';
  const isRemoteWorkflow = p.phase === 'github' || Boolean(statusData?.url);
  const title = isPdf
    ? 'Generando informe'
    : (isDemo ? 'Actualizando demo' : (statusData?.status === 'completed' ? 'Actualizacion remota' : 'Actualizando precios'));
  const store = p.store ? (p.storeLabel || labelStore(p.store)) : 'Fuentes';
  const place = isPdf
    ? 'Informe PDF'
    : (isDemo ? 'Dataset Sarubbi' : (isRemoteWorkflow ? 'GitHub Actions' : `${store}${p.local ? ` / ${p.local}` : ''}`));
  const progress = p.taskIndex && p.taskTotal
    ? `${p.taskIndex}/${p.taskTotal}`
    : (p.termIndex && p.termTotal ? `${p.termIndex}/${p.termTotal}` : '');
  const sources = p.totalStores ? `${p.completedStores || 0}/${p.totalStores} fuentes` : '';
  const found = p.found != null ? `${p.found} SKUs` : '';
  const remoteStatus = isRemoteWorkflow && statusData?.status
    ? (statusData.status === 'queued' ? 'En cola' : statusData.status === 'in_progress' ? 'En ejecucion' : (statusData.conclusion === 'success' ? 'Completado' : statusData.conclusion === 'failure' ? 'Fallo' : 'Finalizado'))
    : '';
  const run = isRemoteWorkflow && statusData?.runNumber ? `run #${statusData.runNumber}` : '';
  const term = p.term ? `busqueda: ${p.term}` : (p.message || remoteStatus);
  const detail = [term, run, progress, sources, found, `${elapsedSeconds}s`].filter(Boolean).join('  -  ');
  $('#lastUpdate').innerHTML = `
    <b>${escape(title)}</b><br>
    <span class="refresh-live-line"><span class="live-dot"></span>${escape(place)}</span>
    <span class="refresh-live-detail">${escape(detail || 'Preparando fuentes')}</span>
  `;
}

function renderKPIs() {
  const sarubbi = state.items.filter((i) => i.group === 'sarubbi');
  const comp = state.items.filter((i) => i.group === 'competencia');
  const stores = new Set(state.items.map((i) => i.super));
  const sarubbiAvg = avg(sarubbi.map((i) => i.price));
  const compAvg = avg(comp.map((i) => i.price));
  const liquidEntries = state.items.map((item) => {
    const profile = liquidProfile(item);
    return profile ? { item, profile } : null;
  }).filter(Boolean);
  const sarubbiPpl = avg(liquidEntries.filter((entry) => entry.item.group === 'sarubbi').map((entry) => entry.profile.pricePerLiter));
  const compPpl = avg(liquidEntries.filter((entry) => entry.item.group === 'competencia').map((entry) => entry.profile.pricePerLiter));
  const gap = sarubbiPpl != null && compPpl != null && compPpl ? Math.round((sarubbiPpl / compPpl - 1) * 100) : null;
  const pvs = state.items.filter((i) => i.suggestedPrice != null);
  const pvsAbove = pvs.filter((i) => i.suggestedStatus === 'above').length;
  const pvsOk = pvs.filter((i) => i.suggestedStatus === 'ok').length;
  const pvsBelow = pvs.filter((i) => i.suggestedStatus === 'below').length;

  $('#kpis').innerHTML = `
    <div class="kpi"><div class="kpi-label">${escape(APP_COPY.targetSkuLabel)}</div><div class="kpi-value">${sarubbi.length}</div><div class="kpi-sub">prom ${fmtPrice(sarubbiAvg)}</div></div>
    <div class="kpi blue"><div class="kpi-label">SKUs competencia</div><div class="kpi-value">${comp.length}</div><div class="kpi-sub">prom ${fmtPrice(compAvg)}</div></div>
    <div class="kpi green"><div class="kpi-label">Cadenas con datos</div><div class="kpi-value">${stores.size}</div><div class="kpi-sub">${[...stores].map(labelStore).join(', ') || '-'}</div></div>
    <div class="kpi amber"><div class="kpi-label">Brecha prom. normalizada</div><div class="kpi-value">${gap == null ? '-' : `${gap > 0 ? '+' : ''}${gap}%`}</div><div class="kpi-sub">${fmtPerLiter(sarubbiPpl)} vs ${fmtPerLiter(compPpl)}</div></div>
    <div class="kpi pvs"><div class="kpi-label">Control ${escape(APP_COPY.suggestedShortLabel)}</div><div class="kpi-value">${pvs.length}</div><div class="kpi-sub">${pvsAbove} sobre  -  ${pvsOk} ok  -  ${pvsBelow} bajo</div></div>
  `;
}

function buildChips(items, key, container, stateSet, labels = {}) {
  const vals = key === 'super'
    ? [
      ...STORE_FILTER_ORDER,
      ...values(items, key).filter((value) => !STORE_FILTER_ORDER.includes(value)),
    ]
    : values(items, key);
  container.innerHTML = vals.map((v) => {
    const active = stateSet.has(v);
    const classes = ['chip'];
    if (key === 'group') classes.push('owner-chip');
    if (key === 'super') classes.push('store-chip');
    if (key === 'brand') classes.push('brand-chip');
    if (key === 'super' && STORE_LOGO[v]?.src) classes.push('logo-chip');
    if (key === 'super' && STORE_LOGO[v]?.bg) classes.push('filled-logo-chip');
    if (key === 'brand' && BRAND_LOGO[v]?.src) classes.push('logo-chip');
    if (active) classes.push('active');
    const chipLogoMeta = key === 'super' ? STORE_LOGO[v] : key === 'brand' ? BRAND_LOGO[v] : null;
    const styleVars = [];
    if (chipLogoMeta?.bg) styleVars.push(`--chip-logo-bg:${escape(chipLogoMeta.bg)}`);
    if (chipLogoMeta?.color) styleVars.push(`--chip-logo-color:${escape(chipLogoMeta.color)}`);
    const style = styleVars.length ? ` style="${styleVars.join(';')}"` : '';
    return `<button class="${classes.join(' ')}"${style} data-value="${escape(v)}">${chipContent(key, v, labels)}</button>`;
  }).join('');
  container.querySelectorAll('.chip').forEach((el) => {
    el.addEventListener('click', () => {
      const v = el.dataset.value;
      if (stateSet.has(v)) stateSet.delete(v); else stateSet.add(v);
      renderCatalog();
    });
  });
}

function filterItems(items, cfg) {
  const qn = stripAccents(cfg.q || '').toLowerCase().trim();
  return items.filter((i) => {
    const haystack = `${displayProductName(i)} ${labelBrand(i)} ${labelStore(i.super)} ${i.branch || ''} ${labelCategory(i.category)} ${i.suggestedProduct || ''} ${i.suggestedStatus || ''}`.toLowerCase();
    if (qn && !stripAccents(haystack).includes(qn)) return false;
    if (cfg.brands?.size && !cfg.brands.has(i.brand)) return false;
    if (cfg.supers?.size && !cfg.supers.has(i.super)) return false;
    if (cfg.owners?.size && !cfg.owners.has(i.group)) return false;
    if (cfg.categories?.size && !cfg.categories.has(i.category)) return false;
    return true;
  });
}

function sortItems(items, sort) {
  const dir = sort.asc ? 1 : -1;
  return items.slice().sort((a, b) => {
    const va = sort.key === 'brand' ? labelBrand(a) : sort.key === 'owner' ? labelOwner(a.group) : sort.key === 'category' ? labelCategory(a.category) : a[sort.key];
    const vb = sort.key === 'brand' ? labelBrand(b) : sort.key === 'owner' ? labelOwner(b.group) : sort.key === 'category' ? labelCategory(b.category) : b[sort.key];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb), 'es') * dir;
  });
}

function renderCatalog() {
  buildChips(state.items, 'group', $('#ownerChips'), state.catalog.owners, OWNER_LABEL);
  buildChips(state.items, 'category', $('#categoryChips'), state.catalog.categories, CATEGORY_LABEL);
  buildChips(state.items, 'brand', $('#brandChips'), state.catalog.brands, Object.fromEntries(state.items.map((i) => [i.brand, labelBrand(i)])));
  buildChips(state.items, 'super', $('#superChips'), state.catalog.supers, STORE_LABEL);

  const items = sortItems(filterItems(state.items, state.catalog), state.catalog.sort);
  const tbody = $('#catalogRows');
  const empty = $('#catalogEmpty');
  if (!items.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = items.map((i) => {
      const isOffer = i.listPrice && i.price && i.listPrice > i.price;
      const discountPct = isOffer ? Math.round((1 - i.price / i.listPrice) * 100) : 0;
      return `<tr>
        <td>${productLinkCell(i)}</td>
        <td class="brand brand-cell">${brandLogo(i)}</td>
        <td>${ownerBadge(i.group)}</td>
        <td>${escape(labelCategory(i.category))}</td>
        <td>${storeLogo(i.super)}${i.branchCount > 1 ? `<div class="store-sub">${i.branchCount} locales</div>` : (i.branch ? `<div class="store-sub">${escape(i.branch)}</div>` : '')}</td>
        <td class="price">${fmtPrice(i.price)}${isOffer ? `<br><span class="price list">${fmtPrice(i.listPrice)}</span>` : ''}${i.priceVaries ? `<br><span class="price-vary" title="Precio comun entre locales; algunos difieren">* ${i.priceBreakdown.length} precios</span>` : ''}</td>
        <td class="price">${suggestedCell(i)}</td>
        <td>${isOffer ? `<span class="discount-badge">-${discountPct}%</span>` : ''}</td>
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

function renderCompare() {
  const brands = values(state.items, 'brand').map((brand) => {
    const sample = state.items.find((i) => i.brand === brand) || { brand };
    return { brand, label: labelBrand(sample) };
  });
  if (!$('#compareBrand').dataset.ready) {
    $('#compareBrand').innerHTML = '<option value="">Todas las marcas</option>' +
      brands.map((b) => `<option value="${escape(b.brand)}">${escape(b.label)}</option>`).join('');
    $('#compareBrand').dataset.ready = '1';
  }
  if (!$('#compareCategory').dataset.ready) {
    $('#compareCategory').innerHTML = '<option value="">Todas las categorias</option>' +
      values(state.items, 'category').map((c) => `<option value="${escape(c)}">${escape(labelCategory(c))}</option>`).join('');
    $('#compareCategory').dataset.ready = '1';
  }

  const qn = stripAccents(state.compare.q).toLowerCase().trim();
  const searchable = state.clusters.filter((g) => {
    if (g.items.length < 2) return false;
    if (qn && !textMatchesQuery(`${g.label} ${g.brandLabel} ${labelCategory(g.category)} ${g.profile?.formatLabel || ''}`, qn)) return false;
    return true;
  });
  const storeRows = searchable.flatMap((group) => values(group.items, 'super').map((store) => ({ store })));
  const brandOptions = uniqueOptions(searchable, (g) => g.brand, (_, g) => g.brandLabel);
  const categoryOptions = uniqueOptions(searchable, (g) => g.category, (value) => labelCategory(value));
  const formatOptions = uniqueOptions(searchable, (g) => g.profile?.formatLabel || 'Unidad', (value) => value);
  const storeOptions = uniqueOptions(storeRows, (row) => row.store, (value) => labelStore(value));
  state.compare.brand = validSelectValue(brandOptions, state.compare.brand);
  state.compare.category = validSelectValue(categoryOptions, state.compare.category);
  state.compare.format = validSelectValue(formatOptions, state.compare.format);
  state.compare.store = validSelectValue(storeOptions, state.compare.store);
  if ($('#compareBrand')) $('#compareBrand').value = state.compare.brand;
  if ($('#compareCategory')) $('#compareCategory').value = state.compare.category;

  const filtered = searchable.filter((g) => {
    if (state.compare.brand && g.brand !== state.compare.brand) return false;
    if (state.compare.category && g.category !== state.compare.category) return false;
    if (state.compare.format && (g.profile?.formatLabel || 'Unidad') !== state.compare.format) return false;
    if (state.compare.store && !g.items.some((item) => item.super === state.compare.store)) return false;
    return true;
  }).sort((a, b) => spreadPct(b) - spreadPct(a));
  const compareHeadHtml = `<thead><tr>
    <th>Producto</th>
    <th><span class="th-title">Marca</span>${filterSelectHtml('compareBrandFilter', 'Todas', brandOptions, state.compare.brand)}</th>
    <th><span class="th-title">Rubro</span>${filterSelectHtml('compareCategoryFilter', 'Todos', categoryOptions, state.compare.category)}</th>
    <th><span class="th-title">Formato</span>${filterSelectHtml('compareFormatFilter', 'Todos', formatOptions, state.compare.format)}</th>
    <th class="price">Reg.</th><th>Mejor cadena</th><th class="price">Min.</th><th class="price">Max.</th><th class="price">Brecha</th>
    <th><span class="th-title">Cadenas</span>${filterSelectHtml('compareStoreFilter', 'Todas', storeOptions, state.compare.store)}</th>
  </tr></thead>`;

  if (!filtered.length) {
    $('#compareList').innerHTML = `<table class="compact-table sheet-table compare-table">${compareHeadHtml}<tbody></tbody></table><div class="empty">No hay productos comparables para esos filtros.</div>`;
    $('#compareCount').textContent = 0;
    return;
  }

  const rowsHtml = filtered.map((g) => {
    const prices = g.items.map((x) => x.price).filter((p) => p != null);
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    const savings = min != null && max != null && max > min ? max - min : 0;
    const priced = g.items.filter((item) => item.price != null).sort((a, b) => a.price - b.price);
    const best = priced[0] || g.items[0];
    const stores = values(g.items, 'super').map(labelStore);
    const storeText = stores.slice(0, 5).join(', ') + (stores.length > 5 ? ` +${stores.length - 5}` : '');
    const gapPct = min != null && max != null && max ? (1 - min / max) * 100 : null;
    const bestUrl = productSourceUrl(best);
    const minCell = bestUrl
      ? `<a href="${escape(bestUrl)}" target="_blank" rel="noopener">${fmtPrice(min)}</a>`
      : fmtPrice(min);
    return `<tr>
      <td>${productTextCell(best, `<span class="table-sub">${g.items.length} registros / ${stores.length} cadenas</span>`, g.label)}</td>
      <td>${escape(g.brandLabel)}</td>
      <td>${escape(labelCategory(g.category))}</td>
      <td>${escape(g.profile?.formatLabel || formatProfile(best))}</td>
      <td class="price">${g.items.length}</td>
      <td>${escape(labelStore(best?.super))}</td>
      <td class="price min">${minCell}</td>
      <td class="price">${fmtPrice(max)}</td>
      <td class="price">${savings > 0 ? `${fmtPrice(savings)}${gapPct != null ? `<span class="table-sub">${gapPct.toFixed(0)}%</span>` : ''}` : '-'}</td>
      <td><span class="sheet-muted">${escape(storeText)}</span></td>
    </tr>`;
  }).join('');
  $('#compareList').innerHTML = `<table class="compact-table sheet-table compare-table">
    ${compareHeadHtml}
    <tbody>${rowsHtml}</tbody>
  </table>`;
  bindProductLinks($('#compareList'));
  $('#compareCount').textContent = filtered.length;
  return;

  $('#compareList').innerHTML = filtered.map((g) => {
    const prices = g.items.map((x) => x.price).filter((p) => p != null);
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    const savings = min != null && max != null && max > min ? max - min : 0;
    const stores = values(g.items, 'super');
    const cells = stores.map((store) => {
      const it = g.items.filter((x) => x.super === store).sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))[0];
      const isBest = it.price === min;
      const diff = it.price != null && min != null && it.price > min ? `+${fmtPrice(it.price - min)}` : '';
      return `<div class="compare-cell ${isBest ? 'best' : ''}">
        <div class="compare-cell-label">${storeLogo(store)}</div>
        <div class="compare-cell-price">${productSourceUrl(it) ? `<a href="${escape(productSourceUrl(it))}" target="_blank" rel="noopener">${fmtPrice(it.price)}</a>` : fmtPrice(it.price)}</div>
        <div class="compare-cell-diff">${isBest ? 'Menor precio' : diff}</div>
      </div>`;
    }).join('');
    return `<div class="compare-row">
      <div class="compare-prod">
        <div>
          <div class="compare-prod-name">${escape(g.label)}</div>
          <div class="compare-prod-brand">${escape(g.brandLabel)}  -  ${escape(labelCategory(g.category))}  -  ${g.items.length} registros</div>
        </div>
        ${savings > 0 ? `<div class="compare-saving"><span>${fmtPrice(savings)}</span><small>diferencia</small></div>` : ''}
      </div>
      <div class="compare-prices">${cells}</div>
    </div>`;
  }).join('') || '<div class="empty">No hay productos comparables para esos filtros.</div>';
  $('#compareCount').textContent = filtered.length;
}

function spreadPct(group) {
  const prices = group.items.map((x) => x.price).filter((p) => p != null);
  if (prices.length < 2) return 0;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return max ? (1 - min / max) * 100 : 0;
}

function modeMatchesRubro(row, rubro = state.mode.rubro) {
  if (!rubro || rubro === 'all') return true;
  return row.category === rubro;
}

function modeSearchMatches(row, qn) {
  if (!qn) return true;
  const haystack = `${row.label} ${row.brandLabel} ${labelOwner(row.group)} ${labelCategory(row.category)} ${row.segment.label} ${row.sizeLabel} ${row.modeStores.join(' ')}`.toLowerCase();
  return stripAccents(haystack).includes(qn);
}

function modeBaseFilter(row, qn, { ignoreBrand = false, ignoreOwner = false, ignoreRubro = false, ignoreSegment = false, ignoreStore = false } = {}) {
  if (!ignoreBrand && state.mode.brand && row.brand !== state.mode.brand) return false;
  if (!ignoreOwner && state.mode.owner && row.group !== state.mode.owner) return false;
  if (state.mode.category && row.category !== state.mode.category) return false;
  if (!ignoreRubro && !modeMatchesRubro(row)) return false;
  if (!ignoreSegment && state.mode.segment && row.segment.key !== state.mode.segment) return false;
  if (!ignoreStore && state.mode.store && !row.modeStores.includes(state.mode.store)) return false;
  return modeSearchMatches(row, qn);
}

function renderModeRubroChips(allRows, qn) {
  const scoped = allRows.filter((row) => modeBaseFilter(row, qn, { ignoreRubro: true, ignoreSegment: true }));
  $('#modeRubroChips').innerHTML = MODE_RUBRO_FILTERS.map((filter) => {
    const count = scoped.filter((row) => modeMatchesRubro(row, filter.key)).length;
    const active = (state.mode.rubro || 'all') === filter.key ? ' active' : '';
    return `<button type="button" class="mode-chip${active}" data-rubro="${escape(filter.key)}">${escape(filter.label)} <span>${count}</span></button>`;
  }).join('');
}

function modeSegmentOptions(rows) {
  const groups = new Map();
  for (const row of rows) {
    const current = groups.get(row.segment.key) || { key: row.segment.key, label: row.segment.label, category: row.category, count: 0 };
    current.count++;
    groups.set(row.segment.key, current);
  }
  const categoryOrder = Object.keys(CATEGORY_LABEL);
  return [...groups.values()].sort((a, b) =>
    (categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)) ||
    ((Number(String(a.key).match(/_presentacion_(\d+)/)?.[1]) || 0) - (Number(String(b.key).match(/_presentacion_(\d+)/)?.[1]) || 0)) ||
    b.count - a.count ||
    a.label.localeCompare(b.label, 'es'));
}

function renderModeSegmentChips(options) {
  if (state.mode.segment && !options.some((option) => option.key === state.mode.segment)) state.mode.segment = '';
  const allActive = state.mode.segment ? '' : ' active';
  $('#modeSegmentChips').innerHTML = `<button type="button" class="mode-chip${allActive}" data-segment="">Todos <span>${options.reduce((sum, option) => sum + option.count, 0)}</span></button>` +
    options.map((option) => {
      const active = state.mode.segment === option.key ? ' active' : '';
      return `<button type="button" class="mode-chip${active}" data-segment="${escape(option.key)}">${escape(option.label)} <span>${option.count}</span></button>`;
    }).join('');
}

function modeBenchmark(aggregates, segmentKey) {
  const preferred = benchmarkBrandForSegment(segmentKey);
  const benchmark = preferred ? aggregates.find((row) => row.brand === preferred) : null;
  if (benchmark?.avgPpl) {
    return { value: benchmark.avgPpl, label: benchmark.label, brand: benchmark.brand, type: 'brand' };
  }
  const competitors = aggregates.filter((row) => row.group === 'competencia');
  const compAvg = weightedAvg(competitors, (row) => row.avgPpl, (row) => row.obs);
  if (compAvg) return { value: compAvg, label: 'Competencia prom.', brand: '', type: 'average' };
  return null;
}

function modeTargetRange(focus, chart) {
  const sarubbiRows = (chart.rows || []).filter((row) => row.group === 'sarubbi');
  const mids = sarubbiRows
    .map((row) => strategyTargetMid(focus.segment?.key || row.rows?.[0]?.segment?.key, row.brand))
    .filter(Number.isFinite);
  if (mids.length) {
    const mid = weightedAvg(mids.map((value) => ({ value })), (row) => row.value);
    return [mid, mid];
  }
  return strategyTargetRange(focus.segment?.key || focus.rows?.[0]?.segment?.key, '');
}

function modeBrandAggregates(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (row.modePricePerLiter == null || !Number.isFinite(row.modePricePerLiter)) continue;
    const key = `${row.brand}|${row.group}`;
    const group = groups.get(key) || {
      brand: row.brand,
      label: row.brandLabel,
      group: row.group,
      rows: [],
      obs: 0,
      sample: row.sample,
    };
    group.rows.push(row);
    group.obs += row.modeCount;
    groups.set(key, group);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    skuCount: group.rows.length,
    avgPpl: weightedAvg(group.rows, (row) => row.modePricePerLiter, (row) => row.modeCount),
  })).filter((group) => group.avgPpl != null);
}

function modeFocusRows(baseRows) {
  const comparable = baseRows.filter((row) => row.modePricePerLiter != null && row.bucket);
  if (!comparable.length) return { rows: [], segment: null };
  const groups = new Map();
  for (const row of comparable) {
    const group = groups.get(row.segment.key) || { key: row.segment.key, label: row.segment.label, category: row.category, rows: [] };
    group.rows.push(row);
    groups.set(row.segment.key, group);
  }
  const candidates = [...groups.values()].filter((group) =>
    group.rows.some((row) => row.group === 'sarubbi') && group.rows.some((row) => row.group === 'competencia'));
  if (!candidates.length) return { rows: comparable, segment: null };
  const selected = state.mode.segment ? candidates.find((group) => group.key === state.mode.segment) : null;
  if (selected) return { rows: selected.rows, segment: selected };
  const chosen = candidates.sort((a, b) => b.rows.length - a.rows.length)[0];
  return { rows: chosen.rows, segment: chosen };
}

function modeBrandIndexData(focus) {
  const aggregates = modeBrandAggregates(focus.rows);
  const benchmark = modeBenchmark(aggregates, focus.segment?.key || focus.rows[0]?.segment?.key);
  if (!benchmark?.value) return { rows: [], benchmark: null, maxIndex: 120, sarubbiIndex: null };
  const segmentKey = focus.segment?.key || focus.rows[0]?.segment?.key;
  const rows = aggregates.map((row) => ({
    ...row,
    index: row.avgPpl / benchmark.value * 100,
    isBenchmark: benchmark.brand && row.brand === benchmark.brand,
    targetRange: strategyTargetRange(segmentKey, row.brand),
  })).sort((a, b) => (b.index - a.index) || a.label.localeCompare(b.label, 'es')).slice(0, 12);
  const targets = rows.filter((row) => row.group === 'sarubbi').flatMap((row) => row.targetRange || []);
  const maxIndex = Math.max(120, MODE_TARGET_INDEX + 20, ...rows.map((row) => row.index), ...targets) + 8;
  const sarubbiIndex = weightedAvg(rows.filter((row) => row.group === 'sarubbi'), (row) => row.index, (row) => row.obs);
  return { rows, benchmark, maxIndex, sarubbiIndex: sarubbiIndex };
}

function modeLineData(focus) {
  const groups = new Map();
  for (const row of focus.rows) {
    if (!row.bucket || row.modePricePerLiter == null || !Number.isFinite(row.modePricePerLiter)) continue;
    const group = groups.get(row.bucket.value) || { bucket: row.bucket, rows: [] };
    group.rows.push(row);
    groups.set(row.bucket.value, group);
  }
  return [...groups.values()].sort((a, b) => a.bucket.value - b.bucket.value).map((group) => {
    const sarubbi = group.rows.filter((row) => row.group === 'sarubbi');
    if (!sarubbi.length) return null;
    const aggregates = modeBrandAggregates(group.rows);
    const benchmark = modeBenchmark(aggregates, focus.segment?.key || group.rows[0]?.segment?.key);
    if (!benchmark?.value) return null;
    const sarubbiPpl = weightedAvg(sarubbi, (row) => row.modePricePerLiter, (row) => row.modeCount);
    return {
      label: group.bucket.label,
      value: group.bucket.value,
      index: sarubbiPpl / benchmark.value * 100,
      sarubbiPpl,
      benchmark,
      count: sarubbi.length,
    };
  }).filter(Boolean);
}

function modeIndexLookup(allRows) {
  const groups = new Map();
  for (const row of allRows) {
    if (!row.bucket || row.modePricePerLiter == null || !Number.isFinite(row.modePricePerLiter)) continue;
    const key = `${row.category}|${row.segment.key}|${row.bucket.value}`;
    const group = groups.get(key) || [];
    group.push(row);
    groups.set(key, group);
  }
  const lookup = new Map();
  for (const rows of groups.values()) {
    const aggregates = modeBrandAggregates(rows);
    const benchmark = modeBenchmark(aggregates, rows[0]?.segment?.key);
    if (!benchmark?.value) continue;
    for (const row of rows) {
      lookup.set(row, {
        index: row.modePricePerLiter / benchmark.value * 100,
        benchmarkLabel: benchmark.label,
      });
    }
  }
  return lookup;
}

function renderModeSummary(rows, focus, chart, targetRange) {
  const sarubbi = rows.filter((row) => row.group === 'sarubbi');
  const comp = rows.filter((row) => row.group === 'competencia');
  const status = strategyStatus(chart.sarubbiIndex, targetRange);
  const targetClass = chart.sarubbiIndex == null ? '' : status.key === 'ok' ? ' ok' : status.key === 'above' ? ' above' : ' below';
  $('#modeSummary').innerHTML = `
    <div class="mode-summary-card"><span>SKUs filtrados</span><b>${rows.length}</b><small>${sarubbi.length} Sarubbi / ${comp.length} competencia</small></div>
    <div class="mode-summary-card"><span>Foco grafico</span><b>${escape(focus.segment?.label || 'Sin segmento unico')}</b><small>${focus.rows.length || 0} SKUs con normalizado</small></div>
    <div class="mode-summary-card"><span>Referencia 100</span><b>${escape(chart.benchmark?.label || 'Sin base')}</b><small>${chart.benchmark ? fmtPerLiter(chart.benchmark.value) : 'Falta competencia equivalente'}</small></div>
    <div class="mode-summary-card${targetClass}"><span>Objetivo marketing</span><b>${chart.sarubbiIndex == null ? '-' : `${chart.sarubbiIndex.toFixed(0)}%`}</b><small>${chart.sarubbiIndex == null ? `Meta ${strategyTargetLabel(targetRange)}` : `${status.label} / meta ${strategyTargetLabel(targetRange)}`}</small></div>
  `;
}

function renderModeBarChart(chart, focus, targetRange) {
  if (!chart.rows.length) {
    return '<div class="mode-chart"><h3>Indice por marca</h3><div class="empty compact">No hay competencia equivalente para construir el indice.</div></div>';
  }
  const targetIndex = (targetRange[0] + targetRange[1]) / 2;
  const targetLeft = Math.min(100, targetIndex / chart.maxIndex * 100);
  const refLeft = Math.min(100, 100 / chart.maxIndex * 100);
  return `<div class="mode-chart">
    <div class="mode-chart-head">
      <div><h3>Indice por marca</h3><p>${escape(focus.segment?.label || 'Segmento filtrado')} / ${escape(chart.benchmark.label)} = 100</p></div>
      <span class="mode-target-pill">Objetivo ${strategyTargetLabel(targetRange)}</span>
    </div>
    <div class="mode-bars">
      ${chart.rows.map((row) => {
        const width = Math.max(2, Math.min(100, row.index / chart.maxIndex * 100));
        const cls = row.group === 'sarubbi' ? 'sarubbi' : row.isBenchmark ? 'benchmark' : 'comp';
        return `<div class="mode-bar-row">
          <div class="mode-bar-label"><strong>${escape(row.label)}</strong><span>${row.skuCount} SKUs / ${escape(labelOwner(row.group))}</span></div>
          <div class="mode-bar-track" style="--target-left:${targetLeft.toFixed(2)}%;--ref-left:${refLeft.toFixed(2)}%">
            <i class="mode-ref-line"></i><i class="mode-target-line"></i>
            <div class="mode-bar-fill ${cls}" style="width:${width.toFixed(2)}%"></div>
          </div>
          <div class="mode-bar-value ${cls}">${row.index.toFixed(0)}%</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderModeLineChart(points, focus, targetRange) {
  if (!points.length) {
    return '<div class="mode-chart"><h3>Sarubbi por presentacion</h3><div class="empty compact">Faltan presentacions comparables con Sarubbi y competencia.</div></div>';
  }
  const W = 640, H = 220, P = 34;
  const targetIndex = (targetRange[0] + targetRange[1]) / 2;
  const maxY = Math.max(120, targetIndex + 20, ...points.map((pt) => pt.index)) + 8;
  const xFor = (i) => P + (points.length === 1 ? (W - 2 * P) / 2 : i / (points.length - 1) * (W - 2 * P));
  const yFor = (value) => H - P - (value / maxY) * (H - 2 * P);
  const path = points.map((pt, i) => `${i ? 'L' : 'M'} ${xFor(i).toFixed(1)} ${yFor(pt.index).toFixed(1)}`).join(' ');
  const targetY = yFor(targetIndex);
  return `<div class="mode-chart">
    <div class="mode-chart-head">
      <div><h3>Sarubbi por presentacion</h3><p>${escape(focus.segment?.label || 'Segmento filtrado')} contra referencia equivalente</p></div>
    </div>
    <svg class="mode-line-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Indice Sarubbi por presentacion">
      <line x1="${P}" y1="${targetY.toFixed(1)}" x2="${W - P}" y2="${targetY.toFixed(1)}" class="mode-line-target" />
      <text x="${W - P}" y="${(targetY - 6).toFixed(1)}" text-anchor="end" class="mode-line-label">Obj ${strategyTargetLabel(targetRange)}</text>
      <path d="${path}" class="mode-line-path" />
      ${points.map((pt, i) => `<g>
        <circle cx="${xFor(i).toFixed(1)}" cy="${yFor(pt.index).toFixed(1)}" r="4.5" class="mode-line-dot" />
        <text x="${xFor(i).toFixed(1)}" y="${(H - 11).toFixed(1)}" text-anchor="middle" class="mode-line-x">${escape(pt.label)}</text>
        <text x="${xFor(i).toFixed(1)}" y="${(yFor(pt.index) - 9).toFixed(1)}" text-anchor="middle" class="mode-line-value">${pt.index.toFixed(0)}%</text>
      </g>`).join('')}
    </svg>
  </div>`;
}

function renderModeCharts(focus, chart, targetRange) {
  const line = modeLineData(focus);
  $('#modeCharts').innerHTML = renderModeBarChart(chart, focus, targetRange) + renderModeLineChart(line, focus, targetRange);
}

function renderModeIndexCell(row, meta) {
  if (!meta) {
    return `<span class="mode-index-empty">Sin base equivalente</span><span class="table-sub">${fmtPerLiter(row.modePricePerLiter)}</span>`;
  }
  const targetRange = strategyTargetRange(row.segment.key, row.brand);
  const status = strategyStatus(meta.index, targetRange);
  const target = row.group === 'sarubbi' ? `<span class="mode-target-status ${status.key}">${escape(status.label)}</span>` : '';
  return `<div class="mode-index-cell">
    <span class="mode-index-value">${meta.index.toFixed(0)}%</span>
    ${target}
    <span class="table-sub">vs ${escape(meta.benchmarkLabel)} 100 / obj ${strategyTargetLabel(targetRange)} / ${fmtPerLiter(row.modePricePerLiter)}</span>
  </div>`;
}

function renderModeTableFilters(allRows, qn) {
  const scoped = allRows.filter((row) => modeSearchMatches(row, qn));
  const storeRows = scoped.flatMap((row) => row.modeStores.map((store) => ({ store })));
  state.mode.brand = fillSelect('#modeBrandFilter', 'Todas', uniqueOptions(scoped, (row) => row.brand, (_, row) => row.brandLabel), state.mode.brand);
  state.mode.owner = fillSelect('#modeOwnerFilter', 'Todos', uniqueOptions(scoped, (row) => row.group, (value) => labelOwner(value)), state.mode.owner);
  const rubroOptions = MODE_RUBRO_FILTERS
    .filter((option) => option.key !== 'all')
    .map((option) => ({ value: option.key, label: option.label }));
  state.mode.rubro = fillSelect('#modeCategoryFilter', 'Todos', rubroOptions, state.mode.rubro === 'all' ? '' : state.mode.rubro) || 'all';
  state.mode.store = fillSelect('#modeStoreFilter', 'Todas', uniqueOptions(storeRows, (row) => row.store, (value) => value), state.mode.store);
  const segmentScoped = scoped.filter((row) => modeBaseFilter(row, qn, { ignoreSegment: true }));
  state.mode.segment = fillSelect('#modeSegmentFilter', 'Todos', uniqueOptions(segmentScoped, (row) => row.segment.key, (_, row) => row.segment.label), state.mode.segment);
}

function renderMode() {
  const qn = stripAccents(state.mode.q || '').toLowerCase().trim();
  const allRows = skuModeRows();
  renderModeTableFilters(allRows, qn);
  const baseRows = allRows.filter((row) => modeBaseFilter(row, qn, { ignoreSegment: true }));
  const rows = allRows.filter((row) => modeBaseFilter(row, qn));
  const chartSource = allRows.filter((row) => modeBaseFilter(row, qn, { ignoreOwner: true }));
  const focus = modeFocusRows(chartSource.length ? chartSource : baseRows);
  const chart = modeBrandIndexData(focus);
  const targetRange = modeTargetRange(focus, chart);
  const indexLookup = modeIndexLookup(allRows);
  renderModeSummary(rows, focus, chart, targetRange);
  renderModeCharts(focus, chart, targetRange);

  const tbody = $('#modeRows');
  const empty = $('#modeEmpty');
  if (!rows.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = rows.slice(0, 300).map((row) => `<tr>
      <td>${productTextCell(row.sample, `<span class="table-sub">${row.count} obs. / ${row.stores} cadenas</span>`, row.label)}</td>
      <td>${escape(row.brandLabel)}</td>
      <td>${escape(labelOwner(row.group))}</td>
      <td>${escape(labelCategory(row.category))}</td>
      <td>${escape(row.segment.label)}<span class="table-sub">${escape(row.sizeLabel)}</span></td>
      <td class="price"><span class="mode-price-main">${fmtPrice(row.modePrice)}</span><span class="table-sub">${row.modeCount}/${row.count} obs. / ${row.modeShare.toFixed(0)}%</span></td>
      <td>${renderModeIndexCell(row, indexLookup.get(row))}</td>
      <td class="price">${fmtPrice(row.min)} - ${fmtPrice(row.max)}</td>
      <td><span class="sheet-muted">${escape(row.modeStores.slice(0, 5).join(', '))}${row.modeStores.length > 5 ? ' +' + (row.modeStores.length - 5) : ''}</span></td>
    </tr>`).join('');
    bindProductLinks(tbody);
  }
  $('#modeCount').textContent = rows.length;
  applyClientCopy($('#view-mode'));
}

function renderOffers() {
  const offers = state.items
    .filter((i) => i.listPrice && i.price && i.listPrice > i.price)
    .map((i) => ({ ...i, discount: 1 - i.price / i.listPrice, savings: i.listPrice - i.price }))
    .sort((a, b) => b.discount - a.discount);
  state.offers.brand = fillSelect('#offersBrandFilter', 'Todas', selectOptions(offers, 'brand', (_, item) => labelBrand(item)), state.offers.brand);
  state.offers.owner = fillSelect('#offersOwnerFilter', 'Todos', selectOptions(offers, 'group', (value) => labelOwner(value)), state.offers.owner);
  state.offers.category = fillSelect('#offersCategoryFilter', 'Todos', selectOptions(offers, 'category', (value) => labelCategory(value)), state.offers.category);
  state.offers.store = fillSelect('#offersStoreFilter', 'Todas', selectOptions(offers, 'super', (value) => labelStore(value)), state.offers.store);
  const qn = stripAccents((state.offers.q || '').toLowerCase().trim());
  const filtered = offers.filter((o) => {
    if (state.offers.brand && o.brand !== state.offers.brand) return false;
    if (state.offers.owner && o.group !== state.offers.owner) return false;
    if (state.offers.category && o.category !== state.offers.category) return false;
    if (state.offers.store && o.super !== state.offers.store) return false;
    if (qn && !textMatchesQuery(`${o.name} ${labelBrand(o)} ${labelOwner(o.group)} ${labelCategory(o.category)} ${labelStore(o.super)} ${o.branch || ''}`, qn)) return false;
    return true;
  });
  const tbody = $('#offersRows');
  const empty = $('#offersEmpty');
  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map((o) => {
      return `<tr>
        <td>${productTextCell(o)}</td>
        <td>${escape(labelBrand(o))}</td>
        <td>${escape(labelOwner(o.group))}</td>
        <td>${escape(labelCategory(o.category))}</td>
        <td>${escape(labelStore(o.super))}${o.branch ? `<span class="table-sub">${escape(o.branch)}</span>` : ''}</td>
        <td class="price list">${fmtPrice(o.listPrice)}</td>
        <td class="price">${fmtPrice(o.price)}</td>
        <td class="price">${fmtPrice(o.savings)}</td>
        <td><span class="discount-badge">-${Math.round(o.discount * 100)}%</span></td>
      </tr>`;
    }).join('');
    bindProductLinks(tbody);
  }
  $('#offersCount').textContent = filtered.length;
}

function renderSuggested() {
  const all = state.items.filter((i) => i.suggestedPrice != null);
  const qn = stripAccents((state.suggestedFilters.q || '').toLowerCase().trim());
  const filtered = all.filter((item) => {
    if (state.suggestedFilters.status && item.suggestedStatus !== state.suggestedFilters.status) return false;
    if (!qn) return true;
    const haystack = `${item.name} ${labelBrand(item)} ${labelStore(item.super)} ${item.branch || ''} ${item.suggestedProduct || ''} ${item.suggestedSource || ''}`.toLowerCase();
    return stripAccents(haystack).includes(qn);
  }).sort((a, b) => Math.abs(b.suggestedDeviationPct ?? 0) - Math.abs(a.suggestedDeviationPct ?? 0));

  const stats = {
    above: all.filter((i) => i.suggestedStatus === 'above').length,
    ok: all.filter((i) => i.suggestedStatus === 'ok').length,
    below: all.filter((i) => i.suggestedStatus === 'below').length,
  };
  const source = state.suggested || {};
  $('#suggestedSummary').innerHTML = `
    <div class="suggested-card above"><div class="suggested-card-label">Sobre PVS</div><div class="suggested-card-value">${stats.above}</div></div>
    <div class="suggested-card ok"><div class="suggested-card-label">Cumple</div><div class="suggested-card-value">${stats.ok}</div></div>
    <div class="suggested-card below"><div class="suggested-card-label">Bajo PVS</div><div class="suggested-card-value">${stats.below}</div></div>
    <div class="suggested-card"><div class="suggested-card-label">Fuente</div><div class="suggested-card-value small">${escape(source.sourceFile || 'Sin fuente')}</div><div class="suggested-ref">${source.rowsWithSuggested || 0} lineas con PVS</div></div>
  `;

  const tbody = $('#suggestedRows');
  const empty = $('#suggestedEmpty');
  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = filtered.map((item) => {
      return `<tr>
        <td>${productLinkCell(item)}</td>
        <td class="brand brand-cell">${brandLogo(item)}</td>
        <td>${storeLogo(item.super)}${item.branch ? `<div class="store-sub">${escape(item.branch)}</div>` : ''}</td>
        <td class="price">${fmtPrice(item.price)}</td>
        <td class="price">${fmtPrice(item.suggestedPrice)}</td>
        <td class="price suggested-dev ${escape(item.suggestedStatus || '')}">${fmtPct(item.suggestedDeviationPct)}</td>
        <td>${suggestedBadge(item)}</td>
        <td>
          <div>${escape(item.suggestedProduct || '-')}</div>
          <div class="suggested-ref">${escape(item.suggestedSource || '-')}  -  PVP informe ${fmtPrice(item.suggestedObservedPvp)}</div>
        </td>
      </tr>`;
    }).join('');
    bindProductLinks(tbody);
  }
  $('#suggestedCount').textContent = filtered.length;
}

function competitiveRows(sortMode = 'impact') {
  const rows = [];
  const entries = state.items.map((item) => {
    const profile = liquidProfile(item);
    return profile ? { item, profile, segment: competitiveSegment(item) } : null;
  }).filter(Boolean);
  const compByFormat = {};
  const sarubbiGroups = {};
  for (const entry of entries) {
    const formatKey = `${entry.item.category}|${entry.segment.key}|${entry.profile.bucket.value}`;
    if (entry.item.group === 'competencia') (compByFormat[formatKey] ??= []).push(entry);
    if (entry.item.group === 'sarubbi') {
      const sarubbiKey = `${entry.item.category}|${entry.segment.key}|${entry.item.brand}|${entry.profile.bucket.value}`;
      (sarubbiGroups[sarubbiKey] ??= {
        category: entry.item.category,
        brand: entry.item.brand,
        brandLabel: labelBrand(entry.item),
        segment: entry.segment,
        bucket: entry.profile.bucket,
        sarubbi: [],
        comp: [],
      }).sarubbi.push(entry);
    }
  }
  for (const group of Object.values(sarubbiGroups)) {
    const comp = compByFormat[`${group.category}|${group.segment.key}|${group.bucket.value}`] || [];
    if (!comp.length) continue;
    const sarubbiBest = group.sarubbi.slice().sort((a, b) => a.profile.pricePerLiter - b.profile.pricePerLiter)[0];
    const compBest = comp.slice().sort((a, b) => a.profile.pricePerLiter - b.profile.pricePerLiter)[0];
    const sarubbiAvgPerLiter = avg(group.sarubbi.map((entry) => entry.profile.pricePerLiter));
    const compAvgPerLiter = avg(comp.map((entry) => entry.profile.pricePerLiter));
    const diff = sarubbiAvgPerLiter - compAvgPerLiter;
    rows.push({
      ...group,
      comp,
      sarubbiBest: sarubbiBest,
      compBest,
      sarubbiAvgPerLiter: sarubbiAvgPerLiter,
      compAvgPerLiter,
      diff,
      pct: compAvgPerLiter ? (diff / compAvgPerLiter) * 100 : 0,
    });
  }
  if (sortMode === 'format') {
    const categoryOrder = Object.keys(CATEGORY_LABEL);
    return rows.sort((a, b) =>
      (categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)) ||
      a.segment.label.localeCompare(b.segment.label, 'es') ||
      a.brandLabel.localeCompare(b.brandLabel, 'es') ||
      (a.bucket.value - b.bucket.value));
  }
  return rows.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
}

function competitiveEntries() {
  return state.items.map((item) => {
    const profile = liquidProfile(item);
    return profile ? { item, profile, segment: competitiveSegment(item) } : null;
  }).filter(Boolean);
}

function positioningStoreAllowed(item) {
  return !state.positioning.stores.size || state.positioning.stores.has(item.super);
}

function positioningCategoryRows(entries) {
  return values(entries.map((entry) => entry.item), 'category').map((category) => {
    const scoped = entries.filter((entry) => entry.item.category === category && positioningStoreAllowed(entry.item));
    const sarubbi = scoped.filter((entry) => entry.item.group === 'sarubbi');
    const comp = scoped.filter((entry) => entry.item.group === 'competencia');
    const sarubbiAvg = avg(sarubbi.map((entry) => entry.profile.pricePerLiter));
    const compAvg = avg(comp.map((entry) => entry.profile.pricePerLiter));
    const gap = sarubbiAvg != null && compAvg != null && compAvg ? (sarubbiAvg / compAvg - 1) * 100 : null;
    return { category, sarubbi: sarubbi, comp, sarubbiAvg: sarubbiAvg, compAvg, gap };
  }).sort((a, b) => labelCategory(a.category).localeCompare(labelCategory(b.category), 'es'));
}

function sortCompetitiveDetail(a, b) {
  return a.segment.label.localeCompare(b.segment.label, 'es') ||
    (a.profile.bucket.value - b.profile.bucket.value) ||
    (a.item.group === b.item.group ? 0 : a.item.group === 'sarubbi' ? -1 : 1) ||
    labelBrand(a.item).localeCompare(labelBrand(b.item), 'es') ||
    (Number(a.item.price ?? Infinity) - Number(b.item.price ?? Infinity)) ||
    labelStore(a.item.super).localeCompare(labelStore(b.item.super), 'es');
}

function renderCompetitiveDetailRows(entries) {
  return entries.sort(sortCompetitiveDetail).map((entry) => {
    const item = entry.item;
    const pack = entry.profile.units > 1 ? `pack x${entry.profile.units}` : '';
    return `<tr>
      <td>${productLinkCell(item, `<br><span class="table-sub">${escape(entry.segment.label)} / ${escape(entry.profile.bucket.label)}${pack ? ` / ${escape(pack)}` : ''}</span>`)}</td>
      <td class="brand brand-cell">${brandLogo(item)}<div class="table-sub">${ownerBadge(item.group)}</div></td>
      <td>${storeLogo(item.super)}${item.branch ? `<div class="store-sub">${escape(item.branch)}</div>` : ''}</td>
      <td>${escape(labelCategory(item.category))}</td>
      <td class="price">${fmtPrice(item.price)}${item.listPrice && item.listPrice > item.price ? `<br><span class="price list">${fmtPrice(item.listPrice)}</span>` : ''}</td>
      <td class="price">${fmtPerLiter(entry.profile.pricePerLiter)}</td>
    </tr>`;
  }).join('');
}

function positioningRowsForSelection(rows, selectedCategory) {
  return rows.map((row) => {
    if (row.category !== selectedCategory) return null;
    const sarubbi = row.sarubbi.filter((entry) => positioningStoreAllowed(entry.item));
    const comp = row.comp.filter((entry) => positioningStoreAllowed(entry.item));
    if (!sarubbi.length || !comp.length) return null;
    const sarubbiBest = sarubbi.slice().sort((a, b) => a.profile.pricePerLiter - b.profile.pricePerLiter)[0];
    const compBest = comp.slice().sort((a, b) => a.profile.pricePerLiter - b.profile.pricePerLiter)[0];
    const sarubbiAvgPerLiter = avg(sarubbi.map((entry) => entry.profile.pricePerLiter));
    const compAvgPerLiter = avg(comp.map((entry) => entry.profile.pricePerLiter));
    const diff = sarubbiAvgPerLiter - compAvgPerLiter;
    return {
      ...row,
      sarubbi: sarubbi,
      comp,
      sarubbiBest: sarubbiBest,
      compBest,
      sarubbiAvgPerLiter: sarubbiAvgPerLiter,
      compAvgPerLiter,
      diff,
      pct: compAvgPerLiter ? (diff / compAvgPerLiter) * 100 : 0,
    };
  }).filter(Boolean);
}

function competitiveStrategyCell(row) {
  const index = row.compAvgPerLiter ? row.sarubbiAvgPerLiter / row.compAvgPerLiter * 100 : null;
  const range = strategyTargetRange(row.segment.key, row.brand);
  return `<div class="strategy-cell">
    <b>${index == null ? '-' : `${index.toFixed(0)}%`}</b>
    ${strategyBadge(index, range)}
    <span class="table-sub">obj ${strategyTargetLabel(range)}</span>
  </div>`;
}

function legacyCompetitiveRows() {
  const rows = [];
  const groups = {};
  for (const item of state.items) {
    const size = extractSize(item.name);
    if (!size || item.price == null) continue;
    const key = `${item.category}|${size.unit}|${size.value}`;
    (groups[key] ??= { category: item.category, size, items: [] }).items.push(item);
  }
  for (const group of Object.values(groups)) {
    const sarubbi = group.items.filter((i) => i.group === 'sarubbi');
    const comp = group.items.filter((i) => i.group === 'competencia');
    if (!sarubbi.length || !comp.length) continue;
    const sarubbiMin = minItem(sarubbi);
    const compMin = minItem(comp);
    const diff = sarubbiMin.price - compMin.price;
    rows.push({
      ...group,
      sarubbi: sarubbi,
      comp,
      sarubbiMin: sarubbiMin,
      compMin,
      diff,
      pct: compMin.price ? (diff / compMin.price) * 100 : 0,
    });
  }
  return rows.sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
}

function renderCompetitiveLegacy() {
  const rows = legacyCompetitiveRows();
  const byCategory = values(state.items, 'category').map((category) => {
    const sarubbi = state.items.filter((i) => i.category === category && i.group === 'sarubbi');
    const comp = state.items.filter((i) => i.category === category && i.group === 'competencia');
    return { category, sarubbi: sarubbi, comp, sarubbiAvg: avg(sarubbi.map((i) => i.price)), compAvg: avg(comp.map((i) => i.price)) };
  });

  $('#positioningContent').innerHTML = `
    <div class="exec-grid">
      <div class="exec-card">
        <h3>Sarubbi vs competencia por categoria</h3>
        <div class="brand-stats">
          ${byCategory.map((c) => {
            const gap = c.sarubbiAvg != null && c.compAvg != null ? Math.round((c.sarubbiAvg / c.compAvg - 1) * 100) : null;
            return `<div class="brand-stat">
              <div><div class="brand-stat-name">${escape(labelCategory(c.category))}</div><div class="brand-stat-detail">${c.sarubbi.length} Sarubbi  -  ${c.comp.length} competencia</div></div>
              <div class="stat-right"><div class="brand-stat-value">${gap == null ? '-' : `${gap > 0 ? '+' : ''}${gap}%`}</div><div class="brand-stat-detail">brecha prom.</div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="exec-card">
        <h3>Fuentes del relevamiento</h3>
        <div class="source-list">
          ${state.scrapeResults.map((r) => `<div class="source-row ${r.ok ? 'ok' : 'fail'}"><span>${escape(labelStore(r.name))}</span><b>${r.count}</b></div>`).join('') || '<div class="empty compact">Sin estado.</div>'}
        </div>
      </div>
    </div>

    <div class="exec-card">
      <h3>Formatos comparables</h3>
      <table>
        <thead><tr><th>Categoria</th><th>Formato</th><th>Mejor Sarubbi</th><th>Mejor competencia</th><th class="price">Brecha</th></tr></thead>
        <tbody>${rows.slice(0, 30).map((r) => `<tr>
          <td>${escape(labelCategory(r.category))}</td>
          <td>${escape(sizeLabel(r.size))}</td>
          <td>${escape(labelBrand(r.sarubbiMin))}  -  ${escape(labelStore(r.sarubbiMin.super))}<br><b>${fmtPrice(r.sarubbiMin.price)}</b></td>
          <td>${escape(labelBrand(r.compMin))}  -  ${escape(labelStore(r.compMin.super))}<br><b>${fmtPrice(r.compMin.price)}</b></td>
          <td class="price ${r.diff <= 0 ? 'min' : ''}">${r.diff > 0 ? '+' : ''}${fmtPrice(r.diff)}<br><span>${r.pct > 0 ? '+' : ''}${r.pct.toFixed(1)}%</span></td>
        </tr>`).join('') || '<tr><td colspan="5" class="empty compact">No hay formatos comparables aun.</td></tr>'}</tbody>
      </table>
    </div>
  `;
}

function renderCompetitive() {
  const allComparableRows = competitiveRows('format');
  const entries = competitiveEntries();
  const byCategory = positioningCategoryRows(entries);
  if (!state.positioning.category || !byCategory.some((c) => c.category === state.positioning.category)) {
    state.positioning.category = byCategory[0]?.category || '';
  }
  const selectedCategory = state.positioning.category;
  const rows = positioningRowsForSelection(allComparableRows, selectedCategory);
  const selectedEntries = entries
    .filter((entry) => entry.item.category === selectedCategory && positioningStoreAllowed(entry.item));
  const allCategoryEntries = entries.filter((entry) => entry.item.category === selectedCategory);
  const selectedSarubbi = selectedEntries.filter((entry) => entry.item.group === 'sarubbi');
  const selectedComp = selectedEntries.filter((entry) => entry.item.group === 'competencia');
  const selectedStores = state.positioning.stores;
  const storeOrder = state.scrapeResults.map((r) => r.name);
  const storeOptions = values(entries.map((entry) => entry.item), 'super')
    .sort((a, b) => {
      const ai = storeOrder.indexOf(a);
      const bi = storeOrder.indexOf(b);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || labelStore(a).localeCompare(labelStore(b), 'es');
    });
  const selectedStoreLabels = selectedStores.size
    ? [...selectedStores].map(labelStore).sort((a, b) => a.localeCompare(b, 'es')).join(', ')
    : 'Todas las cadenas';

  $('#positioningContent').innerHTML = `
    <div class="exec-grid">
      <div class="exec-card">
        <h3>Sarubbi vs competencia normalizado</h3>
        <div class="brand-stats">
          ${byCategory.map((c) => `<button type="button" class="brand-stat positioning-category ${c.category === selectedCategory ? 'active' : ''}" data-positioning-category="${escape(c.category)}">
            <div><div class="brand-stat-name">${escape(labelCategory(c.category))}</div><div class="brand-stat-detail">${c.sarubbi.length} Sarubbi / ${c.comp.length} competencia con presentacion y gama validos</div></div>
            <div class="stat-right"><div class="brand-stat-value">${c.gap == null ? '-' : `${c.gap > 0 ? '+' : ''}${c.gap.toFixed(1)}%`}</div><div class="brand-stat-detail">${fmtPerLiter(c.sarubbiAvg)} vs ${fmtPerLiter(c.compAvg)}</div></div>
          </button>`).join('')}
        </div>
      </div>
      <div class="exec-card">
        <h3>Cadenas</h3>
        <div class="mode-chip-row positioning-store-chips">
          <button type="button" class="mode-chip ${selectedStores.size ? '' : 'active'}" data-positioning-store="">Todas <span>${allCategoryEntries.length}</span></button>
          ${storeOptions.map((store) => {
            const count = entries.filter((entry) => entry.item.category === selectedCategory && entry.item.super === store).length;
            const active = selectedStores.has(store) ? ' active' : '';
            return `<button type="button" class="mode-chip${active}" data-positioning-store="${escape(store)}">${escape(labelStore(store))} <span>${count}</span></button>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="exec-card">
      <h3>Presentacions ${escape(labelCategory(selectedCategory))} Sarubbi vs competencia equivalente</h3>
      <p class="table-note">Cada fila respeta el rubro y cadenas elegidas arriba: compara una marca Sarubbi contra productos de competencia de la misma gama y presentacion equivalente.</p>
      <table>
        <thead><tr><th>Categoria</th><th>Gama</th><th>Marca Sarubbi</th><th>Presentacion</th><th>Prom. Sarubbi normalizado</th><th>Prom. competencia normalizado</th><th>Estrategia</th><th class="price">Brecha normalizado</th></tr></thead>
        <tbody>${rows.map((r) => `<tr>
          <td>${escape(labelCategory(r.category))}</td>
          <td>${escape(r.segment.label)}</td>
          <td class="brand brand-cell">${brandLogo(r.sarubbiBest.item)}</td>
          <td>${escape(r.bucket.label)}<br><span class="table-sub">${r.sarubbi.length} propios / ${r.comp.length} comp.</span></td>
          <td><b>${fmtPerLiter(r.sarubbiAvgPerLiter)}</b><br><span class="table-sub">mejor: ${escape(entryDetail(r.sarubbiBest))}</span></td>
          <td><b>${fmtPerLiter(r.compAvgPerLiter)}</b><br><span class="table-sub">mejor: ${escape(entryDetail(r.compBest))}</span></td>
          <td>${competitiveStrategyCell(r)}</td>
          <td class="price ${r.diff <= 0 ? 'min' : ''}">${r.diff > 0 ? '+' : r.diff < 0 ? '-' : ''}${fmtPerLiter(Math.abs(r.diff))}<br><span>${r.pct > 0 ? '+' : ''}${r.pct.toFixed(1)}%</span></td>
        </tr>`).join('') || '<tr><td colspan="8" class="empty compact">No hay presentacions comparables aun.</td></tr>'}</tbody>
      </table>
    </div>

    <div class="exec-card">
      <div class="positioning-detail-head">
        <div>
          <h3>Detalle ${escape(labelCategory(selectedCategory))}</h3>
          <p class="table-note">${selectedEntries.length} SKUs filtrados: ${selectedSarubbi.length} Sarubbi / ${selectedComp.length} competencia. Cadenas: ${escape(selectedStoreLabels)}.</p>
        </div>
        <div class="positioning-detail-kpis">
          <span>${fmtPerLiter(avg(selectedSarubbi.map((entry) => entry.profile.pricePerLiter)))} Sarubbi</span>
          <span>${fmtPerLiter(avg(selectedComp.map((entry) => entry.profile.pricePerLiter)))} comp.</span>
        </div>
      </div>
      <table class="compact-table positioning-detail-table">
        <thead><tr><th>Producto</th><th>Marca / dueno</th><th>Cadena</th><th>Categoria</th><th class="price">Precio</th><th class="price">normalizado</th></tr></thead>
        <tbody>${selectedEntries.length ? renderCompetitiveDetailRows(selectedEntries) : '<tr><td colspan="6" class="empty compact">Sin SKUs para el rubro y cadenas seleccionadas.</td></tr>'}</tbody>
      </table>
    </div>
  `;
  const root = $('#positioningContent');
  root.querySelectorAll('[data-positioning-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.positioning.category = btn.dataset.positioningCategory;
      renderCompetitive();
    });
  });
  root.querySelectorAll('[data-positioning-store]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const store = btn.dataset.positioningStore;
      if (!store) state.positioning.stores.clear();
      else if (state.positioning.stores.has(store)) state.positioning.stores.delete(store);
      else state.positioning.stores.add(store);
      renderCompetitive();
    });
  });
  bindProductLinks(root);
  applyClientCopy(root);
}

function portfolioOwner(row) {
  return String(row.owner || row.group || '').toLowerCase().includes('sarubbi') ? 'sarubbi' : 'competencia';
}

function portfolioRuleBrands(segmentKey) {
  const rule = strategyRule(segmentKey);
  if (!rule) return null;
  return new Set([...(rule.sarubbiBrands || []), ...(rule.competitorBrands || []), rule.benchmarkBrand, rule.indexBenchmarkBrand].filter(Boolean));
}

function portfolioMarketingAllowed(row) {
  const allowed = portfolioRuleBrands(row.segmentKey || row.segment?.key);
  return !allowed || allowed.has(row.brand);
}

function portfolioCurrentRows() {
  const groups = new Map();
  for (const row of skuModeRows()) {
    if (!PORTFOLIO_CATEGORIES.includes(row.category)) continue;
    if (row.modePricePerLiter == null || !Number.isFinite(row.modePricePerLiter)) continue;
    const key = `${row.category}|${row.segment.key}|${row.brand}|${row.group}`;
    const group = groups.get(key) || {
      category: row.category,
      segmentKey: row.segment.key,
      segmentLabel: row.segment.label,
      brand: row.brand,
      brandLabel: row.brandLabel,
      owner: row.group,
      rows: [],
      obs: 0,
      sample: row.sample,
    };
    group.rows.push(row);
    group.obs += row.modeCount;
    groups.set(key, group);
  }
  return [...groups.values()].map((group) => ({
    ...group,
    skuCount: group.rows.length,
    n: group.obs,
    ppl: weightedAvg(group.rows, (row) => row.modePricePerLiter, (row) => row.modeCount),
    source: 'latest',
  })).filter((row) => row.ppl != null);
}

function portfolioNormalizedSegment(row) {
  const key = row.segmentKey;
  return { key, label: row.segmentLabel || SEGMENT_LABEL[key] || key };
}

function portfolioMarketRowsForDate(date) {
  const market = Array.isArray(state.evolution?.market) ? state.evolution.market : [];
  if (!market.length || !date) return portfolioCurrentRows();
  return market
    .filter((row) => row.t === date && PORTFOLIO_CATEGORIES.includes(row.category))
    .map((row) => {
      const segment = portfolioNormalizedSegment(row);
      return {
        category: row.category,
        segmentKey: segment.key,
        segmentLabel: segment.label,
        brand: row.brand,
        brandLabel: row.brandLabel || row.brand,
        owner: portfolioOwner(row),
        n: Number(row.n || 0),
        ppl: Number(row.ppl),
        source: 'history',
      };
    })
    .filter((row) => Number.isFinite(row.ppl));
}

function portfolioDates() {
  const market = Array.isArray(state.evolution?.market) ? state.evolution.market : [];
  return [...new Set(market.map((row) => row.t).filter(Boolean))].sort();
}

function portfolioActiveDate() {
  const dates = portfolioDates();
  if (!dates.length) return '';
  if (!state.portfolio.date || !dates.includes(state.portfolio.date)) state.portfolio.date = dates[dates.length - 1];
  return state.portfolio.date;
}

function portfolioApplyIndex(rows) {
  const indexedRows = rows.filter(portfolioMarketingAllowed);
  const bySegment = new Map();
  for (const row of indexedRows) {
    const key = `${row.category}|${row.segmentKey}`;
    const group = bySegment.get(key) || [];
    group.push(row);
    bySegment.set(key, group);
  }
  const out = [];
  for (const segmentRows of bySegment.values()) {
    const segmentKey = segmentRows[0]?.segmentKey;
    const category = segmentRows[0]?.category;
    const benchmarkBrand = indexBenchmarkBrandForSegment(segmentKey);
    const benchmarkSegment = indexBenchmarkSegmentForSegment(segmentKey);
    const baseCandidates = indexedRows.filter((row) =>
      row.category === category &&
      row.brand === benchmarkBrand &&
      (!benchmarkSegment || row.segmentKey === benchmarkSegment));
    const baseRow = baseCandidates.sort((a, b) => (b.n || 0) - (a.n || 0))[0]
      || indexedRows.filter((row) => row.category === category && row.brand === benchmarkBrand).sort((a, b) => (b.n || 0) - (a.n || 0))[0]
      || segmentRows.find((row) => row.brand === benchmarkBrand)
      || segmentRows.filter((row) => portfolioOwner(row) === 'competencia').sort((a, b) => (b.n || 0) - (a.n || 0))[0];
    const base = baseRow?.ppl;
    for (const row of segmentRows) {
      const index = base ? row.ppl / base * 100 : null;
      const range = strategyTargetRange(segmentKey, row.brand);
      const status = portfolioOwner(row) === 'sarubbi' ? strategyStatus(index, range) : null;
      out.push({
        ...row,
        benchmarkBrand,
        benchmarkLabel: baseRow?.brandLabel || benchmarkBrand || 'Competencia',
        benchmarkPpl: base || null,
        index,
        targetRange: range,
        status,
      });
    }
  }
  return out;
}

function portfolioSegmentOptions(rows, category) {
  const groups = new Map();
  for (const row of rows.filter((r) => r.category === category)) {
    const current = groups.get(row.segmentKey) || { key: row.segmentKey, label: row.segmentLabel, count: 0 };
    current.count += 1;
    groups.set(row.segmentKey, current);
  }
  return [...groups.values()].sort((a, b) => {
    const av = Number(String(a.key).match(/_presentacion_(\d+)/)?.[1]);
    const bv = Number(String(b.key).match(/_presentacion_(\d+)/)?.[1]);
    if (Number.isFinite(av) && Number.isFinite(bv)) return av - bv;
    return a.label.localeCompare(b.label, 'es');
  });
}

function portfolioBrandOptions(rows, category, segmentKey) {
  const scoped = rows.filter((row) => row.category === category && portfolioOwner(row) === 'sarubbi' && (!segmentKey || row.segmentKey === segmentKey));
  return scoped
    .reduce((acc, row) => acc.some((x) => x.brand === row.brand) ? acc : acc.concat({ brand: row.brand, label: row.brandLabel, segmentKey: row.segmentKey }), [])
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

function portfolioFilterRows(rows) {
  const category = state.portfolio.category || PORTFOLIO_CATEGORIES[0] || 'jamon_cocido';
  let filtered = rows.filter((row) => row.category === category);
  if (state.portfolio.brand) {
    const brandSegments = new Set(filtered
      .filter((row) => row.brand === state.portfolio.brand && portfolioOwner(row) === 'sarubbi' && (!state.portfolio.segment || row.segmentKey === state.portfolio.segment))
      .map((row) => row.segmentKey));
    filtered = filtered.filter((row) => {
      if (!brandSegments.has(row.segmentKey)) return false;
      const rule = strategyRule(row.segmentKey);
      const allowed = new Set([state.portfolio.brand, ...(rule?.competitorBrands || []), rule?.benchmarkBrand, rule?.indexBenchmarkBrand].filter(Boolean));
      return !allowed.size || allowed.has(row.brand);
    });
  } else if (state.portfolio.segment) {
    filtered = filtered.filter((row) => row.segmentKey === state.portfolio.segment);
  }
  return filtered;
}

function portfolioX(index) {
  if (index == null || !Number.isFinite(index)) return 50;
  const clamped = Math.max(PORTFOLIO_INDEX_MIN, Math.min(PORTFOLIO_INDEX_MAX, index));
  return ((clamped - PORTFOLIO_INDEX_MIN) / (PORTFOLIO_INDEX_MAX - PORTFOLIO_INDEX_MIN)) * 100;
}

function portfolioPointX(index) {
  const x = portfolioX(index);
  return Math.max(7, Math.min(93, x));
}

function portfolioPointY(index) {
  return Math.max(7, Math.min(93, 100 - portfolioX(index)));
}

function portfolioSegmentKind(category) {
  return 'presentacion';
}

function portfolioAllSegmentsLabel(category) {
  return 'Todas las presentaciones';
}

function portfolioSegmentColumnLabel(category) {
  return 'Presentacion';
}

function portfolioLaneOrderKey(category) {
  return category || state.portfolio.category || 'all';
}

function portfolioLaneOrder(category) {
  return state.portfolio.laneOrder[portfolioLaneOrderKey(category)] || [];
}

function savePortfolioPrefs() {
  try {
    localStorage.setItem('sarubbiPortfolioPrefs', JSON.stringify({
      orientation: state.portfolio.orientation,
      laneOrder: state.portfolio.laneOrder,
    }));
  } catch {
    // Preferimos no romper la vista si el navegador bloquea localStorage.
  }
}

function loadPortfolioPrefs() {
  try {
    const raw = localStorage.getItem('sarubbiPortfolioPrefs') || localStorage.getItem('gondolaPortfolioPrefs');
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (prefs?.orientation === 'vertical' || prefs?.orientation === 'horizontal') {
      state.portfolio.orientation = prefs.orientation;
    }
    if (prefs?.laneOrder && typeof prefs.laneOrder === 'object') {
      state.portfolio.laneOrder = prefs.laneOrder;
    }
  } catch {
    // Preferencias corruptas: se ignoran y la app arranca con el orden natural.
  }
}

function sortPortfolioSegments(segments) {
  const category = segments[0]?.rows?.[0]?.category || state.portfolio.category;
  const order = portfolioLaneOrder(category);
  const rank = new Map(order.map((key, index) => [key, index]));
  return segments.slice().sort((a, b) => {
    const ar = rank.has(a.key) ? rank.get(a.key) : Number.MAX_SAFE_INTEGER;
    const br = rank.has(b.key) ? rank.get(b.key) : Number.MAX_SAFE_INTEGER;
    if (ar !== br) return ar - br;
    const av = Number(String(a.key).match(/_presentacion_(\d+)/)?.[1]);
    const bv = Number(String(b.key).match(/_presentacion_(\d+)/)?.[1]);
    if (Number.isFinite(av) && Number.isFinite(bv)) return av - bv;
    return a.label.localeCompare(b.label, 'es');
  });
}

function portfolioStatusClass(status) {
  if (!status) return '';
  if (status.key === 'ok') return ' ok';
  if (status.key === 'above') return ' above';
  if (status.key === 'below') return ' below';
  return '';
}

function portfolioStatusKey(row) {
  if (portfolioOwner(row) !== 'sarubbi') return 'competencia';
  return row.status?.key || 'missing';
}

function portfolioStatusLabel(key) {
  return {
    ok: 'En objetivo',
    below: 'Debajo objetivo',
    above: 'Sobre objetivo',
    missing: 'Sin base',
    competencia: 'Competencia',
  }[key] || key || '-';
}

function portfolioOwnerPill(owner) {
  const key = portfolioOwner({ owner });
  return `<span class="portfolio-owner-pill ${escape(key)}">${escape(labelOwner(key))}</span>`;
}

function portfolioIndexText(index, decimals = 0) {
  return index == null || !Number.isFinite(index) ? '-' : `${Number(index).toFixed(decimals)}%`;
}

function portfolioSegmentTargetRange(rows) {
  const ranges = rows
    .filter((row) => portfolioOwner(row) === 'sarubbi' && row.targetRange)
    .map((row) => row.targetRange);
  if (!ranges.length) return null;
  return [Math.min(...ranges.map((range) => range[0])), Math.max(...ranges.map((range) => range[1]))];
}

function portfolioTargetBand(range) {
  if (!range) return '';
  const from = portfolioX(range[0]);
  const to = portfolioX(range[1]);
  const vFrom = 100 - to;
  const vTo = 100 - from;
  return `<i class="portfolio-target-band" style="--from:${from.toFixed(2)}%;--to:${to.toFixed(2)}%;--vfrom:${vFrom.toFixed(2)}%;--vto:${vTo.toFixed(2)}%"><span>Obj. ${escape(strategyTargetLabel(range))}</span></i>`;
}

function portfolioBrandClass(brand) {
  const key = stripAccents(brand || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return key ? `brand-${key}` : '';
}

function portfolioPinKey(row) {
  return `${row.category}|${row.segmentKey}|${row.brand}|${portfolioOwner(row)}`;
}

function portfolioPinSelected(key) {
  return state.portfolio.selectedPins.includes(key);
}

function portfolioSelectedKeys() {
  return new Set(state.portfolio.selectedPins);
}

function portfolioPinZ(key, owner) {
  return state.portfolio.pinOrder[key] || (owner === 'sarubbi' ? 30 : 20);
}

function portfolioDisplayRows(rows) {
  const clean = rows.filter((row) => row.index != null && Number.isFinite(row.index));
  const picked = new Map();
  const add = (row) => {
    if (!row || picked.has(row.brand)) return;
    picked.set(row.brand, row);
  };
  clean
    .filter((row) => portfolioOwner(row) === 'sarubbi')
    .sort((a, b) => (b.n || 0) - (a.n || 0))
    .forEach(add);
  clean
    .filter((row) => row.brand === row.benchmarkBrand)
    .forEach(add);
  clean
    .filter((row) => portfolioOwner(row) !== 'sarubbi')
    .sort((a, b) => (b.n || 0) - (a.n || 0))
    .forEach(add);
  const display = [...picked.values()].slice(0, 10);
  return { display, hidden: Math.max(0, clean.length - display.length) };
}

function portfolioPoint(row, index) {
  const owner = portfolioOwner(row);
  const status = owner === 'sarubbi' ? portfolioStatusClass(row.status) : '';
  const value = portfolioIndexText(row.index);
  const pinKey = portfolioPinKey(row);
  const picked = portfolioPinSelected(pinKey) ? ' picked' : '';
  return `<span class="portfolio-point ${owner}${status}${picked} ${portfolioBrandClass(row.brand)}" role="button" tabindex="0" data-pin-key="${escape(pinKey)}" style="--x:${portfolioPointX(row.index).toFixed(2)}%;--y:${portfolioPointY(row.index).toFixed(2)}%;--lane:${index % 4};--slot-x:${(14 + (index % 6) * 14).toFixed(2)}%;--z:${portfolioPinZ(pinKey, owner)}" title="${escape(row.brandLabel)} - ${escape(value)}">
    <span class="portfolio-point-logo">${brandLogo({ brand: row.brand, brandLabel: row.brandLabel, group: owner })}</span><em>${escape(value)}</em>
  </span>`;
}

function renderPortfolioMap(rows, title = 'Mapa vigente') {
  const bySegment = new Map();
  for (const row of rows) {
    const group = bySegment.get(row.segmentKey) || { key: row.segmentKey, label: row.segmentLabel, rows: [] };
    group.rows.push(row);
    bySegment.set(row.segmentKey, group);
  }
  const segments = sortPortfolioSegments([...bySegment.values()]);
  if (!segments.length) return '<div class="empty compact">Sin marcas con price index para este filtro.</div>';
  const orientation = state.portfolio.orientation === 'vertical' ? ' vertical' : '';
  return `<div class="portfolio-map portfolio-index-board${orientation}">
    <div class="portfolio-map-head">
      <h3>${escape(title)}</h3>
      <div class="portfolio-axis-labels"><span>Mas barato</span><span>Base 100</span><span>Mas caro</span></div>
    </div>
    <div class="portfolio-scale-ruler" aria-hidden="true">
      <span style="left:${portfolioX(60).toFixed(2)}%">60</span>
      <span style="left:${portfolioX(80).toFixed(2)}%">80</span>
      <span style="left:${portfolioX(100).toFixed(2)}%">100</span>
      <span style="left:${portfolioX(120).toFixed(2)}%">120</span>
      <span style="left:${portfolioX(140).toFixed(2)}%">140</span>
      <span style="left:${portfolioX(160).toFixed(2)}%">160</span>
    </div>
    ${segments.map((segment) => {
      const base = segment.rows.find((row) => row.brand === row.benchmarkBrand);
      const sarubbiRows = segment.rows.filter((row) => portfolioOwner(row) === 'sarubbi');
      const compRows = segment.rows.filter((row) => portfolioOwner(row) !== 'sarubbi');
      const avgIndex = weightedAvg(sarubbiRows, (row) => row.index, (row) => row.n || 1);
      const targetRange = portfolioSegmentTargetRange(segment.rows);
      const statuses = sarubbiRows.map((row) => row.status?.key).filter(Boolean);
      const ok = statuses.filter((s) => s === 'ok').length;
      const below = statuses.filter((s) => s === 'below').length;
      const above = statuses.filter((s) => s === 'above').length;
      const statusKey = ok && ok === statuses.length ? 'ok' : (above ? 'above' : (below ? 'below' : 'missing'));
      const { display, hidden } = portfolioDisplayRows(segment.rows);
      return `<div class="portfolio-lane portfolio-index-lane" draggable="true" data-lane-key="${escape(segment.key)}">
        <div class="portfolio-lane-title">
          <button type="button" class="portfolio-lane-drag" draggable="true" aria-label="Mover ${escape(segment.label)}">::</button>
          <b>${escape(segment.label)}</b>
          <span>Base 100: ${escape(base?.brandLabel || display[0]?.benchmarkLabel || '-')}</span>
          <small>${sarubbiRows.length} Sarubbi / ${compRows.length} competencia</small>
        </div>
        <div class="portfolio-track">
          ${portfolioTargetBand(targetRange)}
          <i class="portfolio-grid g60"></i><i class="portfolio-grid g80"></i><i class="portfolio-grid g100"></i><i class="portfolio-grid g120"></i><i class="portfolio-grid g140"></i><i class="portfolio-grid g160"></i>
          <i class="portfolio-benchmark-line"></i>
          ${display.map(portfolioPoint).join('')}
          ${hidden ? `<span class="portfolio-hidden-count">+${hidden} en planilla</span>` : ''}
        </div>
        <div class="portfolio-row-metrics ${escape(statusKey)}">
          <b>${escape(portfolioIndexText(avgIndex))}</b>
          <span>Sarubbi prom.</span>
          <small>Obj. ${targetRange ? escape(strategyTargetLabel(targetRange)) : '-'}</small>
          <em>${ok} ok / ${below} bajo / ${above} sobre</em>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderPortfolioMiniTracks(rows, dateLabel) {
  return `<div class="portfolio-mini-grid">
    ${PORTFOLIO_CATEGORIES.map((category) => {
      const categoryRows = rows.filter((row) => row.category === category);
      const sarubbi = categoryRows.filter((row) => portfolioOwner(row) === 'sarubbi' && row.index != null);
      const avgIndex = weightedAvg(sarubbi, (row) => row.index, (row) => row.n || 1);
      const display = categoryRows
        .filter((row) => row.index != null)
        .sort((a, b) => (portfolioOwner(a) === portfolioOwner(b) ? 0 : portfolioOwner(a) === 'sarubbi' ? -1 : 1) || Math.abs((b.index || 0) - 100) - Math.abs((a.index || 0) - 100))
        .slice(0, 6);
      return `<button type="button" class="portfolio-mini ${state.portfolio.category === category ? 'active' : ''}" data-portfolio-category="${escape(category)}">
        <div class="portfolio-mini-head"><b>${escape(labelCategory(category))}</b><span>${avgIndex == null ? '-' : `${avgIndex.toFixed(0)}%`} Sarubbi</span></div>
        <div class="portfolio-mini-track">
          <i></i>
          ${display.map((row, i) => `<span class="${portfolioOwner(row)}" style="left:${portfolioPointX(row.index).toFixed(2)}%;top:${8 + (i % 2) * 25}px" title="${escape(row.brandLabel)} ${escape(portfolioIndexText(row.index))}">${brandLogo({ brand: row.brand, brandLabel: row.brandLabel, group: portfolioOwner(row) })}</span>`).join('')}
        </div>
      </button>`;
    }).join('')}
    <div class="portfolio-date-note">Corte: ${escape(dateLabel || 'vigente')}</div>
  </div>`;
}

function portfolioSummary(filteredRows) {
  const sarubbi = filteredRows.filter((row) => portfolioOwner(row) === 'sarubbi' && row.index != null);
  const comp = filteredRows.filter((row) => portfolioOwner(row) !== 'sarubbi');
  const sarubbiBrands = new Set(sarubbi.map((row) => row.brand));
  const compBrands = new Set(comp.map((row) => row.brand));
  const avgIndex = weightedAvg(sarubbi, (row) => row.index, (row) => row.n || 1);
  const statuses = sarubbi.map((row) => row.status?.key).filter(Boolean);
  const ok = statuses.filter((s) => s === 'ok').length;
  const above = statuses.filter((s) => s === 'above').length;
  const below = statuses.filter((s) => s === 'below').length;
  const benchmark = filteredRows.find((row) => row.brand === row.benchmarkBrand) || filteredRows.find((row) => portfolioOwner(row) !== 'sarubbi');
  return `<div class="portfolio-summary">
    <div><span>Indice Sarubbi</span><b>${avgIndex == null ? '-' : `${avgIndex.toFixed(0)}%`}</b><small>${sarubbiBrands.size} marcas / ${sarubbi.length} posiciones Sarubbi; ${compBrands.size} comp.</small></div>
    <div><span>Referencia 100</span><b>${escape(benchmark?.brandLabel || '-')}</b><small>${benchmark ? fmtPerLiter(benchmark.ppl) : 'Sin benchmark'}</small></div>
    <div><span>Objetivo</span><b>${ok}/${statuses.length || 0}</b><small>${above} sobre / ${below} debajo</small></div>
    <div><span>Fuente</span><b>${escape(state.strategy?.source || 'Marketing Sarubbi')}</b><small>Rubro, gama y presentacion equivalentes</small></div>
  </div>`;
}

function portfolioStatusOptions(rows) {
  const order = ['ok', 'below', 'above', 'missing', 'competencia'];
  const keys = new Set(rows.map(portfolioStatusKey));
  return order
    .filter((key) => keys.has(key))
    .map((key) => ({ value: key, label: portfolioStatusLabel(key) }));
}

function portfolioRawFilteredRows(rows) {
  const qn = state.portfolio.rawQ || '';
  return rows.filter((row) => {
    const owner = portfolioOwner(row);
    const statusKey = portfolioStatusKey(row);
    if (state.portfolio.rawOwner && owner !== state.portfolio.rawOwner) return false;
    if (state.portfolio.rawStatus && statusKey !== state.portfolio.rawStatus) return false;
    if (state.portfolio.rawBenchmark && row.benchmarkBrand !== state.portfolio.rawBenchmark) return false;
    if (qn && !textMatchesQuery(`${labelCategory(row.category)} ${row.segmentLabel} ${row.brandLabel} ${labelOwner(owner)} ${row.benchmarkLabel || ''} ${portfolioIndexText(row.index)} ${fmtPerLiter(row.ppl)}`, qn)) return false;
    return true;
  });
}

function renderPortfolioTable(rows) {
  const ownerOptions = ['sarubbi', 'competencia']
    .filter((owner) => rows.some((row) => portfolioOwner(row) === owner))
    .map((owner) => ({ value: owner, label: labelOwner(owner) }));
  const statusOptions = portfolioStatusOptions(rows);
  const benchmarkOptions = uniqueOptions(rows, (row) => row.benchmarkBrand, (_, row) => row.benchmarkLabel || row.benchmarkBrand);
  state.portfolio.rawOwner = validSelectValue(ownerOptions, state.portfolio.rawOwner);
  state.portfolio.rawStatus = validSelectValue(statusOptions, state.portfolio.rawStatus);
  state.portfolio.rawBenchmark = validSelectValue(benchmarkOptions, state.portfolio.rawBenchmark);
  const filtered = portfolioRawFilteredRows(rows);
  const sorted = filtered.slice().sort((a, b) =>
    labelCategory(a.category).localeCompare(labelCategory(b.category), 'es') ||
    a.segmentLabel.localeCompare(b.segmentLabel, 'es') ||
    (portfolioOwner(a) === portfolioOwner(b) ? 0 : portfolioOwner(a) === 'sarubbi' ? -1 : 1) ||
    (b.index || 0) - (a.index || 0));
  return `<div class="portfolio-sheet-wrap">
  <table class="compact-table sheet-table portfolio-raw-table">
    <thead><tr>
      <th><span class="th-title">Rubro</span></th>
      <th><span class="th-title">${escape(portfolioSegmentColumnLabel(state.portfolio.category))}</span></th>
      <th><span class="th-title">Marca</span><input id="portfolioRawQ" class="th-filter" value="${escape(state.portfolio.rawQ)}" placeholder="Filtrar" /></th>
      <th><span class="th-title">Dueno</span>${filterSelectHtml('portfolioRawOwner', 'Todos', ownerOptions, state.portfolio.rawOwner)}</th>
      <th class="price"><span class="th-title">normalizado</span></th>
      <th><span class="th-title">Base 100</span>${filterSelectHtml('portfolioRawBenchmark', 'Todas', benchmarkOptions, state.portfolio.rawBenchmark)}</th>
      <th class="price"><span class="th-title">Price index</span></th>
      <th><span class="th-title">Objetivo</span>${filterSelectHtml('portfolioRawStatus', 'Todos', statusOptions, state.portfolio.rawStatus)}</th>
    </tr></thead>
    <tbody>${sorted.map((row) => {
      const owner = portfolioOwner(row);
      const statusKey = portfolioStatusKey(row);
      return `<tr>
        <td>${escape(labelCategory(row.category))}</td>
        <td><b>${escape(row.segmentLabel)}</b><br><span class="table-sub">${row.n || 0} obs.${row.skuCount ? ` / ${row.skuCount} SKUs` : ''}</span></td>
        <td><b>${escape(row.brandLabel)}</b><br><span class="table-sub">${escape(row.brand)}</span></td>
        <td>${portfolioOwnerPill(owner)}</td>
        <td class="price">${fmtPerLiter(row.ppl)}</td>
        <td>${escape(row.benchmarkLabel || '-')}</td>
        <td class="price"><b>${escape(portfolioIndexText(row.index))}</b><div class="portfolio-index-mini"><i style="--x:${portfolioX(row.index).toFixed(2)}%"></i></div></td>
        <td>${owner === 'sarubbi' ? `${strategyBadge(row.index, row.targetRange)}<span class="table-sub">Meta ${strategyTargetLabel(row.targetRange)}</span>` : `<span class="table-sub">${escape(portfolioStatusLabel(statusKey))}</span>`}</td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" class="empty compact">Sin datos para el filtro.</td></tr>'}</tbody>
  </table>
  </div>`;
}

function portfolioSelectedAggregates(rows) {
  const selected = portfolioSelectedKeys();
  if (!selected.size) return [];
  return rows.filter((row) => selected.has(portfolioPinKey(row)));
}

function portfolioSelectionStoreOptions(aggregates) {
  const stores = new Map();
  for (const agg of aggregates) {
    for (const row of agg.rows || []) {
      for (const store of row.modeStoreKeys || []) {
        stores.set(store, labelStore(store));
      }
    }
  }
  return [...stores.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

function portfolioSelectionBucketKey(row) {
  return String(row.bucket?.value ?? row.sizeLabel ?? row.label);
}

function portfolioSelectionBucketOptions(aggregates) {
  const buckets = new Map();
  for (const agg of aggregates) {
    for (const row of agg.rows || []) {
      const value = portfolioSelectionBucketKey(row);
      const label = row.bucket?.label || row.sizeLabel || value;
      const sort = Number(row.bucket?.value ?? row.unitMl ?? 0);
      if (!buckets.has(value)) buckets.set(value, { value, label, sort });
    }
  }
  return [...buckets.values()].sort((a, b) => (a.sort - b.sort) || a.label.localeCompare(b.label, 'es'));
}

function portfolioSelectionSkuRows(aggregates, { ignoreStores = false, ignoreBuckets = false } = {}) {
  const storeFilter = new Set(state.portfolio.selectedStores || []);
  const bucketFilter = new Set(state.portfolio.selectedBuckets || []);
  const qn = state.portfolio.selectionQ || '';
  return aggregates.flatMap((agg) => (agg.rows || []).map((row) => {
    const index = agg.benchmarkPpl ? row.modePricePerLiter / agg.benchmarkPpl * 100 : null;
    return {
      agg,
      row,
      index,
      stores: row.modeStoreKeys || [],
      storeLabels: row.modeStores || [],
      bucketKey: portfolioSelectionBucketKey(row),
    };
  })).filter((entry) => {
    if (!ignoreStores && storeFilter.size && !entry.stores.some((store) => storeFilter.has(store))) return false;
    if (!ignoreBuckets && bucketFilter.size && !bucketFilter.has(entry.bucketKey)) return false;
    if (qn && !textMatchesQuery(`${entry.row.label} ${entry.row.brandLabel} ${entry.row.segment.label} ${entry.row.sizeLabel} ${entry.storeLabels.join(' ')} ${fmtPrice(entry.row.modePrice)} ${fmtPerLiter(entry.row.modePricePerLiter)}`, qn)) return false;
    return true;
  }).sort((a, b) =>
    a.row.segment.label.localeCompare(b.row.segment.label, 'es') ||
    a.row.brandLabel.localeCompare(b.row.brandLabel, 'es') ||
    a.row.bucket.value - b.row.bucket.value ||
    a.row.label.localeCompare(b.row.label, 'es'));
}

function renderPortfolioSelectionPanel(currentRows) {
  const aggregates = portfolioSelectedAggregates(currentRows);
  if (!state.portfolio.selectedPins.length) {
    return `<div class="portfolio-section portfolio-selection empty-selection">
      <div class="portfolio-section-head">
        <h3>Seleccion del grafico</h3>
        <p>Click en uno o varios pines para ver que SKUs, cadenas y precios explican su posicion.</p>
      </div>
    </div>`;
  }
  const selectedKeys = new Set(aggregates.map(portfolioPinKey));
  if (state.portfolio.selectedPins.some((key) => !selectedKeys.has(key))) {
    state.portfolio.selectedPins = state.portfolio.selectedPins.filter((key) => selectedKeys.has(key));
  }
  const storeOptions = portfolioSelectionStoreOptions(aggregates);
  const bucketOptions = portfolioSelectionBucketOptions(aggregates);
  state.portfolio.selectedStores = (state.portfolio.selectedStores || []).filter((store) => storeOptions.some((option) => option.value === store));
  state.portfolio.selectedBuckets = (state.portfolio.selectedBuckets || []).filter((bucket) => bucketOptions.some((option) => option.value === bucket));
  const skuRows = portfolioSelectionSkuRows(aggregates);
  const skuRowsAllStores = portfolioSelectionSkuRows(aggregates, { ignoreStores: true });
  const skuRowsAllBuckets = portfolioSelectionSkuRows(aggregates, { ignoreBuckets: true });
  const avgIndex = weightedAvg(aggregates.filter((row) => portfolioOwner(row) === 'sarubbi'), (row) => row.index, (row) => row.n || 1);
  const avgPpl = weightedAvg(aggregates, (row) => row.ppl, (row) => row.n || 1);
  const sarubbiCount = aggregates.filter((row) => portfolioOwner(row) === 'sarubbi').length;
  const compCount = aggregates.length - sarubbiCount;
  const chips = aggregates.map((row) => {
    const key = portfolioPinKey(row);
    return `<button type="button" class="portfolio-selected-chip ${escape(portfolioOwner(row))}" data-remove-pin="${escape(key)}">
      ${brandLogo({ brand: row.brand, brandLabel: row.brandLabel, group: portfolioOwner(row) })}
      <span>${escape(row.brandLabel)}  -  ${escape(row.segmentLabel)}</span>
      <b>${escape(portfolioIndexText(row.index))}</b>
      <i aria-hidden="true">x</i>
    </button>`;
  }).join('');
  const storeChips = `<button type="button" class="mode-chip ${state.portfolio.selectedStores.length ? '' : 'active'}" data-selection-store="">Todas <span>${skuRowsAllStores.length}</span></button>` +
    storeOptions.map((option) => {
      const active = state.portfolio.selectedStores.includes(option.value) ? ' active' : '';
      const count = skuRowsAllStores.filter((entry) => entry.stores.includes(option.value)).length;
      return `<button type="button" class="mode-chip${active}" data-selection-store="${escape(option.value)}">${escape(option.label)} <span>${count}</span></button>`;
    }).join('');
  const bucketChips = `<button type="button" class="mode-chip ${state.portfolio.selectedBuckets.length ? '' : 'active'}" data-selection-bucket="">Todos presentacions <span>${skuRowsAllBuckets.length}</span></button>` +
    bucketOptions.map((option) => {
      const active = state.portfolio.selectedBuckets.includes(option.value) ? ' active' : '';
      const count = skuRowsAllBuckets.filter((entry) => entry.bucketKey === option.value).length;
      return `<button type="button" class="mode-chip${active}" data-selection-bucket="${escape(option.value)}">${escape(option.label)} <span>${count}</span></button>`;
    }).join('');
  return `<div class="portfolio-section portfolio-selection">
    <div class="portfolio-section-head">
      <div>
        <h3>Seleccion del grafico</h3>
        <p>${aggregates.length} pines seleccionados: ${sarubbiCount} Sarubbi / ${compCount} competencia. La planilla muestra los SKUs que sostienen cada punto.</p>
      </div>
      <button type="button" class="btn" id="portfolioClearSelection">Limpiar</button>
    </div>
    <div class="portfolio-selected-chips">${chips}</div>
    <div class="portfolio-selection-kpis">
      <div><span>Indice Sarubbi seleccionado</span><b>${avgIndex == null ? '-' : `${avgIndex.toFixed(0)}%`}</b></div>
      <div><span>Promedio seleccionado</span><b>${fmtPerLiter(avgPpl)}</b></div>
      <div><span>SKUs visibles</span><b>${skuRows.length}</b></div>
    </div>
    <div class="portfolio-selection-filters">
      <input id="portfolioSelectionQ" value="${escape(state.portfolio.selectionQ)}" placeholder="Filtrar SKU, marca, presentacion o cadena" autocomplete="off" />
      <div>
        <div class="portfolio-filter-label">Presentacions</div>
        <div class="mode-chip-row">${bucketChips}</div>
        <div class="portfolio-filter-label">Cadenas</div>
        <div class="mode-chip-row">${storeChips}</div>
      </div>
    </div>
    <div class="portfolio-sheet-wrap">
      <table class="compact-table sheet-table portfolio-selection-table">
        <thead><tr>
          <th>SKU</th>
          <th>Marca</th>
          <th>${escape(portfolioSegmentColumnLabel(state.portfolio.category))} / presentacion</th>
          <th>Cadenas moda</th>
          <th class="price">Moda</th>
          <th class="price">normalizado</th>
          <th class="price">Index</th>
          <th class="price">Rango</th>
        </tr></thead>
        <tbody>${skuRows.map((entry) => {
          const row = entry.row;
          const storeText = entry.storeLabels.join(', ');
          return `<tr>
            <td>${productLinkCell(row.sample, `<br><span class="table-sub">${row.count} registros  -  moda ${row.modeCount}/${row.count} (${row.modeShare.toFixed(0)}%)</span>`, row.label)}</td>
            <td><b>${escape(row.brandLabel)}</b><br>${portfolioOwnerPill(row.group)}</td>
            <td>${escape(row.segment.label)}<br><span class="table-sub">${escape(row.sizeLabel)}${row.packUnits > 1 ? `  -  pack x${row.packUnits}` : ''}</span></td>
            <td><span class="sheet-muted">${escape(storeText || '-')}</span></td>
            <td class="price">${fmtPrice(row.modePrice)}</td>
            <td class="price">${fmtPerLiter(row.modePricePerLiter)}</td>
            <td class="price"><b>${escape(portfolioIndexText(entry.index))}</b><br><span class="table-sub">base ${escape(entry.agg.benchmarkLabel || '-')}</span></td>
            <td class="price">${fmtPrice(row.min)} - ${fmtPrice(row.max)}</td>
          </tr>`;
        }).join('') || '<tr><td colspan="8" class="empty compact">Sin SKUs para la seleccion y filtros aplicados.</td></tr>'}</tbody>
      </table>
    </div>
  </div>`;
}

function renderPortfolioDetail(category, segmentKey, brand) {
  const allRows = strategyComparableRows().filter((entry) => {
    if (entry.row.category !== category) return false;
    if (segmentKey && entry.row.segment.key !== segmentKey) return false;
    if (brand && entry.row.brand !== brand) return false;
    return true;
  });
  const statusOptions = ['ok', 'below', 'above', 'missing']
    .filter((key) => allRows.some((entry) => strategyStatus(entry.index, entry.targetRange).key === key))
    .map((key) => ({ value: key, label: portfolioStatusLabel(key) }));
  const bucketOptions = uniqueOptions(allRows, (entry) => String(entry.row.bucket.value), (_, entry) => entry.row.bucket.label);
  state.portfolio.detailStatus = validSelectValue(statusOptions, state.portfolio.detailStatus);
  state.portfolio.detailBucket = validSelectValue(bucketOptions, state.portfolio.detailBucket);
  const qn = state.portfolio.detailQ || '';
  const rows = allRows.filter((entry) => {
    const statusKey = strategyStatus(entry.index, entry.targetRange).key;
    if (state.portfolio.detailStatus && statusKey !== state.portfolio.detailStatus) return false;
    if (state.portfolio.detailBucket && String(entry.row.bucket.value) !== state.portfolio.detailBucket) return false;
    const refBrands = [...new Set(entry.benchmarkRows.map((row) => labelBrand(row)))].join(' ');
    if (qn && !textMatchesQuery(`${entry.row.brandLabel} ${entry.row.label} ${entry.row.segment.label} ${entry.row.bucket.label} ${refBrands} ${portfolioIndexText(entry.index)} ${fmtPerLiter(entry.row.modePricePerLiter)} ${fmtPerLiter(entry.benchmarkPpl)}`, qn)) return false;
    return true;
  }).sort((a, b) =>
    a.row.segment.label.localeCompare(b.row.segment.label, 'es') ||
    a.row.brandLabel.localeCompare(b.row.brandLabel, 'es') ||
    a.row.bucket.value - b.row.bucket.value);
  return `<div class="portfolio-sheet-wrap">
  <table class="compact-table sheet-table portfolio-detail-table">
    <thead><tr>
      <th><span class="th-title">Marca Sarubbi</span><input id="portfolioDetailQ" class="th-filter" value="${escape(state.portfolio.detailQ)}" placeholder="Filtrar" /></th>
      <th><span class="th-title">${escape(portfolioSegmentColumnLabel(category))} / presentacion</span>${filterSelectHtml('portfolioDetailBucket', 'Todos', bucketOptions, state.portfolio.detailBucket)}</th>
      <th><span class="th-title">Referencia usada</span></th>
      <th class="price"><span class="th-title">Sarubbi normalizado</span></th>
      <th class="price"><span class="th-title">Ref. normalizado</span></th>
      <th class="price"><span class="th-title">Index</span></th>
      <th><span class="th-title">Estado</span>${filterSelectHtml('portfolioDetailStatus', 'Todos', statusOptions, state.portfolio.detailStatus)}</th>
    </tr></thead>
    <tbody>${rows.map((entry) => {
      const refBrands = [...new Set(entry.benchmarkRows.map((row) => labelBrand(row)))].slice(0, 4);
      const moreRefs = Math.max(0, new Set(entry.benchmarkRows.map((row) => labelBrand(row))).size - refBrands.length);
      return `<tr>
      <td><b>${escape(entry.row.brandLabel)}</b><br><span class="table-sub">${escape(entry.row.label)}</span></td>
      <td>${escape(entry.row.segment.label)}<br><span class="table-sub">${escape(entry.row.bucket.label)}</span></td>
      <td><b>${escape(refBrands.join(', ') || 'Sin base')}</b>${moreRefs ? ` <span class="table-sub">+${moreRefs}</span>` : ''}<br><span class="table-sub">${entry.benchmarkRows.length} obs. equivalentes</span></td>
      <td class="price">${fmtPerLiter(entry.row.modePricePerLiter)}</td>
      <td class="price">${fmtPerLiter(entry.benchmarkPpl)}</td>
      <td class="price"><b>${escape(portfolioIndexText(entry.index))}</b><div class="portfolio-index-mini"><i style="--x:${portfolioX(entry.index).toFixed(2)}%"></i></div></td>
      <td>${strategyBadge(entry.index, entry.targetRange)}<span class="table-sub">Meta ${strategyTargetLabel(entry.targetRange)}</span></td>
    </tr>`;
    }).join('') || '<tr><td colspan="7" class="empty compact">Sin SKUs Sarubbi con benchmark equivalente para este filtro.</td></tr>'}</tbody>
  </table>
  </div>`;
}

function renderPortfolio() {
  const root = $('#portfolioContent');
  if (!root) return;
  if (!state.items.length) {
    root.innerHTML = '<div class="empty">Sin datos.</div>';
    return;
  }

  const date = portfolioActiveDate();
  const dates = portfolioDates();
  const dateIndex = date ? dates.indexOf(date) : -1;
  const sourceRows = portfolioApplyIndex(portfolioMarketRowsForDate(date));
  const currentRows = portfolioApplyIndex(portfolioCurrentRows());
  const category = state.portfolio.category || PORTFOLIO_CATEGORIES[0] || 'jamon_cocido';
  const segmentOptions = portfolioSegmentOptions(currentRows, category);
  if (state.portfolio.segment && !segmentOptions.some((row) => row.key === state.portfolio.segment)) state.portfolio.segment = '';
  const brandOptions = portfolioBrandOptions(currentRows, category, state.portfolio.segment);
  if (state.portfolio.brand && !brandOptions.some((row) => row.brand === state.portfolio.brand)) state.portfolio.brand = '';

  const filteredRows = portfolioFilterRows(sourceRows);
  const detailedSegment = state.portfolio.brand
    ? (currentRows.find((row) => row.brand === state.portfolio.brand && row.category === category)?.segmentKey || state.portfolio.segment)
    : state.portfolio.segment;
  const dateLabel = date ? new Date(date).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }) : 'ultimo dato';
  const maxDateIndex = Math.max(0, dates.length - 1);

  root.innerHTML = `
    <div class="portfolio-shell">
      <div class="portfolio-hero">
        <div>
          <h2>Portafolio Sarubbi</h2>
          <p>Lectura de price index por rubro Sarubbi. Cada marca se compara contra competencia de la misma categoria y presentacion comparable.</p>
        </div>
        <div class="portfolio-source-box">
          <span>Fuente estrategia</span>
          <b>${escape(state.strategy?.version || '2026')}</b>
          <small>${escape(state.strategy?.source || 'Marketing Sarubbi Uruguay')}</small>
        </div>
      </div>

      <div class="portfolio-toolbar">
        <div class="portfolio-chip-row">
          ${PORTFOLIO_CATEGORIES.map((cat) => `<button type="button" class="mode-chip ${cat === category ? 'active' : ''}" data-portfolio-category="${escape(cat)}">${escape(labelCategory(cat))}</button>`).join('')}
        </div>
        <select id="portfolioSegment">
          <option value="">${escape(portfolioAllSegmentsLabel(category))}</option>
          ${segmentOptions.map((option) => `<option value="${escape(option.key)}" ${state.portfolio.segment === option.key ? 'selected' : ''}>${escape(option.label)}</option>`).join('')}
        </select>
        <select id="portfolioBrand">
          <option value="">Todas las marcas Sarubbi</option>
          ${brandOptions.map((option) => `<option value="${escape(option.brand)}" ${state.portfolio.brand === option.brand ? 'selected' : ''}>${escape(option.label)}</option>`).join('')}
        </select>
        <div class="portfolio-time-control">
          <button type="button" class="btn" id="portfolioPlay" ${dates.length < 2 ? 'disabled' : ''}>Animar</button>
          <button type="button" class="btn" id="portfolioOrientation">${state.portfolio.orientation === 'vertical' ? 'Horizontal' : 'Vertical'}</button>
          <input type="range" id="portfolioDate" min="0" max="${maxDateIndex}" value="${Math.max(0, dateIndex)}" ${dates.length < 2 ? 'disabled' : ''} />
          <span>${escape(dateLabel)}</span>
        </div>
      </div>

      ${portfolioSummary(filteredRows)}
      ${renderPortfolioMap(filteredRows, `${labelCategory(category)} / ${state.portfolio.brand ? labelBrand({ brand: state.portfolio.brand, brandLabel: brandOptions.find((b) => b.brand === state.portfolio.brand)?.label }) : state.portfolio.segment ? segmentOptions.find((s) => s.key === state.portfolio.segment)?.label || portfolioSegmentKind(category) : portfolioAllSegmentsLabel(category).toLowerCase()}`)}
      ${renderPortfolioSelectionPanel(currentRows)}

      <div class="portfolio-section">
        <div class="portfolio-section-head">
          <h3>Timeline por rubro</h3>
          <p>Move el corte historico y los logos cambian de posicion segun su price index de ese relevamiento.</p>
        </div>
        ${renderPortfolioMiniTracks(sourceRows, dateLabel)}
      </div>

      <div class="portfolio-data-stack">
        <div class="portfolio-section">
          <div class="portfolio-section-head"><h3>Datos en bruto</h3><p>Planilla agregada por marca y ${escape(portfolioSegmentKind(category))}. Filtra por texto, dueno, benchmark o estado para auditar el indice.</p></div>
          ${renderPortfolioTable(filteredRows)}
        </div>
        <div class="portfolio-section">
          <div class="portfolio-section-head"><h3>Detalle por presentacion</h3><p>Referencia usada para el price index. La base 100 se toma de la marca benchmark definida para cada categoria Sarubbi.</p></div>
          ${renderPortfolioDetail(category, detailedSegment, state.portfolio.brand)}
        </div>
      </div>
    </div>`;

  root.querySelectorAll('[data-portfolio-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.portfolio.category = btn.dataset.portfolioCategory || PORTFOLIO_CATEGORIES[0] || 'jamon_cocido';
      state.portfolio.segment = '';
      state.portfolio.brand = '';
      state.portfolio.selectedPins = [];
      state.portfolio.selectedStores = [];
      state.portfolio.selectedBuckets = [];
      state.portfolio.selectionQ = '';
      renderPortfolio();
    });
  });
  $('#portfolioSegment')?.addEventListener('change', (e) => {
    state.portfolio.segment = e.target.value;
    state.portfolio.brand = '';
    renderPortfolio();
  });
  $('#portfolioBrand')?.addEventListener('change', (e) => {
    state.portfolio.brand = e.target.value;
    const selected = currentRows.find((row) => row.category === state.portfolio.category && row.brand === state.portfolio.brand && portfolioOwner(row) === 'sarubbi');
    if (selected) state.portfolio.segment = selected.segmentKey;
    renderPortfolio();
  });
  $('#portfolioDate')?.addEventListener('input', (e) => {
    const nextDate = dates[Number(e.target.value)] || dates[dates.length - 1] || '';
    state.portfolio.date = nextDate;
    renderPortfolio();
  });
  $('#portfolioPlay')?.addEventListener('click', () => {
    if (dates.length < 2) return;
    let i = Math.max(0, dates.indexOf(state.portfolio.date));
    const tick = () => {
      i = (i + 1) % dates.length;
      state.portfolio.date = dates[i];
      renderPortfolio();
      if (i !== dates.length - 1) setTimeout(tick, 700);
    };
    tick();
  });
  $('#portfolioOrientation')?.addEventListener('click', () => {
    state.portfolio.orientation = state.portfolio.orientation === 'vertical' ? 'horizontal' : 'vertical';
    renderPortfolio();
  });
  bindPortfolioFilterInput(root, 'portfolioRawQ', 'rawQ');
  bindPortfolioFilterSelect(root, 'portfolioRawOwner', 'rawOwner');
  bindPortfolioFilterSelect(root, 'portfolioRawStatus', 'rawStatus');
  bindPortfolioFilterSelect(root, 'portfolioRawBenchmark', 'rawBenchmark');
  bindPortfolioFilterInput(root, 'portfolioDetailQ', 'detailQ');
  bindPortfolioFilterSelect(root, 'portfolioDetailStatus', 'detailStatus');
  bindPortfolioFilterSelect(root, 'portfolioDetailBucket', 'detailBucket');
  bindPortfolioPins(root);
  bindPortfolioLanes(root);
  bindPortfolioSelection(root);
  bindProductLinks(root);
  applyClientCopy(root);
}

function setPortfolioPinTop(pin) {
  const key = pin.dataset.pinKey;
  if (!key) return;
  const currentZ = Number(getComputedStyle(pin).zIndex) || 0;
  state.portfolio.pinZ = Math.max(state.portfolio.pinZ || 40, currentZ) + 1;
  state.portfolio.pinOrder[key] = state.portfolio.pinZ;
  pin.style.setProperty('--z', state.portfolio.pinZ);
  pin.classList.add('selected');
}

function activatePortfolioPin(pin) {
  const key = pin.dataset.pinKey;
  if (!key) return;
  setPortfolioPinTop(pin);
  if (!state.portfolio.selectedPins.includes(key)) state.portfolio.selectedPins.push(key);
  renderPortfolio();
}

function bindPortfolioPins(root) {
  root.querySelectorAll('.portfolio-point').forEach((pin) => {
    pin.addEventListener('click', () => activatePortfolioPin(pin));
    pin.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      activatePortfolioPin(pin);
    });
  });
}

function bindPortfolioLanes(root) {
  let draggedKey = '';
  root.querySelectorAll('.portfolio-lane[draggable="true"]').forEach((lane) => {
    lane.addEventListener('dragstart', (e) => {
      const dragSurface = e.target.closest('.portfolio-lane-drag, .portfolio-lane-title');
      if (!dragSurface || e.target.closest('.portfolio-point')) {
        e.preventDefault();
        return;
      }
      draggedKey = lane.dataset.laneKey || '';
      if (!draggedKey) {
        e.preventDefault();
        return;
      }
      lane.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedKey);
    });
    lane.addEventListener('dragend', () => {
      draggedKey = '';
      root.querySelectorAll('.portfolio-lane').forEach((el) => el.classList.remove('dragging', 'drop-before', 'drop-after'));
    });
    lane.addEventListener('dragover', (e) => {
      if (!draggedKey || draggedKey === lane.dataset.laneKey) return;
      e.preventDefault();
      const rect = lane.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      lane.classList.toggle('drop-before', before);
      lane.classList.toggle('drop-after', !before);
      e.dataTransfer.dropEffect = 'move';
    });
    lane.addEventListener('dragleave', () => lane.classList.remove('drop-before', 'drop-after'));
    lane.addEventListener('drop', (e) => {
      e.preventDefault();
      const source = e.dataTransfer.getData('text/plain') || draggedKey;
      const target = lane.dataset.laneKey || '';
      if (!source || !target || source === target) return;
      const keys = root.querySelectorAll('.portfolio-lane[draggable="true"]');
      const current = Array.from(keys).map((el) => el.dataset.laneKey).filter(Boolean);
      const next = current.filter((key) => key !== source);
      const targetIndex = next.indexOf(target);
      const rect = lane.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      next.splice(before ? targetIndex : targetIndex + 1, 0, source);
      state.portfolio.laneOrder[portfolioLaneOrderKey(state.portfolio.category)] = next;
      savePortfolioPrefs();
      renderPortfolio();
    });
  });
}

function bindPortfolioSelection(root) {
  root.querySelector('#portfolioClearSelection')?.addEventListener('click', () => {
    state.portfolio.selectedPins = [];
    state.portfolio.selectedStores = [];
    state.portfolio.selectedBuckets = [];
    state.portfolio.selectionQ = '';
    renderPortfolio();
  });
  root.querySelectorAll('[data-remove-pin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.removePin;
      state.portfolio.selectedPins = state.portfolio.selectedPins.filter((pin) => pin !== key);
      if (!state.portfolio.selectedPins.length) {
        state.portfolio.selectedStores = [];
        state.portfolio.selectedBuckets = [];
        state.portfolio.selectionQ = '';
      }
      renderPortfolio();
    });
  });
  root.querySelector('#portfolioSelectionQ')?.addEventListener('input', (e) => {
    state.portfolio.selectionQ = e.target.value;
    renderPortfolio();
    const next = document.querySelector('#portfolioSelectionQ');
    if (next) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  });
  root.querySelectorAll('[data-selection-store]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const store = btn.dataset.selectionStore;
      if (!store) state.portfolio.selectedStores = [];
      else if (state.portfolio.selectedStores.includes(store)) {
        state.portfolio.selectedStores = state.portfolio.selectedStores.filter((item) => item !== store);
      } else {
        state.portfolio.selectedStores.push(store);
      }
      renderPortfolio();
    });
  });
  root.querySelectorAll('[data-selection-bucket]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bucket = btn.dataset.selectionBucket;
      if (!bucket) state.portfolio.selectedBuckets = [];
      else if (state.portfolio.selectedBuckets.includes(bucket)) {
        state.portfolio.selectedBuckets = state.portfolio.selectedBuckets.filter((item) => item !== bucket);
      } else {
        state.portfolio.selectedBuckets.push(bucket);
      }
      renderPortfolio();
    });
  });
}

function bindPortfolioFilterInput(root, id, key) {
  const el = root.querySelector(`#${id}`);
  if (!el) return;
  el.addEventListener('input', (e) => {
    state.portfolio[key] = e.target.value;
    renderPortfolio();
    const next = root.querySelector(`#${id}`);
    if (next) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  });
}

function bindPortfolioFilterSelect(root, id, key) {
  const el = root.querySelector(`#${id}`);
  if (!el) return;
  el.addEventListener('change', (e) => {
    state.portfolio[key] = e.target.value;
    renderPortfolio();
  });
}

function strategyComparableRows() {
  const rows = skuModeRows().filter((row) => row.modePricePerLiter != null && row.bucket);
  const byFormat = new Map();
  for (const row of rows) {
    const key = `${row.category}|${row.segment.key}|${row.bucket.value}`;
    const group = byFormat.get(key) || [];
    group.push(row);
    byFormat.set(key, group);
  }

  return rows.filter((row) => row.group === 'sarubbi').map((row) => {
    const formatRows = byFormat.get(`${row.category}|${row.segment.key}|${row.bucket.value}`) || [];
    const competitors = formatRows.filter((entry) => entry.group === 'competencia');
    const rule = strategyRule(row.segment.key);
    const benchmarkBrand = indexBenchmarkBrandForSegment(row.segment.key);
    const benchmarkSegment = indexBenchmarkSegmentForSegment(row.segment.key);
    const benchmarkFormatRows = byFormat.get(`${row.category}|${benchmarkSegment}|${row.bucket.value}`) || [];
    let benchmarkRows = benchmarkFormatRows.filter((entry) => entry.brand === benchmarkBrand);
    if (!benchmarkRows.length) {
      benchmarkRows = rows.filter((entry) => entry.category === row.category && entry.bucket?.value === row.bucket.value && entry.brand === benchmarkBrand);
    }
    if (!benchmarkRows.length && rule?.competitorBrands?.length) {
      benchmarkRows = competitors.filter((entry) => rule.competitorBrands.includes(entry.brand));
    }
    if (!benchmarkRows.length) benchmarkRows = competitors;
    const benchmarkPpl = weightedAvg(benchmarkRows, (entry) => entry.modePricePerLiter, (entry) => entry.modeCount);
    const index = benchmarkPpl ? row.modePricePerLiter / benchmarkPpl * 100 : null;
    const targetRange = strategyTargetRange(row.segment.key, row.brand);
    const status = strategyStatus(index, targetRange);
    const delta = status.delta == null ? null : status.delta;
    return {
      row,
      rule,
      benchmarkBrand,
      benchmarkRows,
      benchmarkPpl,
      index,
      targetRange,
      status,
      delta,
    };
  });
}

function strategyStatusRank(key) {
  return { above: 0, below: 1, missing: 2, ok: 3 }[key] ?? 4;
}

function strategyFilterRows(rows) {
  return rows.filter((entry) => {
    const f = state.strategyFilters;
    if (f.category && entry.row.category !== f.category) return false;
    if (f.status && entry.status.key !== f.status) return false;
    return true;
  }).sort((a, b) =>
    strategyStatusRank(a.status.key) - strategyStatusRank(b.status.key) ||
    Math.abs(b.delta || 0) - Math.abs(a.delta || 0) ||
    labelCategory(a.row.category).localeCompare(labelCategory(b.row.category), 'es') ||
    a.row.segment.label.localeCompare(b.row.segment.label, 'es') ||
    a.row.brandLabel.localeCompare(b.row.brandLabel, 'es') ||
    a.row.bucket.value - b.row.bucket.value);
}

function renderStrategyChips(rows) {
  const categories = values(rows.map((entry) => entry.row), 'category');
  const categoryChips = `<button type="button" class="mode-chip ${state.strategyFilters.category ? '' : 'active'}" data-strategy-category="">Todos <span>${rows.length}</span></button>` +
    categories.map((category) => {
      const count = rows.filter((entry) => entry.row.category === category).length;
      const active = state.strategyFilters.category === category ? ' active' : '';
      return `<button type="button" class="mode-chip${active}" data-strategy-category="${escape(category)}">${escape(labelCategory(category))} <span>${count}</span></button>`;
    }).join('');
  const statusOptions = [
    ['', 'Todos'],
    ['above', 'Sobre objetivo'],
    ['below', 'Debajo objetivo'],
    ['ok', 'En objetivo'],
    ['missing', 'Sin base'],
  ];
  const statusChips = statusOptions.map(([key, label]) => {
    const count = key ? rows.filter((entry) => entry.status.key === key).length : rows.length;
    const active = state.strategyFilters.status === key ? ' active' : '';
    return `<button type="button" class="mode-chip${active}" data-strategy-status="${escape(key)}">${escape(label)} <span>${count}</span></button>`;
  }).join('');
  return `
    <div class="mode-toolbar strategy-toolbar">
      <div class="mode-filter-block">
        <div class="mode-filter-label">Rubro</div>
        <div class="mode-chip-row">${categoryChips}</div>
      </div>
      <div class="mode-filter-block wide">
        <div class="mode-filter-label">Estado estrategia</div>
        <div class="mode-chip-row">${statusChips}</div>
      </div>
    </div>`;
}

function strategyIndexBar(entry) {
  if (entry.index == null) return '<span class="mode-index-empty">Sin base equivalente</span>';
  const max = Math.max(140, entry.index, entry.targetRange[1], 100) + 10;
  const indexLeft = Math.min(100, entry.index / max * 100);
  const minLeft = Math.min(100, entry.targetRange[0] / max * 100);
  const maxLeft = Math.min(100, entry.targetRange[1] / max * 100);
  return `<div class="strategy-index">
    <div class="strategy-index-head"><b>${entry.index.toFixed(0)}%</b><span>obj ${strategyTargetLabel(entry.targetRange)}</span></div>
    <div class="strategy-track" style="--index-left:${indexLeft.toFixed(2)}%;--min-left:${minLeft.toFixed(2)}%;--max-left:${maxLeft.toFixed(2)}%">
      <i class="strategy-range"></i><i class="strategy-dot"></i>
    </div>
  </div>`;
}

function renderStrategy() {
  const root = $('#strategyContent');
  if (!root) return;
  if (!state.items.length) {
    root.innerHTML = '<div class="empty">Sin datos.</div>';
    return;
  }
  const allRows = strategyComparableRows();
  const rows = strategyFilterRows(allRows);
  const counts = {
    ok: allRows.filter((entry) => entry.status.key === 'ok').length,
    above: allRows.filter((entry) => entry.status.key === 'above').length,
    below: allRows.filter((entry) => entry.status.key === 'below').length,
    missing: allRows.filter((entry) => entry.status.key === 'missing').length,
  };
  const coverage = allRows.length ? Math.round((counts.ok / allRows.length) * 100) : 0;
  root.innerHTML = `
    <div class="exec-card lead strategy-lead">
      <h3>Mapa de precio marketing</h3>
      <p>Controla los SKUs Sarubbi contra el benchmark correcto por gama, sabor y presentacion. La fuente es <b>${escape(state.strategy?.source || 'portfolio-strategy.json')}</b>; no contiene PVS ni datos sensibles de precio sugerido.</p>
    </div>
    <div class="strategy-kpis">
      <div class="strategy-kpi ok"><span>En objetivo</span><b>${counts.ok}</b><small>${coverage}% de SKUs comparables</small></div>
      <div class="strategy-kpi above"><span>Sobre objetivo</span><b>${counts.above}</b><small>Revisar posicionamiento/precio</small></div>
      <div class="strategy-kpi below"><span>Debajo objetivo</span><b>${counts.below}</b><small>Puede erosionar arquitectura</small></div>
      <div class="strategy-kpi"><span>Sin base</span><b>${counts.missing}</b><small>Falta benchmark en mismo presentacion</small></div>
    </div>
    <div class="exec-card">
      ${renderStrategyChips(allRows)}
      <table class="compact-table strategy-table">
        <thead><tr><th>Marca Sarubbi</th><th>Rubro / gama</th><th>Presentacion</th><th>Referencia 100</th><th class="price">Moda Sarubbi normalizado</th><th>Indice</th><th>Estado</th></tr></thead>
        <tbody>${rows.map((entry) => {
          const row = entry.row;
          const compLabel = entry.benchmarkRows.length
            ? `${entry.benchmarkRows.length} obs. / ${[...new Set(entry.benchmarkRows.map((r) => r.brandLabel))].slice(0, 3).join(', ')}`
            : 'Sin competencia equivalente';
          return `<tr>
            <td><div class="mode-brand-stack">${brandLogo(row.sample)}</div>${productLinkCell(row.sample, `<br><span class="table-sub">${escape(row.label)}</span>`, row.brandLabel)}</td>
            <td><b>${escape(labelCategory(row.category))}</b><br><span class="table-sub">${escape(row.segment.label)}  -  ${escape(entry.rule?.note || '')}</span></td>
            <td>${escape(row.bucket.label)}${row.packUnits > 1 ? `<br><span class="table-sub">pack x${row.packUnits}</span>` : ''}</td>
            <td>${entry.benchmarkRows.length ? brandLogo({ brand: entry.benchmarkBrand, brandLabel: entry.benchmarkRows[0]?.brandLabel || entry.benchmarkBrand }) : '<span class="mode-index-empty">Sin base</span>'}<br><span class="table-sub">${escape(compLabel)}</span></td>
            <td class="price">${fmtPerLiter(row.modePricePerLiter)}<br><span class="table-sub">${fmtPrice(row.modePrice)} moda</span></td>
            <td>${strategyIndexBar(entry)}</td>
            <td>${strategyBadge(entry.index, entry.targetRange)}<br><span class="table-sub">Meta ${strategyTargetLabel(entry.targetRange)}</span></td>
          </tr>`;
        }).join('') || '<tr><td colspan="7" class="empty compact">Sin SKUs para los filtros aplicados.</td></tr>'}</tbody>
      </table>
    </div>`;

  root.querySelectorAll('[data-strategy-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.strategyFilters.category = btn.dataset.strategyCategory || '';
      renderStrategy();
    });
  });
  root.querySelectorAll('[data-strategy-status]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.strategyFilters.status = btn.dataset.strategyStatus || '';
      renderStrategy();
    });
  });
  bindProductLinks(root);
  applyClientCopy(root);
}

function renderExecutive() {
  if (!state.items.length) {
    $('#execContent').innerHTML = '<div class="empty">Sin datos.</div>';
    return;
  }
  const sarubbi = state.items.filter((i) => i.group === 'sarubbi');
  const comp = state.items.filter((i) => i.group === 'competencia');
  const offers = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price);
  const rows = competitiveRows().slice(0, 8);
  const pvs = state.items.filter((i) => i.suggestedPrice != null);
  const pvsTop = pvs.slice().sort((a, b) => Math.abs(b.suggestedDeviationPct ?? 0) - Math.abs(a.suggestedDeviationPct ?? 0)).slice(0, 10);
  const pvsAbove = pvs.filter((i) => i.suggestedStatus === 'above').length;
  const pvsOk = pvs.filter((i) => i.suggestedStatus === 'ok').length;
  const pvsBelow = pvs.filter((i) => i.suggestedStatus === 'below').length;
  const strategyRowsAll = strategyComparableRows();
  const strategyCounts = {
    ok: strategyRowsAll.filter((entry) => entry.status.key === 'ok').length,
    above: strategyRowsAll.filter((entry) => entry.status.key === 'above').length,
    below: strategyRowsAll.filter((entry) => entry.status.key === 'below').length,
    missing: strategyRowsAll.filter((entry) => entry.status.key === 'missing').length,
  };
  const strategyIssues = strategyRowsAll
    .filter((entry) => entry.status.key !== 'ok')
    .sort((a, b) => strategyStatusRank(a.status.key) - strategyStatusRank(b.status.key) || Math.abs(b.delta || 0) - Math.abs(a.delta || 0))
    .slice(0, 8);

  const byStore = values(state.items, 'super').map((store) => {
    const arr = state.items.filter((i) => i.super === store);
    const sarubbiCount = arr.filter((i) => i.group === 'sarubbi').length;
    return { store, count: arr.length, sarubbiCount: sarubbiCount, avg: avg(arr.map((i) => i.price)), offers: arr.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length };
  }).sort((a, b) => b.count - a.count);

  const byBrand = values(state.items, 'brand').map((brand) => {
    const arr = state.items.filter((i) => i.brand === brand);
    return { brand, label: labelBrand(arr[0]), group: arr[0].group, category: arr[0].category, count: arr.length, stores: new Set(arr.map((i) => i.super)).size, avg: avg(arr.map((i) => i.price)) };
  }).sort((a, b) => b.count - a.count);

  const date = new Date(state.generatedAt).toLocaleString('es-UY', { dateStyle: 'long', timeStyle: 'short' });
  $('#execContent').innerHTML = `
    <div class="print-only report-head">
      <h1>${escape(APP_COPY.productName)}</h1>
      <p>Informe interno de precios ${escape(APP_COPY.targetOwnerLabel)}  -  ${escape(APP_COPY.domain)}  -  ${escape(date)}</p>
    </div>
    <div class="exec-card lead">
      <h3>Resumen</h3>
      <p>Se relevaron <b>${state.items.length}</b> registros: <b>${sarubbi.length}</b> de marcas Sarubbi y <b>${comp.length}</b> de competencia, en <b>${new Set(state.items.map((i) => i.super)).size}</b> fuentes con precio promedio Sarubbi de <b>${fmtPrice(avg(sarubbi.map((i) => i.price)))}</b>. Estrategia marketing: <b>${strategyCounts.ok}</b> en objetivo, <b>${strategyCounts.above}</b> sobre y <b>${strategyCounts.below}</b> debajo. Control PVS: <b>${pvsAbove}</b> sobre, <b>${pvsOk}</b> en regla y <b>${pvsBelow}</b> bajo sugerido.</p>
    </div>

    <div id="reportAutomationPanel">${reportAutomationHtml()}</div>

    <div class="exec-grid">
      <div class="exec-card">
        <h3>Marcas relevadas</h3>
        <div class="brand-stats">
          ${byBrand.slice(0, 18).map((b) => `<div class="brand-stat">
            <div><div class="brand-stat-name">${escape(b.label)}</div><div class="brand-stat-detail">${escape(labelOwner(b.group))}  -  ${escape(labelCategory(b.category))}  -  ${b.stores} cadenas</div></div>
            <div class="stat-right"><div class="brand-stat-value">${b.count}</div><div class="brand-stat-detail">${fmtPrice(b.avg)}</div></div>
          </div>`).join('')}
        </div>
      </div>

      <div class="exec-card">
        <h3>Cobertura por cadena</h3>
        <div class="super-bars">
          ${byStore.map((s) => `<div class="super-bar">
            <div class="super-bar-header"><span><span class="pill ${escape(s.store)}">${escape(labelStore(s.store))}</span> ${s.count} SKUs</span><span>${fmtPrice(s.avg)}</span></div>
            <div class="super-bar-track"><div class="super-bar-fill ${escape(s.store)}" style="width:${Math.max(6, s.count / Math.max(...byStore.map((x) => x.count), 1) * 100).toFixed(1)}%"></div></div>
            <div class="brand-stat-detail">${s.sarubbiCount} Sarubbi  -  ${s.offers} ofertas</div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="exec-card">
      <h3>Lectura marketing</h3>
      <table>
        <thead><tr><th>Marca Sarubbi</th><th>Gama / presentacion</th><th>Referencia 100</th><th>Indice</th><th>Estado</th></tr></thead>
        <tbody>${strategyIssues.map((entry) => `<tr>
          <td>${brandLogo(entry.row.sample)}<br><span class="table-sub">${escape(entry.row.label)}</span></td>
          <td>${escape(entry.row.segment.label)} / ${escape(entry.row.bucket.label)}</td>
          <td>${entry.benchmarkRows.length ? escape(entry.benchmarkRows[0].brandLabel) : 'Sin base'}</td>
          <td><b>${entry.index == null ? '-' : `${entry.index.toFixed(0)}%`}</b><br><span class="table-sub">obj ${strategyTargetLabel(entry.targetRange)}</span></td>
          <td>${strategyBadge(entry.index, entry.targetRange)}</td>
        </tr>`).join('') || '<tr><td colspan="5" class="empty compact">Todos los SKUs comparables estan dentro de objetivo.</td></tr>'}</tbody>
      </table>
    </div>

    <div class="exec-card">
      <h3>Principales brechas normalizado</h3>
      <table>
        <thead><tr><th>Categoria</th><th>Marca / gama / presentacion</th><th>Sarubbi normalizado</th><th>Competencia normalizado</th><th class="price">Brecha normalizado</th></tr></thead>
        <tbody>${rows.map((r) => `<tr>
          <td>${escape(labelCategory(r.category))}</td>
          <td>${brandLogo(r.sarubbiBest.item)}<br><span class="table-sub">${escape(r.segment.label)} / ${escape(r.bucket.label)} / ${r.sarubbi.length} propios / ${r.comp.length} comp.</span></td>
          <td><b>${fmtPerLiter(r.sarubbiAvgPerLiter)}</b><br><span class="table-sub">mejor: ${escape(entryDetail(r.sarubbiBest))}</span></td>
          <td><b>${fmtPerLiter(r.compAvgPerLiter)}</b><br><span class="table-sub">mejor: ${escape(entryDetail(r.compBest))}</span></td>
          <td class="price ${r.diff <= 0 ? 'min' : ''}">${r.diff > 0 ? '+' : r.diff < 0 ? '-' : ''}${fmtPerLiter(Math.abs(r.diff))}<br><span>${r.pct > 0 ? '+' : ''}${r.pct.toFixed(1)}%</span></td>
        </tr>`).join('') || '<tr><td colspan="5" class="empty compact">Sin comparables normalizado.</td></tr>'}</tbody>
      </table>
    </div>

    <div class="exec-card">
      <h3>Control precio sugerido</h3>
      <table>
        <thead><tr><th>Producto</th><th>Cadena</th><th class="price">Precio</th><th class="price">PVS</th><th class="price">Desvio</th><th>Estado</th></tr></thead>
        <tbody>${pvsTop.map((i) => `<tr>
          <td>${escape(i.name)}<br><span class="suggested-ref">${escape(i.suggestedProduct || '-')}  -  ${escape(i.suggestedSource || '-')}</span></td>
          <td><span class="pill ${escape(i.super)}">${escape(labelStore(i.super))}</span></td>
          <td class="price">${fmtPrice(i.price)}</td><td class="price">${fmtPrice(i.suggestedPrice)}</td>
          <td class="price suggested-dev ${escape(i.suggestedStatus || '')}">${fmtPct(i.suggestedDeviationPct)}</td><td>${suggestedBadge(i)}</td>
        </tr>`).join('') || '<tr><td colspan="6" class="empty compact">Sin productos cruzados contra PVS.</td></tr>'}</tbody>
      </table>
    </div>

    <div class="exec-card">
      <h3>Top descuentos</h3>
      <table>
        <thead><tr><th>Producto</th><th>Marca</th><th>Cadena</th><th class="price">Lista</th><th class="price">Oferta</th><th>%</th></tr></thead>
        <tbody>${offers.slice(0, 10).map((o) => `<tr>
          <td>${escape(o.name)}</td><td class="brand">${escape(labelBrand(o))}</td><td><span class="pill ${escape(o.super)}">${escape(labelStore(o.super))}</span></td>
          <td class="price list">${fmtPrice(o.listPrice)}</td><td class="price">${fmtPrice(o.price)}</td><td><span class="discount-badge">-${Math.round((1 - o.price / o.listPrice) * 100)}%</span></td>
        </tr>`).join('') || '<tr><td colspan="6" class="empty compact">Sin ofertas.</td></tr>'}</tbody>
      </table>
    </div>

    <div class="no-print report-actions">
      <button class="btn blue btn-print" onclick="window.print()">Imprimir / PDF</button>
      <a class="btn" href="/data/latest.pdf" download>PDF generado</a>
    </div>
  `;
  applyClientCopy($('#execContent'));
  bindReportAutomationControls();
}

function updateTabBadges() {
  $('#badgeCatalog').textContent = state.items.length;
  $('#badgeCompare').textContent = state.clusters.filter((g) => g.items.length >= 2).length;
  $('#badgeMode').textContent = skuModeRows().length;
  $('#badgeOffers').textContent = state.items.filter((i) => i.listPrice && i.price && i.listPrice > i.price).length;
  $('#badgeSuggested').textContent = state.items.filter((i) => i.suggestedPrice != null).length;
}

function switchTab(name) {
  state.view = name;
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'exec' && !state.reportAutomation.status && !state.reportAutomation.loading) loadReportAutomation();
}

function bindProductLinks(root) {
  root.querySelectorAll('.product-link').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal(a.dataset.key);
    });
  });
}

function branchBreakdownHtml(item) {
  const bp = item.branchPrices;
  if (!Array.isArray(bp) || bp.length < 2) return '';
  const rows = bp.map((b) => {
    const isCommon = Number(b.price) === Number(item.price);
    return `<tr class="${isCommon ? 'is-common' : ''}">
      <td>${escape(b.branch || '-')}</td>
      <td class="price">${fmtPrice(b.price)}${isCommon ? ' <span class="common-tag">comun</span>' : ''}</td>
    </tr>`;
  }).join('');
  const distinct = item.priceBreakdown?.length || 1;
  const title = item.priceVaries
    ? `Precio por local  -  varia (${distinct} precios distintos)`
    : `Precio por local  -  igual en ${item.branchCount} locales`;
  return `<h3>${escape(title)}</h3>
    <table class="history-table branch-table"><thead><tr><th>Local</th><th class="price">Precio</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function openProductModal(key) {
  const item = state.items.find((i) => `${i.super}:${i.sku}` === key);
  if (!item) return;
  const sourceUrl = productSourceUrl(item);
  const points = (state.history || [])
    .map((s) => ({ t: new Date(s.t).getTime(), p: s.prices[key] }))
    .filter((x) => x.p != null);
  const modalThumb = productThumb(item, 'modal-product-thumb');

  $('#modalContent').innerHTML = `
    <h2 class="modal-title">${modalThumb}<span>${escape(item.name)}</span></h2>
    <div class="modal-meta">
      ${ownerBadge(item.group)}
      <span>${escape(labelBrand(item))}</span>
      <span>${escape(labelCategory(item.category))}</span>
      <span class="pill ${escape(item.super)}">${escape(labelStore(item.super))}</span>
      ${item.branchCount > 1 ? `<span>${item.branchCount} locales</span>` : (item.branch ? `<span>${escape(item.branch)}</span>` : '')}
    </div>
    <div class="modal-kpis">
      <div class="kpi"><div class="kpi-label">Precio actual</div><div class="kpi-value">${fmtPrice(item.price)}</div></div>
      <div class="kpi blue"><div class="kpi-label">Precio lista</div><div class="kpi-value">${fmtPrice(item.listPrice)}</div></div>
      ${item.suggestedPrice != null ? `<div class="kpi pvs"><div class="kpi-label">PVS</div><div class="kpi-value">${fmtPrice(item.suggestedPrice)}</div><div class="kpi-sub">${fmtPct(item.suggestedDeviationPct)}  -  ${escape(SUGGESTED_LABEL[item.suggestedStatus] || '')}</div></div>` : ''}
      <div class="kpi green"><div class="kpi-label">Snapshots</div><div class="kpi-value">${points.length}</div></div>
    </div>
    ${item.suggestedPrice != null ? `<div class="suggested-modal-note">Referencia PVS: <b>${escape(item.suggestedProduct || '-')}</b>  -  ${escape(item.suggestedSource || '-')}  -  PVP informe ${fmtPrice(item.suggestedObservedPvp)}</div>` : ''}
    ${branchBreakdownHtml(item)}
    <h3>Evolucion del precio</h3>
    ${renderSparkline(points)}
    ${points.length >= 2 ? buildHistoryTable(points) : '<div class="empty compact">Se necesitan al menos dos snapshots para ver evolucion.</div>'}
    ${sourceUrl ? `<div class="modal-actions"><a class="btn" href="${escape(sourceUrl)}" target="_blank" rel="noopener">Ver fuente</a></div>` : ''}
  `;
  $('#modal').classList.add('show');
}

function renderSparkline(points) {
  if (points.length < 2) return '<div class="spark-empty">Historico aun no disponible.</div>';
  const W = 640, H = 150, P = 22;
  const xs = points.map((x) => x.t);
  const ys = points.map((x) => x.p);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const padY = (maxY - minY) * 0.15 || 5;
  const ymin = minY - padY, ymax = maxY + padY;
  const xFor = (t) => P + ((t - minX) / Math.max(1, maxX - minX)) * (W - 2 * P);
  const yFor = (p) => H - P - ((p - ymin) / Math.max(1, ymax - ymin)) * (H - 2 * P);
  const d = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xFor(pt.t).toFixed(1)} ${yFor(pt.p).toFixed(1)}`).join(' ');
  const dots = points.map((pt) => `<circle cx="${xFor(pt.t).toFixed(1)}" cy="${yFor(pt.p).toFixed(1)}" r="3" fill="var(--red)" stroke="#fff" stroke-width="1.5"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="spark"><path d="${d}" fill="none" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}

function buildHistoryTable(points) {
  const rows = points.slice().reverse().slice(0, 10).map((pt, i, arr) => {
    const prev = arr[i + 1];
    const diff = prev ? pt.p - prev.p : 0;
    return `<tr><td>${new Date(pt.t).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' })}</td><td class="price">${fmtPrice(pt.p)}</td><td>${diff ? `${diff > 0 ? '+' : ''}${fmtPrice(diff)}` : '-'}</td></tr>`;
  }).join('');
  return `<table class="history-table"><thead><tr><th>Fecha</th><th class="price">Precio</th><th>Cambio</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function closeModal() { $('#modal').classList.remove('show'); }

async function pollUntilDone(initialGeneratedAt) {
  const start = Date.now();
  const maxMs = 20 * 60 * 1000;
  while (Date.now() - start < maxMs) {
    await new Promise((r) => setTimeout(r, 5000));
    try {
      let statusData = null;
      const s = await fetch('/api/status', { cache: 'no-store' });
      if (s.ok) {
        statusData = await s.json();
        if (isRefreshUnavailable(statusData)) throw new Error(refreshUnavailableMessage(statusData));
        const elapsed = elapsedSecondsFromStatus(statusData, start);
        renderRefreshProgress(statusData, elapsed);
        const phaseLabel = statusData.progress?.phase === 'pdf'
          ? 'PDF'
          : (statusData.progress?.phase === 'demo' ? 'Demo' : (statusData.status === 'queued' ? 'En cola' : 'Relevando'));
        $('#refreshBtn').innerHTML = `<span class="spinner"></span> ${phaseLabel} (${elapsed}s)`;
        if (statusData.status === 'completed' && statusData.conclusion === 'failure') throw new Error('El relevamiento fallo.');
      }

      const r = await fetch('/data/latest.json', { cache: 'no-store' });
      let latestData = null;
      if (r.ok) {
        latestData = await r.json();
        if (latestData.generatedAt && latestData.generatedAt !== initialGeneratedAt && statusData?.status === 'completed') return latestData;
      }
      if (!statusData && latestData?.generatedAt && latestData.generatedAt !== initialGeneratedAt) return latestData;
      if (statusData?.status === 'completed' && statusData.conclusion === 'success') {
        if (latestData?.generatedAt) return latestData;
        throw new Error('El relevamiento termino, pero no pude leer el archivo actualizado.');
      }
    } catch (e) {
      if (/relevamiento fallo|archivo actualizado/i.test(e.message)) throw e;
      console.warn('poll', e);
    }
  }
  throw new Error('Timeout esperando nuevo relevamiento.');
}

async function refresh() {
  const btn = $('#refreshBtn');
  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  const initial = state.generatedAt;
  try {
    btn.innerHTML = '<span class="spinner"></span> Disparando';
    const resp = await fetch('/api/refresh', { method: 'POST' });
    const data = await resp.json();
    if (!resp.ok || data.ok === false) throw new Error(data.error || `HTTP ${resp.status}`);
    if (isRefreshUnavailable(data)) {
      renderRefreshProgress(data, 0);
      toast(refreshUnavailableMessage(data));
      return;
    }
    renderRefreshProgress(data, elapsedSecondsFromStatus(data, Date.now()));
    toast('Relevamiento disparado. Esperando resultados.');
    await pollUntilDone(initial);
    toast('Datos actualizados.', 'success');
    await load();
  } catch (err) {
    toast('Error: ' + err.message, 'error');
    renderHeader();
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

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
  $('#compareCategory').addEventListener('change', (e) => { state.compare.category = e.target.value; renderCompare(); });
  $('#compareList').addEventListener('change', (e) => {
    const map = {
      compareBrandFilter: 'brand',
      compareCategoryFilter: 'category',
      compareFormatFilter: 'format',
      compareStoreFilter: 'store',
    };
    const key = map[e.target.id];
    if (!key) return;
    state.compare[key] = e.target.value;
    renderCompare();
  });
  $('#modeQ').addEventListener('input', (e) => { state.mode.q = e.target.value; renderMode(); });
  $('#modeBrandFilter').addEventListener('change', (e) => { state.mode.brand = e.target.value; renderMode(); });
  $('#modeOwnerFilter').addEventListener('change', (e) => { state.mode.owner = e.target.value; renderMode(); });
  $('#modeCategoryFilter').addEventListener('change', (e) => { state.mode.rubro = e.target.value || 'all'; state.mode.segment = ''; renderMode(); });
  $('#modeSegmentFilter').addEventListener('change', (e) => { state.mode.segment = e.target.value; renderMode(); });
  $('#modeStoreFilter').addEventListener('change', (e) => { state.mode.store = e.target.value; renderMode(); });
  $('#offersQ').addEventListener('input', (e) => { state.offers.q = e.target.value; renderOffers(); });
  $('#offersBrandFilter').addEventListener('change', (e) => { state.offers.brand = e.target.value; renderOffers(); });
  $('#offersOwnerFilter').addEventListener('change', (e) => { state.offers.owner = e.target.value; renderOffers(); });
  $('#offersCategoryFilter').addEventListener('change', (e) => { state.offers.category = e.target.value; renderOffers(); });
  $('#offersStoreFilter').addEventListener('change', (e) => { state.offers.store = e.target.value; renderOffers(); });
  $('#suggestedQ').addEventListener('input', (e) => { state.suggestedFilters.q = e.target.value; renderSuggested(); });
  $('#suggestedStatus').addEventListener('change', (e) => { state.suggestedFilters.status = e.target.value; renderSuggested(); });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  $('#modalClose').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

loadPortfolioPrefs();
initEvents();
load();
