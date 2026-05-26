// Marcas a relevar, agrupadas por grupo empresarial.
// Cada grupo se busca por separado en cada super y los productos quedan taggeados.
export const BRAND_GROUPS = {
  bimbo: [
    'bimbo',
    'los sorchantes',
    'maestro cubano',
    'nutrabien',
    'salmas',
    'tia rosa',
  ],
  competencia: [
    'pagnifique',
    'pan felipe',
    'trigal',
    'granix',
    'el trigal',
  ],
};

export const ALL_BRANDS = Object.values(BRAND_GROUPS).flat();

function stripAccents(s) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

// Regex global para detectar cualquier marca dentro del nombre de un producto.
const BRAND_RX = new RegExp(
  '\\b(' + ALL_BRANDS.map((b) => b.replace(/\s+/g, '[\\s-]?')).join('|') + ')\\b',
  'i',
);

export function matchedBrand(text) {
  if (!text) return null;
  const norm = stripAccents(text);
  const m = norm.match(BRAND_RX);
  if (!m) return null;
  const found = m[1].toLowerCase().replace(/[\s-]+/g, ' ');
  return ALL_BRANDS.find((b) => b === found) ?? found;
}

export function brandGroup(brand) {
  if (!brand) return null;
  for (const [group, brands] of Object.entries(BRAND_GROUPS)) {
    if (brands.includes(brand)) return group;
  }
  return 'otra';
}
