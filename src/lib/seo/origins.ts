// Wave-2 SEO — origin countries (196) for "study in Spain from [origin]".
//
// Built by scripts/seo/build-origins (from the family ISO base) with ONLY
// verifiable, honest per-origin facts:
//   - isEU:     EU/EEA/Switzerland nationals use free movement (no student visa);
//               everyone else needs a Spanish "visado de estudios" for courses >90 days.
//   - natYears: 2-year naturalisation fast-track (Código Civil art. 22.1: Ibero-American
//               nationals + Portugal, Andorra, Philippines, Equatorial Guinea) vs 10-year
//               general. This is a REQUIREMENT track, never a guarantee.
//   - native search phrasing in the origin's own real search language — never a
//     country-name swap.
//
// Every origin page must draw its corridor line + nationality line + native wording
// from HERE, so no page is a template with the country name find-replaced.

import originsData from "@/data/origins.json";

export type Origin = {
  slug: string;
  name: string;
  iso2: string;
  region: string;
  isEU: boolean;        // EU/EEA/Switzerland — free movement, no student visa
  natYears: 2 | 10;     // Spanish naturalisation residence track (requirement, not guarantee)
  lang: string;         // origin's real search language (ISO 639-1-ish)
  langLabel: string;    // human label for that language
  nativeStudy: string;  // native phrasing for "study in Spain"
  nativeExam: string;   // native phrasing for "Spanish exam (DELE)"
};

export const ORIGINS = originsData as Origin[];
export const ORIGIN_COUNT = ORIGINS.length;

const BY_SLUG = new Map(ORIGINS.map((o) => [o.slug, o]));
const BY_ISO2 = new Map(ORIGINS.map((o) => [o.iso2, o]));
export function findOrigin(slug: string): Origin | undefined {
  return BY_SLUG.get(slug);
}
export function findOriginByIso2(iso2: string): Origin | undefined {
  return BY_ISO2.get(iso2);
}

// Countries where Spanish is an official language. Their nationals are generally
// EXEMPT from the DELE A2 language requirement for Spanish naturalisation (they are
// already Spanish-speaking) — but the CCSE civic test still applies to virtually
// everyone. NOTE this is distinct from the 2-year residence track: Brazil, Portugal,
// the Philippines and Andorra get the fast track (natYears===2) but are NOT
// Spanish-official, so their nationals normally still sit DELE A2.
const SPANISH_OFFICIAL = new Set([
  "AR","BO","CL","CO","CR","CU","DO","EC","SV","GT","HN","MX","NI","PA","PY","PE","UY","VE","GQ",
]);

// True if this origin's nationals are generally exempt from DELE A2 for nationality.
export function deleExemptForNationality(o: Origin): boolean {
  return SPANISH_OFFICIAL.has(o.iso2);
}

// Honest student-entry route for an origin. Binary and verifiable: EU/EEA/Swiss
// free movement vs the Spanish student visa (estancia por estudios) for >90 days.
export function visaRoute(o: Origin): {
  short: string;
  line: string;
} {
  if (o.isEU) {
    return {
      short: "EU/EEA free movement",
      line:
        `As an EU/EEA/Swiss national you don't need a student visa to study in Spain — ` +
        `you register (empadronamiento / NIE) for stays over three months. No DELE is legally ` +
        `required for entry; a university may still ask for proof of Spanish for a Spanish-taught degree.`,
    };
  }
  return {
    short: "Student visa (visado de estudios)",
    line:
      `From ${o.name} you'll normally need a Spanish student visa (visado de estudios / estancia por ` +
      `estudios) for a course longer than 90 days, applied for at the Spanish consulate. The visa itself ` +
      `has no DELE requirement — the language proof, if any, is set by the university for the programme.`,
  };
}

// Honest nationality line. DELE A2 + CCSE are REQUIREMENTS for naturalisation by
// residence, never a guarantee, and SIELE is NOT accepted for nationality.
export function nationalityLine(o: Origin): {
  short: string;
  line: string;
} {
  if (o.natYears === 2) {
    return {
      short: "2-year residence track",
      line:
        `Nationals of ${o.name} can generally apply for Spanish nationality after 2 years of legal ` +
        `residence (Código Civil art. 22.1 — Ibero-American and related countries), instead of the general 10. ` +
        `Either way, adults from non-Spanish-speaking backgrounds must pass DELE A2 (or higher) and the CCSE ` +
        `civic test. These are requirements, not a guarantee — the decision rests with the authorities, and ` +
        `SIELE is not accepted for nationality.`,
    };
  }
  return {
    short: "10-year residence track",
    line:
      `Nationals of ${o.name} generally need 10 years of legal residence before applying for Spanish ` +
      `nationality. Adults must also pass DELE A2 (or higher) and the CCSE civic test. These are ` +
      `requirements, not a guarantee — the decision rests with the authorities, and SIELE is not accepted ` +
      `for nationality.`,
  };
}

// Every origin carries a real corridor (visa route), a real nationality track, and
// native search wording, so every origin page is substantive and indexable.
export function isIndexableOrigin(_o: Origin): boolean {
  return true;
}
export const INDEXABLE_ORIGINS = ORIGINS;

// Stable region order for grouping selectors (mirrors the family base).
export const REGION_ORDER = [
  "Sub-Saharan Africa", "Northern Africa", "Western Asia", "Southern Asia",
  "South-eastern Asia", "Eastern Asia", "Central Asia", "Eastern Europe",
  "Southern Europe", "Western Europe", "Northern Europe", "Northern America",
  "Latin America and the Caribbean", "Australia and New Zealand", "Melanesia",
  "Micronesia", "Polynesia", "Other",
];
