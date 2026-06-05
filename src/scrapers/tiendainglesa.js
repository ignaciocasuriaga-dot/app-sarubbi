import { launchBrowser, randomDelay } from '../browser.js';
import { enrichProduct } from '../brands.js';

const SEARCH_URLS = (term) => [
  `https://www.tiendainglesa.com.uy/farmacia/busqueda?0,0,${encodeURIComponent(term)},0`,
  `https://www.tiendainglesa.com.uy/supermercado/busqueda?0,0,${encodeURIComponent(term)},0`,
];

async function extractPageItems(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('a[href*=".producto"]', { timeout: 7000 }).catch(() => {});
  await randomDelay(300, 600);

  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await randomDelay(250, 450);
  }

  return page.evaluate(() => {
    const links = document.querySelectorAll('a[href*=".producto"]');
    const bySku = new Map();
    links.forEach((link) => {
      const m = link.getAttribute('href')?.match(/\.producto\?(\d+)/);
      if (!m) return;
      const sku = m[1];
      const card =
        link.closest('article') || link.closest('li') ||
        link.closest('[class*="card"]') || link.closest('[class*="producto"]') ||
        link.closest('[class*="item"]') || link.parentElement?.parentElement;
      if (!card) return;

      const text = (card.innerText || '').trim();
      const existing = bySku.get(sku);
      if (existing && existing.cardText.length >= text.length) return;

      let name = link.getAttribute('title') || link.querySelector('img')?.getAttribute('alt') || '';
      if (!name) {
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        name = lines[0] || '';
      }
      name = name.replace(/\s+/g, ' ').trim();

      const priceMatches = text.match(/\$\s*[\d.]+,?\d*/g) || [];
      const rawPrices = priceMatches
        .map((m) => Number(m.replace(/[^\d,]/g, '').replace(',', '.')))
        .filter((n) => n > 0 && n < 100000);
      const prices = rawPrices.filter((n) => n >= 20);
      const pricePool = prices.length ? prices : rawPrices;
      const maxPrice = pricePool.length ? Math.max(...pricePool) : null;
      const productPrices = maxPrice != null && maxPrice >= 80
        ? pricePool.filter((n) => !(n <= 35 && maxPrice / n >= 3))
        : pricePool;
      const finalPrices = productPrices.length ? productPrices : pricePool;

      const url = new URL(link.getAttribute('href'), location.origin).toString();
      const imgEl = card.querySelector('img');
      const image = imgEl?.src || imgEl?.getAttribute('data-src') || null;

      bySku.set(sku, {
        sku, name,
        price: finalPrices.length ? Math.min(...finalPrices) : null,
        listPrice: finalPrices.length > 1 ? Math.max(...finalPrices) : null,
        url, image, cardText: text,
      });
    });
    return [...bySku.values()].map(({ cardText, ...rest }) => rest);
  });
}

async function searchTermTI(page, term) {
  const bySku = new Map();
  for (const url of SEARCH_URLS(term)) {
    const rows = await extractPageItems(page, url);
    for (const row of rows) {
      if (!bySku.has(row.sku)) bySku.set(row.sku, row);
    }
  }
  return [...bySku.values()];
}

async function searchTermWithRetry(context, term) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const page = await context.newPage();
    try {
      return await searchTermTI(page, term);
    } catch (err) {
      lastError = err;
      await randomDelay(900, 1400);
    } finally {
      await page.close().catch(() => {});
    }
  }
  throw lastError;
}

export async function scrapeTiendaInglesa(terms, progress = () => {}) {
  const { browser, context } = await launchBrowser({ headless: true });
  const bySku = new Map();
  try {
    for (let index = 0; index < terms.length; index += 1) {
      const term = terms[index];
      let items;
      progress({
        status: 'term_start',
        term,
        termIndex: index + 1,
        termTotal: terms.length,
        found: bySku.size,
      });
      try {
        items = await searchTermWithRetry(context, term);
      } catch (e) {
        progress({
          status: 'term_error',
          term,
          termIndex: index + 1,
          termTotal: terms.length,
          found: bySku.size,
          error: e.message,
        });
        console.error(`  WARN ti "${term}": ${e.message}`);
        continue;
      }

      for (const i of items) {
        if (!i.name) continue;
        if (!Number.isFinite(Number(i.price)) || Number(i.price) <= 0) continue;
        const product = enrichProduct({
          super: 'tiendainglesa',
          sku: i.sku,
          name: i.name,
          price: i.price,
          listPrice: i.listPrice,
          currency: 'UYU',
          url: i.url,
        }, i.name);
        if (!product) continue;
        if (bySku.has(i.sku)) continue;
        bySku.set(i.sku, product);
      }
      progress({
        status: 'term_done',
        term,
        termIndex: index + 1,
        termTotal: terms.length,
        fetched: items.length,
        found: bySku.size,
      });
    }
    return [...bySku.values()];
  } finally {
    await browser.close();
  }
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SEARCH_TERMS } = await import('../brands.js');
  scrapeTiendaInglesa(SEARCH_TERMS).then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`OK TI: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
