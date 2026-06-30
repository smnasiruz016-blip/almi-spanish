// Shared CEFR primitives for the Spanish exam engines. CEFR (A1–C2) is the common
// scale across DELE and SIELE. (CCSE is NOT a CEFR test — it is a civic-knowledge
// test, scored separately in engines/ccse.ts.) These are scale definitions only;
// the per-exam score→level mapping lives in the engine files.

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const CEFR_LABEL: Record<CefrLevel, string> = {
  A1: "A1 — Acceso (Beginner)",
  A2: "A2 — Plataforma (Elementary)",
  B1: "B1 — Umbral (Intermediate)",
  B2: "B2 — Avanzado (Upper Intermediate)",
  C1: "C1 — Dominio operativo (Advanced)",
  C2: "C2 — Maestría (Mastery)",
};

// The four skills, with the Spanish exam names.
export const SKILLS = ["listening", "reading", "writing", "speaking"] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_ES: Record<Skill, string> = {
  listening: "Comprensión auditiva",
  reading: "Comprensión de lectura",
  writing: "Expresión e interacción escritas",
  speaking: "Expresión e interacción orales",
};

export const SKILL_EN: Record<Skill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

// APPROXIMATE SIELE-points (0–250 per skill) → CEFR bridge. SIELE Global certifies
// A1–C1 (it does NOT certify C2). The OFFICIAL per-skill cut-scores live in the
// SIELE "score levels" table on siele.org (siele.org/en/examen — a downloadable
// PDF, not transcribed in public search results). This evenly distributed bridge is
// labelled an estimate (SIELE_BRIDGE_VERIFIED = false) and must be replaced with the
// official table before launch — never presented as the official mapping (honesty
// doctrine). A score in the top band reads "C1 or above".
export const SIELE_BRIDGE_VERIFIED = false;
export function sielePointsToCefr(points: number): CefrLevel {
  const p = Math.max(0, Math.min(250, Number.isFinite(points) ? points : 0));
  if (p >= 200) return "C1"; // C1 (SIELE's top certified band; C2 not covered)
  if (p >= 158) return "B2";
  if (p >= 116) return "B1";
  if (p >= 74) return "A2";
  return "A1";
}

// Confirm-with-the-body line reused across engine outputs (honesty doctrine).
// Admission/registration is not a visa — confirm with the official body.
export const CONFIRM_LINE =
  "This is a practice estimate, not an official result. Confirm the real requirement with Instituto Cervantes / Universidad de Salamanca (DELE), siele.org (SIELE), or the Spanish Ministry of Interior (CCSE) — and, for nationality, residence or study, with the Spanish consulate, registro civil, or your university.";
