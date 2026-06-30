// ENGINE A — DELE (Diploma de Español como Lengua Extranjera). VERIFIED.
// Designed by Universidad de Salamanca, organised by Instituto Cervantes (~1,000
// centres in 100+ countries). Levels A1–C2. The diploma is LIFETIME valid.
//
// Scoring: total 100 points, four skills 25 each, split into TWO GROUPS of 50.
// Result is APTO / NO APTO. To be APTO the candidate needs ALL of:
//   • ≥ 60/100 overall, AND
//   • ≥ 30/50 (60%) in EACH group — a strong group cannot rescue a weak one, AND
//   • ≥ 25% in EVERY single skill (≥ 6.25/25) — the per-skill floor: failing one
//     skill sinks the whole exam even if the totals pass (DELE's note-éliminatoire
//     equivalent).
//
// CRITICAL, VERIFIED, LEVEL-DEPENDENT: the two groups are NOT the same skills at
// every level —
//   • A1 & A2 → Grupo 1 = Reading + Writing (pruebas escritas), Grupo 2 =
//     Listening + Speaking (pruebas orales).  [grouped by written vs oral channel]
//   • B1, B2, C1 → Grupo 1 = Reading + Listening (comprensión), Grupo 2 =
//     Writing + Speaking (expresión e interacción).  [comprehension vs production]
//   • C2 → an integrated paper structure (per-skill max reported as 33.33, three
//     tests). We model it with the B1–C1 comprehension/expression pairing as the
//     closest documented default AND flag it: confirm the exact C2 paper split on
//     the Instituto Cervantes C2 page before relying on the C2 breakdown.
// Hardcoding one grouping for all six levels is the bug to avoid.

import type { Skill, CefrLevel } from "../cefr";
import { SKILLS, CONFIRM_LINE } from "../cefr";

export const DELE_VERIFIED = true;
export const DELE_TOTAL_MAX = 100;
export const DELE_GROUP_MAX = 50; // each of the two groups
export const DELE_SKILL_MAX = 25;
export const DELE_GROUP_FLOOR = 30; // 60% of 50 — required in EACH group
export const DELE_PASS_TOTAL = 60; // 60% of 100
export const DELE_SKILL_FLOOR = 6.25; // 25% of 25 — required in EVERY skill

export type DeleGroup = "I" | "II";

// Verified level-dependent group pairing.
export function deleGroupOf(level: CefrLevel, skill: Skill): DeleGroup {
  if (level === "A1" || level === "A2") {
    // Grupo 1 = escritas (reading + writing); Grupo 2 = orales (listening + speaking).
    return skill === "reading" || skill === "writing" ? "I" : "II";
  }
  // B1, B2, C1, C2 → Grupo 1 = comprensión (reading + listening); Grupo 2 =
  // expresión (writing + speaking).
  return skill === "reading" || skill === "listening" ? "I" : "II";
}

function groupLabels(level: CefrLevel): Record<DeleGroup, string> {
  if (level === "A1" || level === "A2") {
    return {
      I: "Grupo 1 — Pruebas escritas (Reading + Writing)",
      II: "Grupo 2 — Pruebas orales (Listening + Speaking)",
    };
  }
  return {
    I: "Grupo 1 — Comprensión (Reading + Listening)",
    II: "Grupo 2 — Expresión e interacción (Writing + Speaking)",
  };
}

export type DeleSkillScores = Record<Skill, number>; // each 0–25

export type DeleGroupResult = {
  group: DeleGroup;
  label: string;
  skills: Skill[];
  points: number; // /50
  floor: number; // 30
  meetsFloor: boolean;
};

export type DeleResult = {
  exam: "DELE";
  level: CefrLevel;
  perSkill: Record<Skill, number>; // /25
  groups: Record<DeleGroup, DeleGroupResult>;
  total: number; // /100
  passTotal: number; // 60
  passed: boolean; // APTO
  apto: "APTO" | "NO APTO";
  failedGroups: DeleGroup[]; // groups below the 60% floor
  belowSkillFloor: Skill[]; // skills below 25%
  floorFail: boolean; // a group OR a skill breached its floor
  message: string;
  c2Note: string | null;
  confirm: string;
};

function clamp(n: number, max: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(max, n));
}

export function scoreDele(scores: DeleSkillScores, level: CefrLevel): DeleResult {
  const perSkill = {} as Record<Skill, number>;
  for (const s of SKILLS) perSkill[s] = clamp(scores[s], DELE_SKILL_MAX);

  const labels = groupLabels(level);
  const groups = {} as Record<DeleGroup, DeleGroupResult>;
  for (const g of ["I", "II"] as DeleGroup[]) {
    const skills = SKILLS.filter((s) => deleGroupOf(level, s) === g);
    const points = skills.reduce((sum, s) => sum + perSkill[s], 0); // /50
    groups[g] = {
      group: g,
      label: labels[g],
      skills,
      points,
      floor: DELE_GROUP_FLOOR,
      meetsFloor: points >= DELE_GROUP_FLOOR,
    };
  }

  const total = SKILLS.reduce((sum, s) => sum + perSkill[s], 0); // /100
  const failedGroups = (["I", "II"] as DeleGroup[]).filter((g) => !groups[g].meetsFloor);
  const belowSkillFloor = SKILLS.filter((s) => perSkill[s] < DELE_SKILL_FLOOR);
  const floorFail = failedGroups.length > 0 || belowSkillFloor.length > 0;
  const passed = total >= DELE_PASS_TOTAL && !floorFail;

  let message: string;
  if (belowSkillFloor.length > 0) {
    const names = belowSkillFloor.join(", ");
    message = `${names} is below the 25% per-skill floor (6.25/25). A single skill under 25% fails DELE even if the totals pass.`;
  } else if (failedGroups.length > 0) {
    const names = failedGroups.map((g) => groups[g].label.split(" — ")[0]).join(" and ");
    message =
      total >= DELE_PASS_TOTAL
        ? `Your total is ${total}/100 (at or above 60) but ${names} is below the 60% group floor (30/50) — DELE fails the whole exam on a single weak group.`
        : `Below the 60/100 pass mark, and ${names} is also under the 60% group floor (30/50).`;
  } else if (passed) {
    message = `Estimated APTO: ${total}/100, both groups at or above 30/50 and every skill above the 25% floor.`;
  } else {
    message = `Estimated ${total}/100 — below the 60/100 pass mark (groups and skills clear their floors).`;
  }

  return {
    exam: "DELE",
    level,
    perSkill,
    groups,
    total,
    passTotal: DELE_PASS_TOTAL,
    passed,
    apto: passed ? "APTO" : "NO APTO",
    failedGroups,
    belowSkillFloor,
    floorFail,
    message,
    c2Note:
      level === "C2"
        ? "DELE C2 uses an integrated paper structure (per-skill max ~33.33, three tests). This breakdown models it with the comprehension/expression pairing as a documented default — confirm the exact C2 split on the Instituto Cervantes C2 page."
        : null,
    confirm: CONFIRM_LINE,
  };
}
