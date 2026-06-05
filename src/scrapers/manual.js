import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { enrichProduct } from '../brands.js';

const DIR = 'data/manual';

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') {
      cur += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

function numberOrNull(value) {
  if (value == null || value === '') return null;
  let clean = String(value).replace(/[^\d,.-]/g, '');
  if (clean.includes(',') && clean.includes('.')) clean = clean.replace(/\./g, '').replace(',', '.');
  else if (clean.includes(',')) clean = clean.replace(',', '.');
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
}

function normalizeHeader(header) {
  return header.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
}

function normalizeChain(value) {
  const key = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '');
  const aliases = {
    macromercado: 'macromercado',
    macromercadomayorista: 'macromercado',
    macro: 'macromercado',
    ubesur: 'ubesur',
    kinko: 'kinko',
    frog: 'frog',
    tamisur: 'tamisur',
    elvencedor: 'elvencedor',
    vencedor: 'elvencedor',
    eldorado: 'eldorado',
    tiendainglesa: 'tiendainglesa',
    tata: 'tata',
    tatauy: 'tata',
    disco: 'disco',
    devoto: 'devoto',
    geant: 'geant',
  };
  return aliases[key] || key || 'manual';
}

function rowsFromCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, idx) => [h, values[idx] ?? '']));
  });
}

export async function scrapeManualPrices(_terms = [], progress = () => {}) {
  if (!existsSync(DIR)) return [];
  const files = (await readdir(DIR)).filter((file) => file.toLowerCase().endsWith('.csv'));
  const items = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    progress({
      status: 'manual_file_start',
      term: file,
      termIndex: index + 1,
      termTotal: files.length,
      found: items.length,
    });
    const text = await readFile(join(DIR, file), 'utf8');
    for (const row of rowsFromCsv(text)) {
      const chain = row.cadena || row.super || row.tienda || row.store || row.chain || file.replace(/\.csv$/i, '');
      const name = row.producto || row.nombre || row.name;
      if (!chain || !name) continue;

      const price = numberOrNull(row.precio || row.price);
      const listPrice = numberOrNull(row.precio_lista || row.listprice || row.lista);
      const sku = row.sku || row.codigo || `${chain}:${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const haystack = `${row.marca ?? ''} ${name} ${row.categoria ?? ''}`;
      const enriched = enrichProduct({
        super: normalizeChain(chain),
        sku,
        name,
        price,
        listPrice,
        currency: row.moneda || 'UYU',
        url: row.url || null,
        source: 'manual',
      }, haystack);
      if (enriched) items.push(enriched);
    }
    progress({
      status: 'manual_file_done',
      term: file,
      termIndex: index + 1,
      termTotal: files.length,
      found: items.length,
    });
  }

  return items;
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  scrapeManualPrices().then((items) => {
    console.log(JSON.stringify(items, null, 2));
    console.error(`Manual: ${items.length} productos`);
  }).catch((e) => { console.error(e); process.exit(1); });
}
