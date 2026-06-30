// Item selection for a practice run. Content is keyed by (skill, level); Reading/
// Listening items are shared (examFamily = null), Writing/Speaking can be
// exam-specific, and CCSE civic items carry examFamily = CCSE. We pull shared items
// plus any that match the chosen exam's family, and strip answer keys before
// anything reaches the client.

import { prisma } from "@/lib/prisma";
import type { CefrLevel, ExamFamily, SpanishItem, SpanishSkill } from "@prisma/client";
import type { Exam } from "./exams";

// exams.ts family ("DELE"|"SIELE"|"CCSE") already equals the prisma ExamFamily enum.
export function toExamFamilyEnum(family: Exam["family"]): ExamFamily {
  return family;
}

export async function pickItems(args: {
  level: CefrLevel;
  skill: SpanishSkill;
  exam: Exam;
  limit?: number;
}): Promise<SpanishItem[]> {
  const fam = toExamFamilyEnum(args.exam.family);
  return prisma.spanishItem.findMany({
    where: {
      level: args.level,
      skill: args.skill,
      active: true,
      OR: [{ examFamily: null }, { examFamily: fam }],
    },
    orderBy: { createdAt: "asc" },
    take: args.limit ?? 8,
  });
}

// Remove server-side answer keys from a payload before sending to the client.
export function stripAnswers(item: SpanishItem): SpanishItem {
  const payload = item.payload as Record<string, unknown> | null;
  if (!payload || typeof payload !== "object") return item;
  const clone: Record<string, unknown> = JSON.parse(JSON.stringify(payload));
  if (Array.isArray(clone.questions)) {
    clone.questions = (clone.questions as Record<string, unknown>[]).map((q) => {
      const { answer: _drop, ...rest } = q;
      void _drop;
      return rest;
    });
  }
  // Listening: the audioScript carries content but not answers; the audio is
  // served via the TTS route, so keep the script server-only by dropping it here.
  if (typeof clone.audioScript === "string") delete clone.audioScript;
  return { ...item, payload: clone as SpanishItem["payload"] };
}

// Build the server-side answer key for an objective item.
export function answerKey(item: SpanishItem): { id: string; answer: string; exact?: boolean }[] {
  const payload = item.payload as { questions?: { id: string; answer: string; kind?: string }[] } | null;
  if (!payload?.questions) return [];
  return payload.questions.map((q) => ({ id: q.id, answer: q.answer, exact: true }));
}
