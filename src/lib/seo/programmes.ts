// Cluster A — named degree programmes from Spanish open-data catalogues, licence-clean
// ONLY (CC-BY / CC-BY-SA / CC0 / ODC-BY): datos.um.es (Murcia), Junta de Castilla y
// León, Universidad de Granada, opendata.unex.es (Extremadura), Institut Cartogràfic
// Valencià / GVA (9 Valencian universities). 2,024 real programmes across 25
// universities. Per-source attribution is carried on every row and shown on the page.
//
// These are PROGRAMME-LEVEL pages: we name the real programme, but we do NOT invent its
// exact Spanish entry level — the honest line is "commonly DELE B2 for a Spanish-taught
// programme, confirm with the university". Granada rows are 2015/16 vintage (dated).

import progData from "@/data/spanish-programmes.json";

export type Programme = {
  slug: string;
  name: string;
  level: string; // Grado | Máster | Doctorado | Doble Grado | Pregrado | Posgrado | …
  university: string;
  country: { iso2: string; name: string }; // destination country (ES or a LatAm country)
  region: string;
  source: { publisher: string; url: string };
  dated?: boolean; // true => older catalogue vintage, noindex
};

export const PROGRAMMES = progData as Programme[];
export const PROGRAMME_COUNT = PROGRAMMES.length;

const BY_SLUG = new Map(PROGRAMMES.map((p) => [p.slug, p]));
export function findProgramme(slug: string): Programme | undefined {
  return BY_SLUG.get(slug);
}

// Group by university for indexes / internal linking.
export function programmesByUniversity(): Map<string, Programme[]> {
  const m = new Map<string, Programme[]>();
  for (const p of PROGRAMMES) {
    const arr = m.get(p.university) ?? [];
    arr.push(p);
    m.set(p.university, arr);
  }
  return m;
}

// Honest programme-level language line. We name the real programme but never fabricate
// its exact required level.
export function programmeLanguageLine(p: Programme): string {
  return (
    `${p.name} is taught in Spanish at ${p.university}. Universities in ${p.country.name} commonly ask for ` +
    `around DELE B2 (or an equivalent SIELE level) for a Spanish-taught ${p.level.toLowerCase()}, but the ` +
    `exact requirement is set by the programme — confirm it with ${p.university}.`
  );
}

// Indexable unless it's a dated (Granada 2015/16) row.
export function isIndexableProgramme(p: Programme): boolean {
  return !p.dated;
}
