import { enrichProduct } from '../brands.js';

// Super en Casa expone el mismo artículo en N locales -> antes cada (local, artículo)
// era un SKU distinto e inflaba el conteo. Acá colapsamos por artículo: 1 ítem por
// producto con el precio COMÚN (la moda entre locales) + detalle por local.
// Es idempotente: si el sku ya viene colapsado (sin empresa-local) queda igual.
export function collapseByArticle(items) {
  const articleOf = (sku) => {
    const parts = String(sku).split('-');
    return parts.length >= 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])
      ? parts.slice(2).join('-')
      : String(sku);
  };
  const branchKeyOf = (sku) => {
    const parts = String(sku).split('-');
    return parts.length >= 3 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])
      ? `${parts[0]}-${parts[1]}`
      : String(sku);
  };

  const groups = new Map();
  for (const it of items) {
    const art = articleOf(it.sku);
    if (!groups.has(art)) groups.set(art, []);
    groups.get(art).push(it);
  }

  const collapsed = [];
  for (const [art, group] of groups) {
    // 1 registro por local (un artículo puede repetirse por varios términos de búsqueda)
    const byBranch = new Map();
    for (const it of group) {
      const key = branchKeyOf(it.sku);
      if (!byBranch.has(key)) byBranch.set(key, it);
    }
    const branchItems = [...byBranch.values()];

    // Precio común = moda (más frecuente). Desempate: menor precio.
    const counts = new Map();
    for (const b of branchItems) {
      const p = Number(b.price);
      if (b.price == null || !Number.isFinite(p)) continue;
      counts.set(p, (counts.get(p) || 0) + 1);
    }
    const ranked = [...counts.entries()].sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
    const commonPrice = ranked.length ? ranked[0][0] : (branchItems[0]?.price ?? null);
    const rep = branchItems.find((b) => Number(b.price) === commonPrice) || branchItems[0];

    const branchPrices = branchItems
      .map((b) => ({ branch: b.branch || null, price: b.price ?? null, listPrice: b.listPrice ?? null }))
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));

    collapsed.push({
      ...rep,
      sku: art,
      price: commonPrice,
      listPrice: rep.listPrice ?? null,
      branch: null,
      branchAddress: null,
      branchCount: branchItems.length,
      priceVaries: counts.size > 1,
      priceBreakdown: ranked.map(([price, count]) => ({ price, count })),
      branchPrices,
    });
  }
  return collapsed;
}

const HOME = 'https://ubesur.superencasa.com.uy/';
const PAGE_SIZE = 200;
const CONCURRENCY = Number(process.env.SUPERENCASA_CONCURRENCY || 5);
const DEFAULT_TIMEOUT = 30000;

let cachedConfig;

