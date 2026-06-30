// The three honest Spanish scoring engines, and the routing from an exam to its
// engine. Spanish is NOT one exam with one pass mark — each scores differently, so
// each routes to its own engine. We NEVER reuse one exam's scale on another.

export * from "./dele";
export * from "./siele";
export * from "./ccse";

export type EngineId = "A" | "B" | "C"; // A=DELE, B=SIELE, C=CCSE
export type ExamFamily = "DELE" | "SIELE" | "CCSE";

export const ENGINE_FOR_FAMILY: Record<ExamFamily, EngineId> = {
  DELE: "A",
  SIELE: "B",
  CCSE: "C",
};

export const ENGINE_SUMMARY: Record<EngineId, string> = {
  A: "DELE — each skill /25 → /100 in two level-dependent groups; APTO needs ≥60% total (60/100), ≥60% per group (30/50) AND ≥25% in every skill. Lifetime diploma.",
  B: "SIELE — each skill 0–250 → 0–1000, NO pass/fail; maps to CEFR A1–C1. Certificate valid 5 years.",
  C: "CCSE — civic-knowledge test: 25 questions from the official 300-pool, pass 15/25. Not a CEFR test; paired with DELE A2 for nationality.",
};
