// Item selection for a practice run. Content is keyed by (skill, level); Reading/
// Listening items are shared (examFamily = null), Writing/Speaking can be
// exam-specific, and CCSE civic items carry examFamily = CCSE. We pull shared items
// plus any that match the chosen exam's family, and strip answer keys before
// anything reaches the client.

import { prisma } from "@/lib/prisma";
import type { CefrLevel, ExamFamily, SpanishItem, SpanishSkill } from "@prisma/client";
import type { Exam } from "./exams";
import { CCSE_QUESTIONS, CCSE_MOCK_COMPOSITION } from "./engines/ccse";

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

// Draw a 25-question CCSE mock weighted PER TAREA (the official ~60/40 blend),
// instead of a flat "first N" pull. Each CCSE item is a single civic question with
// payload.tarea (1–5); we sample the CCSE_MOCK_COMPOSITION count from each tarea,
// then top up any shortfall (if a tarea is thin) from the remaining pool, and
// shuffle. Returns real DB items — answer keys are stripped by the caller.
export async function pickCcseMock(count: number = CCSE_QUESTIONS): Promise<SpanishItem[]> {
  const pool = await prisma.spanishItem.findMany({
    where: { examFamily: "CCSE", active: true, skill: "COMPRENSION_LECTORA" },
  });

  const byTarea = new Map<number, SpanishItem[]>();
  for (const it of pool) {
    const t = Number((it.payload as { tarea?: unknown } | null)?.tarea);
    if (!Number.isFinite(t)) continue;
    (byTarea.get(t) ?? byTarea.set(t, []).get(t)!).push(it);
  }

  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const chosen: SpanishItem[] = [];
  const usedIds = new Set<string>();
  for (const [tareaStr, want] of Object.entries(CCSE_MOCK_COMPOSITION)) {
    const tarea = Number(tareaStr);
    const bucket = shuffle(byTarea.get(tarea) ?? []);
    for (const it of bucket.slice(0, want)) {
      chosen.push(it);
      usedIds.add(it.id);
    }
  }

  // Top up to `count` from whatever remains (covers a thin tarea).
  if (chosen.length < count) {
    const rest = shuffle(pool.filter((it) => !usedIds.has(it.id)));
    for (const it of rest) {
      if (chosen.length >= count) break;
      chosen.push(it);
      usedIds.add(it.id);
    }
  }

  return shuffle(chosen).slice(0, count);
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
