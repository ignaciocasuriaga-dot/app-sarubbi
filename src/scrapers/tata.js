import { enrichProduct } from '../brands.js';

const ENDPOINT = 'https://www.tata.com.uy/api/graphql';
const HEADERS = {
  Accept: 'application/json',
  Origin: 'https://www.tata.com.uy',
  Referer: 'https://www.tata.com.uy/',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

async function searchTermTata(term) {
  const variables = {
    first: 100,
    after: '0',
    sort: 'score_desc',
    term,
    selectedFacets: [
      { key: 'channel', value: JSON.stringify({ salesChannel: '4', regionId: '' }) },
      { key: 'locale', value: 'es-uy' },
    ],
  };
  const url = `${ENDPOINT}?operationName=ProductsQuery&variables=${encodeURIComponent(JSON.stringify(variables))}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let data;
  try {
    const resp = await fetch(url, { headers: HEADERS, signal: controller.signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } finally {
    clearTimeout(timer);
  }
  if (data.errors) throw new Error('GraphQL errors: ' + JSON.stringify(data.errors));
  return data.data?.search?.products?.edges ?? [];
}

export async function scrapeTata(terms, progress = () => {}) {
  const bySku = new Map();
  for (let index = 0; index < terms.length; index += 1) {
    const term = terms[index];
    let edges;
    progress({
      status: 'term_start',
      term,
      termIndex: index + 1,
      termTotal: terms.length,
      found: bySku.size,
    });
    try {
      edges = await searchTermTata(term);
    } catch (e) {
      progress({
        status: 'term_error',
        term,
        termIndex: index + 1,
        termTotal: terms.length,
        found: bySku.size,
        error: e.message,
      });
      console.error(`  WARN tata "${term}": ${e.message}`);
      continue;
    }

    for (const e of edges) {
      const n = e.node;
      const brandField = n.brand?.name ?? '';
      const haystack = `${brandField} ${n.name}`;
      const matched = enrichProduct({}, haystack) ?? enrichProduct({}, brandField);
      if (!matched) continue;

      const sku = n.sku;
      if (bySku.has(sku)) continue;
      const v = n.isVariantOf?.hasVariant?.[0];
      const o = v?.offers?.offers?.[0];
      const baseItem = {
        super: 'tata',
        sku,
        name: n.name,
        price: o?.price ?? null,
        listPrice: o?.listPrice ?? null,
        currency: v?.offers?.priceCurrency ?? 'UYU',
        url: v?.slug ? `https://www.tata.com.uy/${v.slug}/p` : null,
      };
      bySku.set(sku, enrichProduct(baseItem, haystack) ?? enrichProduct(baseItem, brandField));
    }
    progress({
      status: 'term_done',
      term,
      termIndex: index + 1,
      termTotal: terms.length,
      fetched: edges.length,
      found: bySku.size,
    });
  }
  return [...bySku.values()];
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SEARCH_TERMS } = await import('../brands.js');
  scrapeTata(SEARCH_TERMS).then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`OK Tata: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
