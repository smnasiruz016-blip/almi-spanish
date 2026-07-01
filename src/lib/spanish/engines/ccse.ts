// ENGINE C — CCSE (Conocimientos Constitucionales y Socioculturales de España).
// This is a CIVIC-KNOWLEDGE test, NOT a CEFR language test. It is administered by
// Instituto Cervantes on behalf of the Spanish Ministry of Justice, and paired
// with DELE A2 as the language+civics route to Spanish nationality.
//
// Format (VERIFIED): 25 multiple-choice / true-false questions, drawn from the
// official public pool of 300 questions ("manual" / tarea pool) published by the
// Instituto Cervantes. PASS = 15/25 correct (60%). The pool is updated annually
// (a new "convocatoria" manual each year) — practice content must track the
// CURRENT official pool, and civic answers must match the official curriculum
// EXACTLY. Never fabricate a civic fact or answer.
//
// There are no skills and no CEFR band here — only correct/25 and APTO/NO APTO.

import { CONFIRM_LINE } from "../cefr";

export const CCSE_VERIFIED = true;
export const CCSE_QUESTIONS = 25;
export const CCSE_PASS = 15; // 15/25 = 60%
export const CCSE_POOL_SIZE = 300; // official public question pool

export type CcseResult = {
  exam: "CCSE";
  correct: number;
  total: number; // 25
  pass: number; // 15
  passed: boolean;
  apto: "APTO" | "NO APTO";
  isLanguageTest: false;
  message: string;
  pairingNote: string;
  sourceNote: string;
  confirm: string;
};

export function scoreCcse(correct: number, total: number = CCSE_QUESTIONS): CcseResult {
  const t = total > 0 ? total : CCSE_QUESTIONS;
  const c = Math.max(0, Math.min(t, Number.isFinite(correct) ? Math.round(correct) : 0));
  // The pass mark scales with the question count if a shorter practice set is used.
  const pass = Math.ceil((CCSE_PASS / CCSE_QUESTIONS) * t);
  const passed = c >= pass;

  return {
    exam: "CCSE",
    correct: c,
    total: t,
    pass,
    passed,
    apto: passed ? "APTO" : "NO APTO",
    isLanguageTest: false,
    message: passed
      ? `Estimated APTO: ${c}/${t} correct (pass is ${pass}/${t}).`
      : `Estimated NO APTO: ${c}/${t} correct — you need ${pass}/${t} to pass.`,
    pairingNote:
      "CCSE tests civic knowledge (the Spanish constitution + society), not language. For Spanish nationality it is paired with DELE A2 (the language requirement) for applicants who are not from a Spanish-speaking country.",
    sourceNote:
      "Practice uses original questions covering the official CCSE curriculum (temario 2026) published by the Instituto Cervantes — never the official questions themselves. The pool is updated annually — confirm you are studying the current convocatoria.",
    confirm: CONFIRM_LINE,
  };
}

// Helper for the scoring bridge: turn an objective fraction (correct/total over a
// practice set of any length) into a CCSE result on the real 25-question scale.
export function scoreCcseFraction(fraction: number): CcseResult {
  const f = Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0));
  return scoreCcse(Math.round(f * CCSE_QUESTIONS), CCSE_QUESTIONS);
}
