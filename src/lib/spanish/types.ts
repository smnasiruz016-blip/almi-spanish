// Practice-layer types for AlmiSpanish. CEFR levels + the four Spanish skills, plus
// the per-task payload (stimulus + answer key) and response shapes. The scoring
// lives in src/lib/spanish/engines (DELE / SIELE / CCSE) — there is NO single
// pass mark; each exam scores on its own scale (DELE pass/fail per-group floor,
// SIELE 0–1000 placement, CCSE civic 15/25), and we always tell the user to
// confirm the real requirement with the official body.

import type { CefrLevel, SpanishSkill, SpanishTaskType } from "@prisma/client";

export type { CefrLevel, SpanishSkill, SpanishTaskType } from "@prisma/client";

// The four skills, in the order a full mock runs them.
export const SKILL_ORDER: SpanishSkill[] = [
  "COMPRENSION_AUDITIVA",
  "COMPRENSION_LECTORA",
  "EXPRESION_ESCRITA",
  "EXPRESION_ORAL",
];

// Objective (auto-marked, free) vs productive (AI-graded, Pro).
export const OBJECTIVE_SKILLS: SpanishSkill[] = ["COMPRENSION_AUDITIVA", "COMPRENSION_LECTORA"];
export const PRODUCTIVE_SKILLS: SpanishSkill[] = ["EXPRESION_ESCRITA", "EXPRESION_ORAL"];

export function isObjective(skill: SpanishSkill): boolean {
  return OBJECTIVE_SKILLS.includes(skill);
}

export const SKILL_LABEL: Record<SpanishSkill, string> = {
  COMPRENSION_AUDITIVA: "Comprensión auditiva (Listening)",
  COMPRENSION_LECTORA: "Comprensión de lectura (Reading)",
  EXPRESION_ESCRITA: "Expresión escrita (Writing)",
  EXPRESION_ORAL: "Expresión oral (Speaking)",
};

export const SKILL_SLUG: Record<SpanishSkill, string> = {
  COMPRENSION_AUDITIVA: "listening",
  COMPRENSION_LECTORA: "reading",
  EXPRESION_ESCRITA: "writing",
  EXPRESION_ORAL: "speaking",
};

export const LEVEL_LABEL: Record<CefrLevel, string> = {
  A1: "A1 — Acceso",
  A2: "A2 — Plataforma",
  B1: "B1 — Umbral",
  B2: "B2 — Avanzado",
  C1: "C1 — Dominio operativo",
  C2: "C2 — Maestría",
};

export const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

// ---- Per-task payload (stimulus + answer key) and response shapes ----
// payload lives on SpanishItem.payload; response on SpanishAttempt.response. Answer
// keys inside payloads are stripped server-side before reaching the client.

export type Speaker = { role: string; voice: string };
export type McqOption = { id: string; text: string };

// Comprensión de lectura (Reading) — Spanish passages + questions. CCSE civic
// items reuse this shape (a short civic statement + a multiple-choice question).
export type ReadingText = { id: string; heading?: string; body: string };
export type ReadingQuestion = {
  id: string;
  kind: "mcq" | "match" | "truefalse";
  stem: string;
  options?: McqOption[];
  answer: string; // option id / "true"|"false" — stripped before client send
};
export type ReadingPayload = {
  passages: ReadingText[];
  questions: ReadingQuestion[];
};

// Comprensión auditiva (Listening) — Spanish audio (pan-Hispanic TTS) + questions.
export type ListeningQuestion = {
  id: string;
  stem: string;
  options: McqOption[];
  answer: string; // option id — stripped before client send
};
export type ListeningPayload = {
  audioScript: string;
  speakers: Speaker[];
  questions: ListeningQuestion[];
};

// Expresión escrita (Writing) — level + exam aware producción escrita.
export type WritingPayload = {
  situation: string;
  instruction: string;
  wordMin: number;
  wordMax: number;
};
export type WritingResponse = { text: string };

// Expresión oral (Speaking) — monólogo / conversación; some show an image.
export type SpeakingPayload = {
  taskPrompt: string;
  prepSeconds: number;
  speakSeconds: number;
  imageUrl?: string;
  imageAlt?: string;
};
export type SpeakingResponse = { transcript: string };

// Objective (Reading/Listening/CCSE) response.
export type ObjectiveResponse = { answers: Record<string, string | string[]> };
