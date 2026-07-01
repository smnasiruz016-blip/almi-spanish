// Cluster B — destination universities (Spanish-speaking world), sourced from the
// AlmiStudy curated publishable set (already live, licence-clean: factual university
// facts with per-row source provenance). 465 universities across 20 Spanish-speaking
// countries (Spain + Ibero-America + Equatorial Guinea).
//
// These are UNI-LEVEL pages: we do NOT invent a per-programme Spanish level. The
// honest line is "commonly DELE B2 for a Spanish-taught degree — confirm with the
// university". Where real named-programme data exists (Cluster A, datos.gob.es) that
// upgrades to programme-level; everything else stays uni-level here.

import uniData from "@/data/spanish-universities.json";

export type University = {
  slug: string;
  name: string;
  city: string | null;
  country: { iso2: string; name: string; slug: string };
  region: string | null;
  controlType: string | null;
  officialWebsite: string | null;
  subjects: string[];
  verified: boolean; // false => noindex (site never verified)
  source: { title: string | null; publisher: string | null; url: string | null } | null;
};

export const UNIVERSITIES = uniData as University[];
export const UNIVERSITY_COUNT = UNIVERSITIES.length;

const BY_SLUG = new Map(UNIVERSITIES.map((u) => [u.slug, u]));
export function findUniversity(slug: string): University | undefined {
  return BY_SLUG.get(slug);
}

// Group for indexes / internal linking.
export function universitiesByCountry(): Map<string, University[]> {
  const m = new Map<string, University[]>();
  for (const u of UNIVERSITIES) {
    const arr = m.get(u.country.name) ?? [];
    arr.push(u);
    m.set(u.country.name, arr);
  }
  return m;
}

// Honest, uni-level language line. NEVER a fabricated per-programme requirement.
export function languageLine(u: University): string {
  return (
    `${u.name} teaches primarily in Spanish. For a Spanish-taught degree, universities in ` +
    `${u.country.name} commonly ask for around DELE B2 (or an equivalent level on SIELE), but the ` +
    `exact requirement is set per programme — confirm it directly with ${u.name}. English-taught ` +
    `programmes may set their own, separate requirement.`
  );
}
