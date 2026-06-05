import { enrichProduct } from '../brands.js';

const ENDPOINT = 'https://www.eldorado.com.uy/api/catalog_system/pub/products/search';
const HEADERS = {
  Accept: 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

function offerFrom(product) {
  const item = product.items?.[0];
  const seller = item?.sellers?.find((s) => s.sellerDefault) ?? item?.sellers?.[0];
  return {
    sku: item?.itemId ?? product.productId,
    name: item?.nameComplete ?? item?.name ?? product.productName,
    price: seller?.commertialOffer?.Price ?? null,
    listPrice: seller?.commertialOffer?.ListPrice ?? null,
    url: product.link ?? (product.linkText ? `https://www.eldorado.com.uy/${product.linkText}/p` : null),
  };
}

const PAGE_SIZE = 50;   // VTEX limita cada página a 50 (_to - _from <= 49)
const MAX_RESULTS = 2500; // tope duro de VTEX para products/search

async function fetchPage(term, from, to) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('ft', term);
  url.searchParams.set('_from', String(from));
  url.searchParams.set('_to', String(to));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const resp = await fetch(url, { headers: HEADERS, signal: controller.signal });
    if (!resp.ok) {
      // VTEX responde 416 al pasar el tope de paginación: lo tratamos como "no hay más".
      if (resp.status === 416 && from > 0) return [];
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(timer);
  }
}

async function searchTerm(term) {
  const all = [];
  for (let from = 0; from < MAX_RESULTS; from += PAGE_SIZE) {
    const page = await fetchPage(term, from, from + PAGE_SIZE - 1);
    all.push(...page);
    if (page.length < PAGE_SIZE) break; // última página
  }
  return all;
}

export async function scrapeElDorado(terms, progress = () => {}) {
  const bySku = new Map();
  for (let index = 0; index < terms.length; index += 1) {
    const term = terms[index];
    let products;
    progress({
      status: 'term_start',
      term,
      termIndex: index + 1,
      termTotal: terms.length,
      found: bySku.size,
    });
    try { products = await searchTerm(term); }
    catch (e) {
      progress({
        status: 'term_error',
        term,
        termIndex: index + 1,
        termTotal: terms.length,
        found: bySku.size,
        error: e.message,
      });
      console.error(`  eldorado "${term}": ${e.message}`);
      continue;
    }

    for (const product of products) {
      const base = offerFrom(product);
      const haystack = `${product.brand ?? ''} ${product.productName ?? ''} ${base.name ?? ''}`;
      const baseItem = {
        super: 'eldorado',
        sku: base.sku,
        name: base.name,
        price: base.price,
        listPrice: base.listPrice,
        currency: 'UYU',
        url: base.url,
      };
      const enriched = enrichProduct(baseItem, haystack) ?? enrichProduct(baseItem, product.brand ?? '');
      if (!enriched || bySku.has(enriched.sku)) continue;
      bySku.set(enriched.sku, enriched);
    }
    progress({
      status: 'term_done',
      term,
      termIndex: index + 1,
      termTotal: terms.length,
      fetched: products.length,
      found: bySku.size,
    });
  }
  return [...bySku.values()];
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SEARCH_TERMS } = await import('../brands.js');
  scrapeElDorado(SEARCH_TERMS).then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`El Dorado: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
