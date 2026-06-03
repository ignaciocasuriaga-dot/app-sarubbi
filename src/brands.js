// Portfolio de Sarubbi - Monitor de precios de fiambres en supermercados uruguayos.

export const CATEGORY_LABEL = {
  jamon_cocido: 'Jamón Cocido',
  jamon_crudo: 'Jamón Crudo',
  panchos: 'Panchos / Frankfurter',
  jamon_cocido_fetas: 'Jamón Cocido en Fetas',
  chorizo: 'Chorizo',
  hamburguesas: 'Hamburguesas Congeladas',
  empanadas: 'Empanadas Congeladas',
  mortadelin_pate: 'Pack Mortadelin + Paté',
  factura_seca: 'Factura Seca (Salamín / Fuet / Chacarero / Cantimpalo / Longaniza)',
  salames: 'Salames / Salami',
  panceta: 'Panceta',
  mortadela: 'Mortadela',
};

export const OWNER_LABEL = {
  sarubbi: 'Sarubbi',
  competencia: 'Competencia',
};

export const COMPANY_LABEL = {
  sarubbi: 'Sarubbi',
  schneck: 'Schneck',
  centenario: 'Alimentos Centenario',
  cattivelli: 'Cattivelli',
  ottonello: 'Ottonello',
  camposur: 'Camposur',
  constancia: 'La Constancia',
};

export const STORE_LABEL = {
  tata: 'Ta-Ta',
  disco: 'Disco',
  eldorado: 'El Dorado',
  tiendainglesa: 'Tienda Inglesa',
};

// Catalog: each brand entry maps to a keyword match config
const BRAND_DEFINITIONS = [
  // ─── Sarubbi ───────────────────────────────────────────────────────────────
  {
    name: 'sarubbi',
    label: 'Sarubbi',
    owner: 'sarubbi',
    company: 'sarubbi',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'mortadelin_pate', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['sarubbi'],
  },

  // ─── Schneck ───────────────────────────────────────────────────────────────
  {
    name: 'schneck',
    label: 'Schneck',
    owner: 'competencia',
    company: 'schneck',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['schneck'],
  },

  // ─── Alimentos Centenario ──────────────────────────────────────────────────
  {
    name: 'centenario',
    label: 'Alimentos Centenario',
    owner: 'competencia',
    company: 'centenario',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['centenario', 'alimentos centenario'],
  },

  // ─── Cattivelli ────────────────────────────────────────────────────────────
  {
    name: 'cattivelli',
    label: 'Cattivelli',
    owner: 'competencia',
    company: 'cattivelli',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['cattivelli', 'cativelli', 'catibelli'],
  },

  // ─── Ottonello ─────────────────────────────────────────────────────────────
  {
    name: 'ottonello',
    label: 'Ottonello',
    owner: 'competencia',
    company: 'ottonello',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['ottonello', 'otonello', 'ottonelo'],
  },

  // ─── Camposur ──────────────────────────────────────────────────────────────
  {
    name: 'camposur',
    label: 'Camposur',
    owner: 'competencia',
    company: 'camposur',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['camposur', 'campo sur'],
  },

  // ─── La Constancia ─────────────────────────────────────────────────────────
  {
    name: 'constancia',
    label: 'La Constancia',
    owner: 'competencia',
    company: 'constancia',
    categories: ['jamon_cocido', 'jamon_crudo', 'panchos', 'jamon_cocido_fetas', 'chorizo', 'hamburguesas', 'empanadas', 'factura_seca', 'salames', 'panceta', 'mortadela'],
    aliases: ['la constancia', 'constancia'],
  },
];

const sarubbiBrands = BRAND_DEFINITIONS.filter((b) => b.owner === 'sarubbi').map((b) => b.name);
const competitorBrands = BRAND_DEFINITIONS.filter((b) => b.owner === 'competencia').map((b) => b.name);

