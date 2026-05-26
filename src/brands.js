// Marcas/submarcas de Grupo Bimbo en Uruguay.
// Fuente: https://www.grupobimbo.com/es/marcas/sudamerica/uruguay

const BRAND_DEFINITIONS = [
  { name: 'bimbo', aliases: ['bimbo'] },
  { name: 'los sorchantes', aliases: ['los sorchantes', 'sorchantes'] },
  { name: 'maestro cubano', aliases: ['maestro cubano', 'el maestro cubano'] },
  { name: 'nutrabien', aliases: ['nutrabien', 'nutra bien'] },
  { name: 'sanissimo', aliases: ['sanissimo', 'sanisimo', 'salmas'] },
  { name: 'pancatalan', aliases: ['pancatalan', 'pancatlan', 'pan catalan'] },
  { name: 'tia rosa', aliases: ['tia rosa'] },
  { name: 'rapiditas', aliases: ['rapiditas'] },

  // Lineas oficiales, pero muy genericas como texto de producto.
  // Se detectan solo cuando aparecen junto a otra marca fuerte de Bimbo.
  { name: 'vital', aliases: ['vital'], requiresBimboContext: true },
  { name: 'artesano', aliases: ['artesano'], requiresBimboContext: true },
];

export const BRAND_GROUPS = {
  bimbo: BRAND_DEFINITIONS.map((b) => b.name),
};

export const ALL_BRANDS = BRAND_GROUPS.bimbo;

export const SEARCH_TERMS = [
  'bimbo',
  'los sorchantes',
  'sorchantes',
  'maestro cubano',
  'nutrabien',
  'nutra bien',
  'sanissimo',
  'sanisimo',
  'salmas',
  'pancatalan',
  'pancatlan',
  'pan catalan',
  'tia rosa',
  'rapiditas',
];

function stripAccents(s) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function aliasPattern(alias) {
  return stripAccents(alias)
    .toLowerCase()
    .split(/\s+/)
    .map(escapeRegex)
    .join('[\\s-]+');
}

const MATCHERS = BRAND_DEFINITIONS.flatMap((brand) =>
  brand.aliases.map((alias) => ({
    brand: brand.name,
    requiresBimboContext: Boolean(brand.requiresBimboContext),
    weight: brand.requiresBimboContext ? 1 : 0,
    length: alias.length,
    rx: new RegExp(`\\b${aliasPattern(alias)}\\b`, 'i'),
  })),
).sort((a, b) => (b.weight - a.weight) || (b.length - a.length));

const STRONG_MATCHERS = MATCHERS.filter((m) => !m.requiresBimboContext);

export function matchedBrand(text) {
  if (!text) return null;
  const norm = stripAccents(text).toLowerCase();
  const hasBimboContext = STRONG_MATCHERS.some((m) => m.rx.test(norm));
  const match = MATCHERS.find((m) => {
    if (m.requiresBimboContext && !hasBimboContext) return false;
    return m.rx.test(norm);
  });
  return match?.brand ?? null;
}

export function brandGroup(brand) {
  return ALL_BRANDS.includes(brand) ? 'bimbo' : null;
}
