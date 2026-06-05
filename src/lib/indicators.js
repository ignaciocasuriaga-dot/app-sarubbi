// Indicadores derivados sobre items enriquecidos.
import { benchmarkBrandForSegment, competitiveSegment, liquidProfile } from './normalize.js';

function median(nums) {
  const a = nums.filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

// Indice de precio base 100 por segmento competitivo.
// Permite que un segmento use una base oficial de otro segmento del mismo rubro.
export function priceIndex(items) {
  const bySeg = new Map();
  for (const it of items) {
    const profile = liquidProfile(it);
    if (!profile) continue;
    const seg = competitiveSegment(it);
    if (!bySeg.has(seg.key)) bySeg.set(seg.key, { key: seg.key, label: seg.label, category: it.category, brands: new Map() });
    const g = bySeg.get(seg.key);
    if (!g.brands.has(it.brand)) {
      g.brands.set(it.brand, { brand: it.brand, brandLabel: it.brandLabel || it.brand, owner: it.owner || it.group, ppls: [] });
    }
    g.brands.get(it.brand).ppls.push(profile.pricePerLiter);
  }

  const segmentBrands = new Map();
  for (const g of bySeg.values()) {
    const brands = [...g.brands.values()]
      .map((b) => ({ brand: b.brand, brandLabel: b.brandLabel, owner: b.owner, ppl: median(b.ppls), n: b.ppls.length }))
      .filter((b) => b.ppl != null);
    segmentBrands.set(g.key, brands);
  }

  const groups = [];
  for (const g of bySeg.values()) {
    const brands = segmentBrands.get(g.key) || [];
    const benchName = benchmarkBrandForSegment(g.key);
    const sameSegmentBase = brands.find((b) => b.brand === benchName);
    const crossSegmentBase = sameSegmentBase ? null : [...bySeg.values()]
      .filter((entry) => entry.category === g.category)
      .flatMap((entry) => segmentBrands.get(entry.key) || [])
      .filter((b) => b.brand === benchName)
      .sort((a, b) => b.n - a.n)[0];
    if (brands.length < 2 && !crossSegmentBase) continue;

    const base = sameSegmentBase || crossSegmentBase || brands.slice().sort((a, b) => b.n - a.n)[0];
    const rows = brands
      .map((b) => ({ ...b, ppl: Math.round(b.ppl), index: Math.round((b.ppl / base.ppl) * 100), isBase: b.brand === base.brand }))
      .sort((a, b) => b.index - a.index);
    groups.push({ key: g.key, label: g.label, category: g.category, baseLabel: base.brandLabel, rows });
  }
  return groups.sort((a, b) => String(a.category).localeCompare(String(b.category)) || a.label.localeCompare(b.label));
}
