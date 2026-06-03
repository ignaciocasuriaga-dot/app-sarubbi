// Portfolio Sarubbi – buscar por nombre de marca, aceptar todos sus productos.

export const CATEGORY_LABEL = {
  jamon_cocido: 'Jamón Cocido',
  jamon_crudo: 'Jamón Crudo',
  panchos: 'Panchos / Frankfurter',
  jamon_cocido_fetas: 'Jamón Cocido en Fetas',
  chorizo: 'Chorizo',
  hamburguesas: 'Hamburguesas Congeladas',
  empanadas: 'Empanadas Congeladas',
  mortadelin_pate: 'Pack Mortadelin + Paté',
  factura_seca: 'Factura Seca',
  salames: 'Salames / Salami',
  panceta: 'Panceta',
  mortadela: 'Mortadela',
  otros: 'Otros Productos',
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

const BRAND_DEFINITIONS = [
  { name: 'sarubbi',    label: 'Sarubbi',              owner: 'sarubbi',     company: 'sarubbi',    aliases: ['sarubbi'] },
  { name: 'schneck',    label: 'Schneck',              owner: 'competencia', company: 'schneck',    aliases: ['schneck'] },
  { name: 'centenario', label: 'Alimentos Centenario', owner: 'competencia', company: 'centenario', aliases: ['centenario', 'alimentos centenario'] },
  { name: 'cattivelli', label: 'Cattivelli',           owner: 'competencia', company: 'cattivelli', aliases: ['cattivelli', 'cativelli'] },
  { name: 'ottonello',  label: 'Ottonello',            owner: 'competencia', company: 'ottonello',  aliases: ['ottonello', 'otonello'] },
  { name: 'camposur',   label: 'Camposur',             owner: 'competencia', company: 'camposur',   aliases: ['camposur', 'campo sur'] },
  { name: 'constancia', label: 'La Constancia',        owner: 'competencia', company: 'constancia', aliases: ['la constancia', 'constancia'] },
];

const sarubbiBrands    = BRAND_DEFINITIONS.filter((b) => b.owner === 'sarubbi').map((b) => b.name);
const competitorBrands = BRAND_DEFINITIONS.filter((b) => b.owner === 'competencia').map((b) => b.name);

export const BRAND_GROUPS = { sarubbi: sarubbiBrands, competencia: competitorBrands };
export const ALL_BRANDS   = [...sarubbiBrands, ...competitorBrands];

// Solo buscar por nombre de marca; el super devuelve todos sus productos.
export const SEARCH_TERMS = [
  'sarubbi',
  'schneck',
  'centenario',
  'cattivelli',
  'ottonello',
  'camposur',
  'constancia',
];

const CATEGORY_KEYWORDS = [
  { cat: 'jamon_cocido_fetas', rx: /feta|feteado|en\s+fetas/i },
  { cat: 'jamon_cocido',       rx: /jamon\s+cocido|jam[oó]n\s+york/i },
  { cat: 'jamon_crudo',        rx: /jamon\s+crudo|jam[oó]n\s+crudo|serrano/i },
  { cat: 'panchos',            rx: /pancho|frankfurter|frankfurt|viena|salchicha/i },
  { cat: 'chorizo',            rx: /chorizo/i },
  { cat: 'hamburguesas',       rx: /hamburguesa|burger/i },
  { cat: 'empanadas',          rx: /empanada/i },
  { cat: 'mortadelin_pate',    rx: /mortadelin/i },
  { cat: 'factura_seca',       rx: /salamin|fuet|chacarero|cantimpalo|longaniza/i },
  { cat: 'salames',            rx: /\bsalame\b|\bsalami\b|\bsalames\b/i },
  { cat: 'panceta',            rx: /panceta|pancetta/i },
  { cat: 'mortadela',          rx: /\bmortadela\b/i },
];

function stripAccents(s) {
  return String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MATCHERS = BRAND_DEFINITIONS.flatMap((b) =>
  b.aliases.map((alias) => ({
    brand: b.name,
    length: alias.length,
    rx: new RegExp('\\b' + stripAccents(alias).toLowerCase().split(/\s+/).map(escapeRegex).join('[\\s-]+') + '\\b', 'i'),
  })),
).sort((a, b) => b.length - a.length);

export function matchedBrand(text) {
  if (!text) return null;
  const norm = stripAccents(text).toLowerCase();
  return MATCHERS.find((m) => m.rx.test(norm))?.brand ?? null;
}

export const matchedPortfolio = matchedBrand;

export function brandGroup(brand) {
  if (sarubbiBrands.includes(brand))    return 'sarubbi';
  if (competitorBrands.includes(brand)) return 'competencia';
  return null;
}

function detectCategory(text) {
  const norm = stripAccents(String(text ?? '')).toLowerCase();
  return CATEGORY_KEYWORDS.find(({ rx }) => rx.test(norm))?.cat ?? 'otros';
}

export function enrichProduct(item, text) {
  const norm = stripAccents(String(text ?? item?.name ?? '')).toLowerCase();
  const brand = matchedBrand(norm);
  if (!brand) return null;
  const def = BRAND_DEFINITIONS.find((b) => b.name === brand);
  const cat  = detectCategory(text ?? item?.name);
  return {
    ...item,
    brand,
    brandLabel:   def?.label ?? brand,
    group:        def?.owner ?? 'competencia',
    owner:        def?.owner ?? 'competencia',
    company:      def?.company ?? brand,
    companyLabel: COMPANY_LABEL[def?.company] ?? brand,
    category:     cat,
    categoryLabel: CATEGORY_LABEL[cat] ?? 'Otros Productos',
  };
}

export const CATEGORY_GROUPS = Object.fromEntries(
  Object.keys(CATEGORY_LABEL).map((cat) => [cat, ALL_BRANDS]),
);
