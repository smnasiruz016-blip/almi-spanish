// The scoring bridge: turn a raw practice performance into a per-skill estimate on
// the CHOSEN EXAM's scale, then route to that exam's engine. Reading/Listening
// (and CCSE civics) are marked deterministically (correct/total → fraction);
// Writing/Speaking get a quality fraction from the AI grader. The fraction → scale
// step is an honest ESTIMATE (we say so) — practice can't reproduce the official
// calibration, and we never reuse one exam's scale on another.

import type { Exam } from "./exams";
import type { Skill, CefrLevel } from "./cefr";
import { SKILLS } from "./cefr";
import { scoreDele, DELE_SKILL_MAX, DELE_SKILL_FLOOR, deleGroupOf, type DeleResult } from "./engines/dele";
import { scoreSiele, SIELE_SKILL_MAX, type SieleResult } from "./engines/siele";
import { scoreCcseFraction, type CcseResult } from "./engines/ccse";
import type { SpanishSkill } from "@prisma/client";
import { SKILL_SLUG } from "./types";

// Prisma SpanishSkill → the engines' lowercase Skill ("listening"|"reading"|…).
export function toCefrSkill(s: SpanishSkill): Skill {
  return SKILL_SLUG[s] as Skill;
}

// ---- Deterministic marking for objective tasks (Reading / Listening / CCSE) ----
export type AnswerKey = { id: string; answer: string; exact?: boolean };
export type ObjectiveResponse = { answers: Record<string, string | string[]> };

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,;:!?]+$/g, "");
}
function firstValue(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export type MarkResult = {
  correct: number;
  total: number;
  fraction: number;
  detail: { id: string; correct: boolean }[];
};

export function markObjective(key: AnswerKey[], response: ObjectiveResponse): MarkResult {
  let correct = 0;
  const detail: { id: string; correct: boolean }[] = [];
  for (const k of key) {
    const given = firstValue(response.answers[k.id]);
    const ok = k.exact ? given.trim() === k.answer.trim() : normalize(given) === normalize(k.answer);
    if (ok) correct += 1;
    detail.push({ id: k.id, correct: ok });
  }
  const total = key.length || 1;
  return { correct, total: key.length, fraction: correct / total, detail };
}

// ---- Fraction → the exam's per-skill scale ----
export function scaleMax(exam: Exam, _skill: Skill): number {
  if (exam.family === "DELE") return DELE_SKILL_MAX; // /25
  if (exam.family === "SIELE") return SIELE_SKILL_MAX; // /250
  return 25; // CCSE: the practice is the 25-question civic set
}

export function fractionToScore(exam: Exam, skill: Skill, fraction: number): number {
  const f = Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0));
  return Math.round(f * scaleMax(exam, skill));
}

export type ExamScore =
  | { family: "DELE"; result: DeleResult }
  | { family: "SIELE"; result: SieleResult }
  | { family: "CCSE"; result: CcseResult };

// Score a set of per-skill fractions on the exam's scale → the engine result.
// Missing skills default to 0 (so a single-skill practice fills just one). DELE
// needs the LEVEL (its group pairing is level-dependent). CCSE has no four-skill
// structure — it scores the overall civic fraction (reading slot).
export function scoreExam(
  exam: Exam,
  fractions: Partial<Record<Skill, number>>,
  level: CefrLevel,
): ExamScore {
  if (exam.family === "CCSE") {
    const f = fractions.reading ?? fractions.listening ?? 0;
    return { family: "CCSE", result: scoreCcseFraction(f) };
  }
  const scores = {} as Record<Skill, number>;
  for (const s of SKILLS) scores[s] = fractionToScore(exam, s, fractions[s] ?? 0);
  if (exam.family === "DELE") return { family: "DELE", result: scoreDele(scores, level) };
  return { family: "SIELE", result: scoreSiele(scores) };
}

// A compact, storable per-skill estimate for SpanishAttempt.scoreEstimate.
export type SkillEstimate = {
  family: Exam["family"];
  skill: Skill;
  scale: number; // max on this exam scale for this skill
  score: number; // estimated score on that scale
  fraction: number;
  // SIELE
  cefr?: string;
  // DELE
  outOf25?: number;
  group?: "I" | "II";
  belowSkillFloor?: boolean; // below the 25% per-skill floor (6.25/25) → exam fail
  // CCSE
  correct?: number;
  total?: number;
  passed?: boolean;
  note: string;
  confirm: string;
};

// Estimate one skill end-to-end (single-skill practice). DELE needs the level.
export function estimateSkill(
  exam: Exam,
  skill: Skill,
  fraction: number,
  level: CefrLevel,
): SkillEstimate {
  const scored = scoreExam(exam, { [skill]: fraction }, level);
  const score = fractionToScore(exam, skill, fraction);
  const base = {
    family: exam.family,
    skill,
    scale: scaleMax(exam, skill),
    score,
    fraction,
    confirm: scored.result.confirm,
  };

  if (scored.family === "SIELE") {
    const r = scored.result.perSkill[skill];
    return { ...base, cefr: r.cefr, note: `Estimated ${r.score}/250 (around ${r.cefr}) on this skill.` };
  }
  if (scored.family === "DELE") {
    const outOf25 = scored.result.perSkill[skill]; // /25
    const group = deleGroupOf(level, skill);
    const belowSkillFloor = outOf25 < DELE_SKILL_FLOOR;
    return {
      ...base,
      outOf25,
      group,
      belowSkillFloor,
      note: belowSkillFloor
        ? `Estimated ${outOf25}/25 — below the 25% per-skill floor (6.25/25), which alone fails DELE. This skill is in Group ${group}, which also needs 30/50.`
        : `Estimated ${outOf25}/25 on this skill (Group ${group}, which needs 30/50 — 60%).`,
    };
  }
  // CCSE — civic set, scored on the 25-question scale.
  const r = scored.result;
  return {
    ...base,
    correct: r.correct,
    total: r.total,
    passed: r.passed,
    note: r.message,
  };
}
