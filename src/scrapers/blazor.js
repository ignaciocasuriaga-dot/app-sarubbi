import { launchBrowser, randomDelay } from '../browser.js';
import { enrichProduct } from '../brands.js';

async function searchTermBlazor(page, baseUrl, term) {
  const url = `${baseUrl}/productos/keyword/${encodeURIComponent(term)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

  // Blazor renderiza via WebSocket. Esperamos hasta ver precios reales.
  await page.waitForFunction(() => {
    const text = document.body.innerText || '';
    const matches = text.match(/\$\s*\d+[.,]?\d*/g) || [];
    return matches.filter((m) => !/\$\s*0(\D|$)/.test(m)).length >= 3;
  }, { timeout: 6000 }).catch(() => {});

  for (let i = 0; i < 1; i += 1) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await randomDelay(250, 450);
  }
  await randomDelay(250, 450);

  return page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/product/"]');
    const bySku = new Map();
    links.forEach((link) => {
      const href = link.href;
      const skuMatch = href.match(/\/product\/[^/]+\/(\d+)/);
      if (!skuMatch) return;
      const sku = skuMatch[1];

      const card =
        link.closest('article') || link.closest('li') ||
        link.closest('[class*="card"]') || link.closest('[class*="producto"]') ||
        link.closest('[class*="product"]') || link.parentElement?.parentElement;
      if (!card) return;
      const text = (card.innerText || '').trim();

      const existing = bySku.get(sku);
      if (existing && existing.cardText.length >= text.length) return;

      const nameEl = card.querySelector('h2, h3, h4, [class*="nombre"], [class*="title"], [class*="name"]') || link;
      const name = (nameEl.innerText || '').trim().replace(/\s+/g, ' ');
      if (!name) return;

      const priceMatches = text.match(/\$\s*[\d.,]+/g) || [];
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

      bySku.set(sku, {
        sku, name,
        price: finalPrices.length ? Math.min(...finalPrices) : null,
        listPrice: finalPrices.length > 1 ? Math.max(...finalPrices) : null,
        url: href,
        cardText: text,
      });
    });
    return [...bySku.values()].map(({ cardText, ...rest }) => rest);
  });
}

async function scrapeBlazorSite({ store, baseUrl, terms, progress = () => {} }) {
  const { browser, context } = await launchBrowser({ headless: true });
  const page = await context.newPage();
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
        items = await searchTermBlazor(page, baseUrl, term);
      } catch (e) {
        progress({
          status: 'term_error',
          term,
          termIndex: index + 1,
          termTotal: terms.length,
          found: bySku.size,
          error: e.message,
        });
        console.error(`  WARN ${store} "${term}": ${e.message}`);
        continue;
      }

      for (const i of items) {
        const product = enrichProduct({
          super: store,
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

export const scrapeDisco = (terms, progress) => scrapeBlazorSite({ store: 'disco', baseUrl: 'https://www.disco.com.uy', terms, progress });
export const scrapeDevoto = (terms, progress) => scrapeBlazorSite({ store: 'devoto', baseUrl: 'https://www.devoto.com.uy', terms, progress });
export const scrapeGeant = (terms, progress) => scrapeBlazorSite({ store: 'geant', baseUrl: 'https://www.geant.com.uy', terms, progress });

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { SEARCH_TERMS } = await import('../brands.js');
  const which = process.argv[2] || 'disco';
  const fn = which === 'devoto' ? scrapeDevoto : which === 'geant' ? scrapeGeant : scrapeDisco;
  fn(SEARCH_TERMS).then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`OK ${which}: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
