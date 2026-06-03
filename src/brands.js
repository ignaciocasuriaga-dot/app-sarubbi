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
  // ── Marcas (traen todos sus productos de una) ──────────────────────────────
  'sarubbi',
  'schneck',
  'centenario',
  'cattivelli',
  'ottonello',
  'camposur',
  'constancia',

  // ── Jamón ─────────────────────────────────────────────────────────────────
  'jamon cocido',
  'jamon crudo',
  'jamon fetas',
  'jamon feteado',
  'jamon york',

  // ── Panchos / Salchichas ──────────────────────────────────────────────────
  'pancho',
  'panchos',
  'frankfurter',
  'salchicha viena',
  'salchicha tipo viena',
  'viena',

  // ── Chorizo ───────────────────────────────────────────────────────────────
  'chorizo',

  // ── Hamburguesas ──────────────────────────────────────────────────────────
  'hamburguesa congelada',
  'hamburguesas',

  // ── Empanadas ─────────────────────────────────────────────────────────────
  'empanada congelada',
  'empanadas',

  // ── Mortadela / Mortadelin ────────────────────────────────────────────────
  'mortadela',
  'mortadelin',

  // ── Panceta ───────────────────────────────────────────────────────────────
  'panceta',

  // ── Factura seca ─────────────────────────────────────────────────────────
  'salamin',
  'salami',
  'fuet',
  'chacarero',
  'cantimpalo',
  'longaniza',

  // ── Salames ───────────────────────────────────────────────────────────────
  'salame',
  'salames',
];

// Category detection — ordered from most specific to least specific.
// Patterns use stripped-accent normalized text.
const CATEGORY_KEYWORDS = [
  // Fetas must come before plain jamón cocido
  {
    category: 'jamon_cocido_fetas',
    patterns: [
      /jamon\s+cocido\s+en\s+fetas/i,
      /fetas?\s+de\s+jamon/i,
      /jamon.*\bfeta/i,
      /\bfetas\b.*jamon/i,
      /\bfeteado/i,
      /\bfeteada/i,
      /\ben\s+fetas\b/i,
    ],
  },
  {
    category: 'jamon_cocido',
    patterns: [/jamon\s+cocido/i, /jamon\s+york/i, /\bjamon\s+de\s+pierna/i],
  },
  {
    category: 'jamon_crudo',
    patterns: [/jamon\s+crudo/i, /jamon\s+serrano/i, /jamon\s+iberico/i, /\bjamon\s+curado/i],
  },
  {
    category: 'panchos',
    patterns: [/\bpancho/i, /frankfurter/i, /\bfrankfurt\b/i, /salchicha\s+(tipo\s+)?viena/i, /\bviena\b/i, /\bcoctel\b.*\bvaca/i],
  },
  {
    category: 'chorizo',
    patterns: [/\bchorizo/i],
  },
  {
    category: 'hamburguesas',
    patterns: [/hamburguesa/i, /\bburger\b/i],
  },
  {
    category: 'empanadas',
    patterns: [/empanada/i],
  },
  {
    category: 'mortadelin_pate',
    patterns: [/mortadelin/i, /\bpate\b.*mortadelin/i, /mortadelin.*\bpate\b/i, /pack.*mortadelin/i],
  },
  {
    category: 'factura_seca',
    patterns: [/\bsalamin\b/i, /\bsalami[n]?\b/i, /\bfuet\b/i, /\bchacarero\b/i, /\bcantimpalo\b/i, /\blonganiza\b/i, /factura\s+seca/i],
  },
  {
    category: 'salames',
    patterns: [/\bsalame\b/i, /\bsalami\b/i, /\bsalames\b/i],
  },
  {
    category: 'panceta',
    patterns: [/\bpanceta\b/i, /\bpancetta\b/i, /\btocineta\b/i],
  },
  {
    category: 'mortadela',
    patterns: [/\bmortadela\b/i],
  },
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

// Palabras que confirman que el producto es un chacinado / fiambre.
// Si la marca aparece en el texto pero NINGUNA de estas palabras está presente,
// el producto se descarta (evita traer golosinas, aceites, etc. de marcas homónimas).
const DELI_CONTEXT = [
  'jamon', 'jamón', 'panceta', 'pancetta', 'chorizo', 'salami', 'salame', 'salamin', 'salamín',
  'mortadela', 'mortadelin', 'pancho', 'panchos', 'frankfurter', 'frankfurt', 'viena',
  'hamburguesa', 'burger', 'empanada', 'fiambre', 'fiambres', 'chacinado', 'chacinados',
  'longaniza', 'fuet', 'chacarero', 'cantimpalo', 'pate', 'paté',
  'cocido', 'crudo', 'feta', 'fetas', 'feteado',
  // palabras de sección en supermercados
  'fiambreria', 'fiambrería', 'charcuteria', 'charcutería', 'carnes frias', 'carnes frías',
];

const DELI_CONTEXT_RX = new RegExp(
  DELI_CONTEXT.map((w) => `\\b${w}\\b`).join('|'),
  'i',
);

function hasDéliContext(norm) {
  return DELI_CONTEXT_RX.test(norm);
}

export function matchedPortfolio(text) {
  if (!text) return null;
  const norm = stripAccents(text).toLowerCase();
  if (!MATCHERS.some((m) => m.rx.test(norm))) return null;
  // Require deli context so we don't pick up golosinas, aceites, etc.
  if (!hasDéliContext(norm)) return null;
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
  if (!brand) return null;
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
