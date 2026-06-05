import { mkdir, writeFile } from 'node:fs/promises';

const DEFAULT_BASE_URL = 'http://127.0.0.1:4173';
const baseUrl = String(process.env.APP_URL || process.argv[2] || DEFAULT_BASE_URL).replace(/\/+$/, '');
const DATA_DIR = 'public/data';

const FILES = [
  { name: 'latest.json', type: 'text', required: true },
  { name: 'latest.csv', type: 'text', required: false },
  { name: 'products.json', type: 'text', required: false },
  { name: 'history.jsonl', type: 'text', required: false },
  { name: 'latest.pdf', type: 'binary', required: false },
];

async function fetchFile(file) {
  const url = `${baseUrl}/data/${file.name}`;
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) {
    if (file.required) throw new Error(`No se pudo descargar ${url}: HTTP ${resp.status}`);
    console.warn(`WARN ${file.name}: HTTP ${resp.status}`);
    return false;
  }

  if (file.type === 'binary') {
    const bytes = Buffer.from(await resp.arrayBuffer());
    await writeFile(`${DATA_DIR}/${file.name}`, bytes);
  } else {
    await writeFile(`${DATA_DIR}/${file.name}`, await resp.text(), 'utf8');
  }
  console.log(`OK ${file.name}`);
  return true;
}

await mkdir(DATA_DIR, { recursive: true });

let ok = 0;
for (const file of FILES) {
  if (await fetchFile(file)) ok += 1;
}

console.log(`Datos hidratados desde ${baseUrl}: ${ok}/${FILES.length} archivos.`);
