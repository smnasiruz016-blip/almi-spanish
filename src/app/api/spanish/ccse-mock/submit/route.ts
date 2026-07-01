// Score a CCSE mock: 25 single-question civic items drawn per-tarea. The client
// posts one chosen option per itemId; we re-load those items server-side (answer
// keys never leave the server), mark each against its own key, and route the total
// through the CCSE engine for an honest APTO / NO APTO estimate on the 25-question
// scale — plus a per-tarea breakdown. This is a self-assessment: it is not the
// official CCSE and is not persisted as a per-skill attempt.

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreCcse } from "@/lib/spanish/engines/ccse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  await requireUser();
  let body: { answers?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const answers = body.answers ?? {};
  const ids = Object.keys(answers);
  if (ids.length === 0) {
    return NextResponse.json({ error: "No answers submitted" }, { status: 400 });
  }

  const items = await prisma.spanishItem.findMany({
    where: { id: { in: ids }, examFamily: "CCSE", active: true, skill: "COMPRENSION_LECTORA" },
  });
  if (items.length === 0) {
    return NextResponse.json({ error: "No CCSE items found for this mock" }, { status: 404 });
  }

  let correct = 0;
  const perTarea: Record<number, { correct: number; total: number }> = {};
  for (const it of items) {
    const payload = it.payload as { tarea?: number; questions?: { answer?: string }[] } | null;
    const key = payload?.questions?.[0]?.answer;
    const tarea = Number(payload?.tarea) || 0;
    perTarea[tarea] ??= { correct: 0, total: 0 };
    perTarea[tarea].total += 1;
    if (key != null && answers[it.id] === key) {
      correct += 1;
      perTarea[tarea].correct += 1;
    }
  }

  const total = items.length;
  const result = scoreCcse(correct, total);

  return NextResponse.json({ result, correct, total, perTarea });
}