export const BRAND_GROUPS = {
  sarubbi: sarubbiBrands,
  competencia: competitorBrands,
};

export const ALL_BRANDS = [...sarubbiBrands, ...competitorBrands];

export const SEARCH_TERMS = [
  // Product types
  'jamon cocido',
  'jamon crudo',
  'pancho',
  'panchos',
  'frankfurter',
  'frankfurt',
  'chorizo',
  'hamburguesa congelada',
  'hamburguesas congeladas',
  'empanada congelada',
  'empanadas congeladas',
  'mortadela',
  'mortadelin',
  'panceta',
  'salami',
  'salamin',
  'fuet',
  'chacarero',
  'cantimpalo',
  'longaniza',
  // Brand names as search terms
  'sarubbi',
  'schneck',
  'centenario',
  'cattivelli',
  'ottonello',
  'camposur',
  'la constancia',
  'constancia',
];

// Category detection based on product name keywords
const CATEGORY_KEYWORDS = [
  { category: 'jamon_cocido_fetas', patterns: [/jamon\s+cocido\s+en\s+fetas/i, /fetas\s+de\s+jamon/i, /en\s+fetas/i] },
  { category: 'jamon_cocido', patterns: [/jamon\s+cocido/i, /jamon\s+york/i] },
  { category: 'jamon_crudo', patterns: [/jamon\s+crudo/i, /jamon\s+serrano/i] },
  { category: 'panchos', patterns: [/pancho/i, /frankfurter/i, /frankfurt/i, /salchicha/i, /viena/i] },
  { category: 'chorizo', patterns: [/chorizo/i] },
  { category: 'hamburguesas', patterns: [/hamburguesa/i] },
  { category: 'empanadas', patterns: [/empanada/i] },
  { category: 'mortadelin_pate', patterns: [/mortadelin/i, /pate\s+y\s+mortadelin/i, /pack\s+mortadelin/i] },
  { category: 'factura_seca', patterns: [/salamin/i, /fuet/i, /chacarero/i, /cantimpalo/i, /longaniza/i] },
  { category: 'salames', patterns: [/salami/i, /salame/i, /\bsalames\b/i] },
  { category: 'panceta', patterns: [/panceta/i] },
  { category: 'mortadela', patterns: [/\bmortadela\b/i] },
];

function stripAccents(s) {
  return String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '');
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
    length: alias.length,
    rx: new RegExp(`\\b${aliasPattern(alias)}\\b`, 'i'),
  })),
).sort((a, b) => b.length - a.length);

export function matchedPortfolio(text) {
  if (!text) return null;
  const norm = stripAccents(text).toLowerCase();
  const match = MATCHERS.find((m) => m.rx.test(norm));
  return match?.brand ?? null;
}

// Legacy alias used by existing scrapers/recon that import matchedBrand
export const matchedBrand = matchedPortfolio;

function detectCategory(norm) {
  for (const { category, patterns } of CATEGORY_KEYWORDS) {
    if (patterns.some((rx) => rx.test(norm))) return category;
  }
  return null;
}

export function enrichProduct(item, text) {
  const norm = stripAccents(String(text ?? item.name ?? '')).toLowerCase();
  const brand = matchedPortfolio(norm);
  if (!brand) return item;
  const def = BRAND_DEFINITIONS.find((b) => b.name === brand);
  const category = detectCategory(norm);
  return {
    ...item,
    brand,
    group: def?.owner ?? 'competencia',
    company: def?.company ?? brand,
    category: category ?? undefined,
  };
}

export function brandGroup(brand) {
  if (sarubbiBrands.includes(brand)) return 'sarubbi';
  if (competitorBrands.includes(brand)) return 'competencia';
  return null;
}

export const CATEGORY_GROUPS = Object.fromEntries(
  Object.keys(CATEGORY_LABEL).map((cat) => [
    cat,
    BRAND_DEFINITIONS.filter((b) => b.categories.includes(cat)).map((b) => b.name),
  ]),
);