async function fetchText(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeout ?? DEFAULT_TIMEOUT);
  try {
    const resp = await fetch(url, { ...opts, signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${url}`);
    return await resp.text();
  } finally {
    clearTimeout(timer);
  }
}

async function getConfig() {
  if (cachedConfig) return cachedConfig;
  const html = await fetchText(HOME, { headers: baseHeaders() });
  const mainScript = html.match(/src="([^"]*main\.[^"]+\.js)"/)?.[1];
  if (!mainScript) throw new Error('No se encontro el bundle principal de Super en Casa');

  const js = await fetchText(new URL(mainScript, HOME).toString(), { headers: baseHeaders() });
  const pick = (rx, label) => {
    const value = js.match(rx)?.[1];
    if (!value) throw new Error(`No se encontro configuracion ${label} de Super en Casa`);
    return value;
  };

  const version = pick(/version:"([^"]+)"/, 'version');
  const authorization = pick(/authorization:"([^"]+)"/, 'authorization');
  const packageId = pick(/packageId:"([^"]+)"/, 'packageId');
  const serverProducts = pick(/serverProducts:"([^"]+)"/, 'serverProducts');

  cachedConfig = {
    serverProducts,
    headers: {
      ...baseHeaders(),
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/json',
      'X-App-Version': version,
      Aplicacion: packageId,
      Red: 'Ubesur',
    },
  };
  return cachedConfig;
}

function baseHeaders() {
  return {
    Accept: 'application/json, text/plain, */*',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  };
}

async function fetchJson(path, params = {}) {
  const config = await getConfig();
  const url = new URL(path, config.serverProducts);
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') url.searchParams.set(key, value);
  }
  const text = await fetchText(url.toString(), { headers: config.headers });
  return JSON.parse(text);
}

async function getLocales({ red = null, namePattern = null } = {}) {
  const data = await fetchJson('locales/entrega-local', {
    pais: 233,
    page: 0,
    size: 200,
    red,
  });
  const result = Array.isArray(data.result) ? data.result : [];
  return namePattern ? result.filter((local) => namePattern.test(local.nombre || '')) : result;
}

async function searchLocalTerm(local, term) {
  const items = [];
  let page = 0;
  let totalPages = 1;

  do {
    const data = await fetchJson('articulos/search', {
      empresa: local.codigoEmpresa,
      local: local.codigoLocal,
      page,
      size: PAGE_SIZE,
      descripcion: term,
      visible: true,
    });
    const content = Array.isArray(data.content) ? data.content : [];
    items.push(...content);
    totalPages = Number(data.totalPages || 1);
    page += 1;
  } while (page < totalPages);

  return items;
}

function productFromApi(product, local, store) {
  const name = product.descripcionEnCasa || product.descripcion || product.modelo?.descripcion;
  const offerPrice = Number(product.oferta?.precio);
  const basePrice = Number(product.precio);
  const hasOffer = Number.isFinite(offerPrice) && offerPrice > 0 && offerPrice < basePrice;
  const price = hasOffer ? offerPrice : (Number.isFinite(basePrice) ? basePrice : null);
  const listPrice = hasOffer ? basePrice : null;
  const rawUrl = product.url || product.link || product.permalink || product.deepLink || '';
  let url = '';
  if (rawUrl) {
    try {
      url = new URL(rawUrl, HOME).toString();
    } catch {
      url = '';
    }
  }
  if (!url) return null;

  return enrichProduct({
    super: store,
    branch: local.nombre,
    branchAddress: local.direccion,
    sku: `${local.codigoEmpresa}-${local.codigoLocal}-${product.artCodigo || product.id}`,
    name,
    price,
    listPrice,
    currency: product.moneda === '$' ? 'UYU' : product.moneda || 'UYU',
    url,
    image: product.imagen || null,
  }, name);
}

async function mapLimit(tasks, limit) {
  const results = [];
  let next = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (next < tasks.length) {
      const index = next;
      next += 1;
      results[index] = await tasks[index]();
    }
  });
  await Promise.all(workers);
  return results;
}

async function scrapeLocales({ store, locales, terms, progress = () => {} }) {
  await getConfig();
  const bySku = new Map();
  const tasks = [];
  const totalTasks = locales.length * terms.length;
  let taskIndex = 0;

  for (const local of locales) {
    for (let termIndex = 0; termIndex < terms.length; termIndex += 1) {
      const term = terms[termIndex];
      taskIndex += 1;
      const currentTask = taskIndex;
      tasks.push(async () => {
        progress({
          status: 'term_start',
          local: local.nombre,
          term,
          termIndex: termIndex + 1,
          termTotal: terms.length,
          taskIndex: currentTask,
          taskTotal: totalTasks,
          found: bySku.size,
        });
        try {
          const products = await searchLocalTerm(local, term);
          progress({
            status: 'term_done',
            local: local.nombre,
            term,
            termIndex: termIndex + 1,
            termTotal: terms.length,
            taskIndex: currentTask,
            taskTotal: totalTasks,
            fetched: products.length,
            found: bySku.size,
          });
          return { local, products };
        } catch (e) {
          progress({
            status: 'term_error',
            local: local.nombre,
            term,
            termIndex: termIndex + 1,
            termTotal: terms.length,
            taskIndex: currentTask,
            taskTotal: totalTasks,
            found: bySku.size,
            error: e.message,
          });
          console.error(`  ${store} "${local.nombre}" "${term}": ${e.message}`);
          return { local, products: [] };
        }
      });
    }
  }

  for (const result of await mapLimit(tasks, CONCURRENCY)) {
    for (const product of result.products) {
      const item = productFromApi(product, result.local, store);
      if (!item || bySku.has(item.sku)) continue;
      bySku.set(item.sku, item);
    }
  }

  return collapseByArticle([...bySku.values()]);
}

export async function scrapeUbesur(terms, progress = () => {}) {
  const limit = Number(process.env.UBESUR_LOCAL_LIMIT || 0);
  const locales = await getLocales({ red: 'Ubesur' });
  progress({
    status: 'store_prepare',
    message: `Ubesur: ${locales.length} locales detectados`,
    taskTotal: (limit > 0 ? locales.slice(0, limit) : locales).length * terms.length,
  });
  return scrapeLocales({
    store: 'ubesur',
    locales: limit > 0 ? locales.slice(0, limit) : locales,
    terms,
    progress,
  });
}

export async function scrapeTamisur(terms, progress = () => {}) {
  const locales = await getLocales({ namePattern: /tamisur|la chacra/i });
  progress({
    status: 'store_prepare',
    message: `Tamisur: ${locales.length} locales detectados`,
    taskTotal: locales.length * terms.length,
  });
  return scrapeLocales({ store: 'tamisur', locales, terms, progress });
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SEARCH_TERMS } = await import('../brands.js');
  const which = process.argv[2] || 'ubesur';
  const fn = which === 'tamisur' ? scrapeTamisur : scrapeUbesur;
  fn(SEARCH_TERMS).then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`${which}: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
