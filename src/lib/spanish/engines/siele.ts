// ENGINE B — SIELE (Servicio Internacional de Evaluación de la Lengua Española).
// A PLACEMENT, not a pass/fail exam — it certifies your level at the moment you
// sit it. Backed by Instituto Cervantes, UNAM (Mexico), Universidad de
// Salamanca and Universidad de Buenos Aires — so its audio/usage is pan-Hispanic.
//
// Scale: SIELE Global = 0–1000, each of the 4 skills 0–250. NO pass/fail. Maps to
// CEFR A1–C1 (SIELE Global does NOT certify C2). Certificate valid 5 YEARS (unlike
// the lifetime DELE diploma).
//   • Reading / Listening: auto-scored → (correct × 250) / questions.
//   • Writing / Speaking: trained scorers, 0–5 per criterion → weighted to /250.
// Honest output: a per-skill score (/250) with its CEFR band, plus the /1000 total
// and an overall CEFR — never a fabricated "pass".

import type { Skill, CefrLevel } from "../cefr";
import { SKILLS, sielePointsToCefr, SIELE_BRIDGE_VERIFIED, CONFIRM_LINE } from "../cefr";

export const SIELE_SKILL_MAX = 250;
export const SIELE_TOTAL_MAX = 1000;
export const SIELE_VALID_YEARS = 5;
export const SIELE_TOP_CEFR: CefrLevel = "C1"; // SIELE Global ceiling

export type SieleSkillScores = Record<Skill, number>; // each 0–250

export type SieleSkillResult = {
  score: number; // /250
  outOf: number; // 250
  cefr: CefrLevel;
};

export type SieleResult = {
  exam: "SIELE";
  perSkill: Record<Skill, SieleSkillResult>;
  total: number; // /1000
  totalOutOf: number; // 1000
  overallCefr: CefrLevel; // weakest-skill CEFR (honest floor)
  noPassFail: true;
  validYears: number;
  bridgeVerified: boolean;
  note: string;
  confirm: string;
};

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(SIELE_SKILL_MAX, n));
}

const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function scoreSiele(scores: SieleSkillScores): SieleResult {
  const perSkill = {} as Record<Skill, SieleSkillResult>;
  for (const s of SKILLS) {
    const score = clamp(scores[s]);
    perSkill[s] = { score, outOf: SIELE_SKILL_MAX, cefr: sielePointsToCefr(score) };
  }

  const total = SKILLS.reduce((sum, s) => sum + perSkill[s].score, 0); // /1000
  // Overall CEFR = the weakest skill's band — honest (SIELE Global reports per
  // skill, and a level claim is only as strong as the weakest skill).
  const overallCefr = SKILLS.reduce<CefrLevel>((min, s) => {
    return CEFR_ORDER.indexOf(perSkill[s].cefr) < CEFR_ORDER.indexOf(min) ? perSkill[s].cefr : min;
  }, "C1");

  return {
    exam: "SIELE",
    perSkill,
    total,
    totalOutOf: SIELE_TOTAL_MAX,
    overallCefr,
    noPassFail: true,
    validYears: SIELE_VALID_YEARS,
    bridgeVerified: SIELE_BRIDGE_VERIFIED,
    note: `SIELE has no pass or fail — it places you on a 0–1000 scale (0–250 per skill) and maps to CEFR A1–C1. This certificate is valid ${SIELE_VALID_YEARS} years. The points→CEFR bands shown here are an estimate pending the official SIELE score-levels table (siele.org/examen).`,
    confirm: CONFIRM_LINE,
  };
}
