// Score a practice attempt. Reading/Listening: deterministic marking (free).
// Writing/Speaking: AI grader (Pro). Both convert to the chosen exam's scale and
// route to its engine for an honest per-skill estimate. No fabricated official
// score; we always tell the user to confirm with the official body.

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPaidAccess } from "@/lib/billing/plans";
import { findExam } from "@/lib/spanish/exams";
import { isObjective } from "@/lib/spanish/types";
import { markObjective, estimateSkill, toCefrSkill, type ObjectiveResponse } from "@/lib/spanish/scoring";
import { answerKey } from "@/lib/spanish/session";
import { gradeProductive } from "@/lib/spanish/grader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  const user = await requireUser();
  let body: { itemId?: string; examId?: string; response?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.itemId || !body.examId) {
    return NextResponse.json({ error: "itemId and examId are required" }, { status: 400 });
  }
  const exam = findExam(body.examId);
  if (!exam) return NextResponse.json({ error: "Unknown exam" }, { status: 400 });

  const item = await prisma.spanishItem.findUnique({ where: { id: body.itemId } });
  if (!item || !item.active) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const cefrSkill = toCefrSkill(item.skill);
  let fraction: number;
  let feedback: unknown = null;
  let aiModel: string | null = null;
  let costCents: number | null = null;
  let latencyMs: number | null = null;
  let pointsEarned = 0;
  let pointsMax = 0;

  if (isObjective(item.skill)) {
    const resp = (body.response ?? { answers: {} }) as ObjectiveResponse;
    const mark = markObjective(answerKey(item), resp);
    fraction = mark.fraction;
    pointsEarned = mark.correct;
    pointsMax = mark.total;
  } else {
    // Productive (Writing/Speaking) = Pro.
    if (!hasPaidAccess(user)) {
      return NextResponse.json(
        { error: "Expresión escrita and Expresión oral feedback is a Pro feature." },
        { status: 402 },
      );
    }
    const payload = item.payload as Record<string, unknown>;
    const taskPrompt = [item.prompt, payload?.situation, payload?.instruction, payload?.taskPrompt]
      .filter((x): x is string => typeof x === "string" && x.length > 0)
      .join("\n");
    const r = (body.response ?? {}) as { text?: string; transcript?: string };
    const text = (r.text ?? r.transcript ?? "").trim();
    if (!text) return NextResponse.json({ error: "Empty response" }, { status: 400 });
    const grade = (await gradeProductive({
      exam,
      level: item.level,
      skill: item.skill,
      taskPrompt,
      response: text,
      userId: user.id,
    })) as Awaited<ReturnType<typeof gradeProductive>> & { latencyMs?: number };
    fraction = grade.fraction;
    feedback = {
      levelEstimate: grade.level_estimate,
      strengths: grade.strengths,
      improvements: grade.improvements,
      summary: grade.summary,
    };
    aiModel = "claude-sonnet-4-6";
    latencyMs = grade.latencyMs ?? null;
  }

  const estimate = estimateSkill(exam, cefrSkill, fraction, item.level);

  const attempt = await prisma.spanishAttempt.create({
    data: {
      userId: user.id,
      itemId: item.id,
      level: item.level,
      skill: item.skill,
      taskType: item.taskType,
      examId: exam.id,
      status: "SCORED",
      response: (body.response ?? {}) as object,
      pointsEarned,
      pointsMax,
      scoreEstimate: estimate as object,
      feedback: feedback as object,
      aiModel,
      costCents,
      latencyMs,
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ attemptId: attempt.id, estimate, feedback });
}
