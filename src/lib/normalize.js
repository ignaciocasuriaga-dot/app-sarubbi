// Normalizacion compartida para identidad, presentacion y metricas Sarubbi.

function deaccent(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const BRAND_WORDS = /\b(sarubbi|schneck|centenario|alimentos centenario|cattivelli|cativelli|ottonello|otonello|camposur|campo sur|constancia|la constancia|picorel|picorell)\b/g;
const GENERIC_WORDS = /\b(jamon|cocido|crudo|fiambre|feteado|fetas|pancho|panchos|frankfurter|salchicha|salame|salamin|chorizo|mortadela|panceta|hamburguesa|empanada|carne|corte|congelado|congelada|pack|unidad|unidades|aprox|peso|neto)\b/g;

export function extractSizeMl(_name) {
  return null;
}

export function comparableProfile(itemOrName) {
  const name = typeof itemOrName === 'string' ? itemOrName : itemOrName?.name;
  const price = typeof itemOrName === 'object' ? Number(itemOrName.price) : null;
  const text = deaccent(name).toLowerCase().replace(',', '.');

  let match = text.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|kilos)\b/);
  if (match) {
    const grams = Math.round(Number(match[1]) * 1000);
    return weightProfile({ grams, price });
  }

  match = text.match(/(\d+(?:\.\d+)?)\s*(g|gr|gramos)\b/);
  if (match) {
    const grams = Math.round(Number(match[1]));
    return weightProfile({ grams, price });
  }

  match = text.match(/\bx\s*(\d{1,2})\b/) || text.match(/(\d{1,2})\s*(u|un|unid|unidades)\b/);
  if (match) {
    const count = Number(match[1]);
    if (Number.isFinite(count) && count > 0) {
      return {
        metric: 'unit',
        unitMl: count,
        units: count,
        totalMl: count,
        bucket: { value: count, min: count, max: count, label: `${count} un.` },
        pricePerLiter: Number.isFinite(price) ? price / count : null,
        metricLabel: '$/unidad',
      };
    }
  }

  return {
    metric: 'item',
    unitMl: 1,
    units: 1,
    totalMl: 1,
    bucket: { value: 1, min: 1, max: 1, label: 'Unidad' },
    pricePerLiter: Number.isFinite(price) ? price : null,
    metricLabel: '$/unidad',
  };
}

function weightProfile({ grams, price }) {
  if (!Number.isFinite(grams) || grams <= 0) return null;
  const bucket = weightBucket(grams);
  const pricePerKg = Number.isFinite(price) ? price / (grams / 1000) : null;
  return {
    metric: 'kg',
    unitMl: grams,
    units: 1,
    totalMl: grams,
    bucket,
    pricePerLiter: pricePerKg,
    pricePerKg,
    pricePer100g: pricePerKg == null ? null : pricePerKg / 10,
    metricLabel: '$/kg',
  };
}

function weightBucket(grams) {
  const buckets = [
    { value: 100, min: 1, max: 150, label: 'hasta 150 g' },
    { value: 200, min: 151, max: 275, label: '151-275 g' },
    { value: 350, min: 276, max: 425, label: '276-425 g' },
    { value: 500, min: 426, max: 650, label: '426-650 g' },
    { value: 800, min: 651, max: 900, label: '651-900 g' },
    { value: 1000, min: 901, max: 1250, label: '1 kg aprox.' },
    { value: 1500, min: 1251, max: 1750, label: '1,25-1,75 kg' },
    { value: 2000, min: 1751, max: 2500, label: '2 kg aprox.' },
  ];
  return buckets.find((bucket) => grams >= bucket.min && grams <= bucket.max)
    || { value: grams, min: grams, max: grams, label: `${grams.toLocaleString('es-UY')} g` };
}

export function normalizeName(name, brandLabel = '') {
  let value = deaccent(name).toLowerCase();
  const brand = deaccent(brandLabel).toLowerCase().trim();
  if (brand) value = value.split(brand).join(' ');
  return value
    .replace(BRAND_WORDS, ' ')
    .replace(/\d+(?:[.,]\d+)?\s*(kg|kilo|kilos|g|gr|gramos|u|un|unid|unidades|x\s*\d+)\b/g, ' ')
    .replace(GENERIC_WORDS, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalKey(item) {
  const profile = comparableProfile(item);
  return [
    item.brand || '',
    item.category || '',
    profile?.metric || 'item',
    profile?.bucket?.value ?? '?',
    normalizeName(item.name, item.brandLabel || item.brand || ''),
  ].join('|');
}

export const SEGMENT_LABEL = {
  jamon_cocido: 'Jamon cocido',
  jamon_crudo: 'Jamon crudo',
  panchos: 'Panchos y frankfurters',
  salames: 'Salames y salamines',
  chorizos: 'Chorizos',
  mortadela: 'Mortadela',
  panceta: 'Panceta',
  fiambres: 'Fiambres y feteados',
  hamburguesas: 'Hamburguesas',
  empanadas: 'Empanadas',
  carnes: 'Carnes y cortes',
  congelados: 'Congelados',
  otros: 'Otros',
};

const BENCHMARK_BY_CATEGORY = {
  jamon_cocido: 'schneck',
  jamon_crudo: 'schneck',
  panchos: 'schneck',
  salames: 'schneck',
  chorizos: 'schneck',
  mortadela: 'ottonello',
  panceta: 'ottonello',
  fiambres: 'schneck',
  hamburguesas: 'cattivelli',
  empanadas: 'cattivelli',
  carnes: 'camposur',
  congelados: 'cattivelli',
  otros: 'schneck',
};

export const BENCHMARK_BRAND = Object.fromEntries(
  Object.entries(BENCHMARK_BY_CATEGORY).map(([category, brand]) => [`${category}_general`, brand]),
);

export function benchmarkBrandForSegment(segmentKey) {
  const category = String(segmentKey || '').split('_presentacion_')[0]?.replace(/_general$/, '') || 'otros';
  return BENCHMARK_BRAND[segmentKey] || BENCHMARK_BY_CATEGORY[category] || 'schneck';
}

export function competitiveSegment(item) {
  const category = item.category || 'otros';
  const profile = comparableProfile(item);
  const key = profile?.bucket?.value
    ? `${category}_presentacion_${profile.metric}_${profile.bucket.value}`
    : `${category}_general`;
  const base = SEGMENT_LABEL[category] || category;
  const label = profile?.bucket?.label ? `${base} / ${profile.bucket.label}` : base;
  return { key, label };
}

// Nombre heredado por compatibilidad con modulos anteriores.
export function liquidProfile(item) {
  if (item?.price == null) return null;
  const profile = comparableProfile(item);
  if (!profile || profile.pricePerLiter == null || !Number.isFinite(profile.pricePerLiter)) return null;
  return profile;
}
