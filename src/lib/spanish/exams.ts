// The AlmiSpanish exam map — every Spanish exam the product covers, grouped by
// family, each routed to its scoring engine. Doors are exam-named (DELE / SIELE /
// CCSE) and goal-named (Spanish nationality, study in Spain); honest key fact per
// exam. People search the exam or the goal, not "Spanish course".

import type { ExamFamily, EngineId } from "./engines";
import { ENGINE_FOR_FAMILY } from "./engines";

export type Exam = {
  id: string;
  name: string;
  body: string;
  family: ExamFamily;
  engine: EngineId;
  purpose: string;
  keyHonestFact: string;
};

function mk(
  id: string,
  name: string,
  body: string,
  family: ExamFamily,
  purpose: string,
  keyHonestFact: string,
): Exam {
  return { id, name, body, family, engine: ENGINE_FOR_FAMILY[family], purpose, keyHonestFact };
}

export const EXAMS: Exam[] = [
  // DELE family — Universidad de Salamanca / Instituto Cervantes (lifetime diplomas)
  mk("dele-a1", "DELE A1", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Beginner lifetime diploma",
    "APTO/NO APTO. Each skill /25 → /100 in two groups; at A1 they are Reading+Writing and Listening+Speaking. Pass needs ≥60% overall, ≥60% per group (30/50) AND ≥25% in each skill. Lifetime valid."),
  mk("dele-a2", "DELE A2", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Elementary diploma; A2 is the language requirement for Spanish nationality",
    "APTO/NO APTO, ≥60% overall, ≥60% per group (30/50), ≥25% each skill. Lifetime valid. DELE A2 (with CCSE) is the standard route to Spanish nationality for non-native applicants."),
  mk("dele-b1", "DELE B1", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Intermediate diploma; common for study/work",
    "APTO/NO APTO, ≥60% overall, ≥60% per group (30/50), ≥25% each skill. Lifetime valid."),
  mk("dele-b2", "DELE B2", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Upper-intermediate; widely required for university admission in Spain",
    "APTO/NO APTO, ≥60% overall, ≥60% per group (30/50), ≥25% each skill. Lifetime valid. Confirm the exact level your programme needs with the university."),
  mk("dele-c1", "DELE C1", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Advanced; degree study and professional use",
    "APTO/NO APTO, ≥60% overall, ≥60% per group (30/50), ≥25% each skill. Lifetime valid."),
  mk("dele-c2", "DELE C2", "Instituto Cervantes / Universidad de Salamanca", "DELE",
    "Mastery lifetime diploma", "APTO/NO APTO, ≥60% overall, ≥60% per group (30/50), ≥25% each skill. Lifetime valid."),

  // SIELE — Instituto Cervantes + UNAM + Salamanca + Buenos Aires (placement, 5-yr)
  mk("siele-global", "SIELE Global", "Instituto Cervantes (con UNAM, Salamanca y Buenos Aires)", "SIELE",
    "Pan-Hispanic level certification for study, work and admission",
    "0–1000 (0–250 per skill), NO pass/fail — it certifies your level (CEFR A1–C1) at that moment. Certificate valid 5 years (not lifetime)."),
  mk("siele-s1-s5", "SIELE modalities (S1–S5)", "Instituto Cervantes", "SIELE",
    "Single- or partial-skill certificates",
    "Independent modalities have their own sub-scales and Reports; choose by which skills your goal requires. Same honest scoring — a level, not a pass."),

  // CCSE — Spanish Ministry of Justice via Instituto Cervantes (civic test)
  mk("ccse", "CCSE", "Instituto Cervantes (Ministerio de Justicia)", "CCSE",
    "Civic-knowledge test for Spanish nationality",
    "25 questions from the official 300-pool, pass 15/25. A knowledge test (constitution + society), not a CEFR language test — paired with DELE A2 for nationality."),
];

export const EXAM_FAMILIES: ExamFamily[] = ["DELE", "SIELE", "CCSE"];

export function examsByFamily(family: ExamFamily): Exam[] {
  return EXAMS.filter((e) => e.family === family);
}

export function findExam(id: string): Exam | undefined {
  return EXAMS.find((e) => e.id === id);
}

// Out-of-core scope — a different audience, noted so it's never silently built
// into the core product.
export const OUT_OF_SCOPE_NOTE =
  "DELE para escolares (children) is a separate audience, not part of the core AlmiSpanish build.";
