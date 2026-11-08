// Score a practice attempt. Reading/Listening: deterministic marking (free).
// Writing/Speaking: AI grader (paid, or 1 of each in the free 48 hours). Both convert to the chosen exam's scale and
// route to its engine for an honest per-skill estimate. No fabricated official
// score; we always tell the user to confirm with the official body.

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiGate, freeAiNeedsVerifiedEmail, VERIFY_EMAIL_FOR_FREE_AI } from "@/lib/billing/free-access";
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
    // Productive (Writing/Speaking) uses the AI grader. RR-397: paid users as before; a free account (48 hours, no card) gets ONE
    // AI-scored Expresión escrita and ONE AI-scored Expresión oral, within today's free-AI budget. "Used" = a SCORED attempt of that
    // skill (written only after the grader returned), never a click.
    // RR-399 A4: a non-paid account verifies its email before its free AI scoring (practice without AI never asks).
    if (freeAiNeedsVerifiedEmail(user)) {
      return NextResponse.json({ error: VERIFY_EMAIL_FOR_FREE_AI }, { status: 403 });
    }
    const r = (body.response ?? {}) as { text?: string; transcript?: string };
    const text = (r.text ?? r.transcript ?? "").trim();
    if (!text) return NextResponse.json({ error: "Empty response" }, { status: 400 });
    const gate = await aiGate(user, item.skill === "EXPRESION_ORAL" ? "SPEAKING" : "WRITING", () =>
      prisma.spanishAttempt.count({ where: { userId: user.id, skill: item.skill, status: "SCORED" } }),
    );
    if (!gate.ok) return NextResponse.json(gate.body, { status: gate.status });
    const payload = item.payload as Record<string, unknown>;
    const taskPrompt = [item.prompt, payload?.situation, payload?.instruction, payload?.taskPrompt]
      .filter((x): x is string => typeof x === "string" && x.length > 0)
      .join("\n");
    let grade: Awaited<ReturnType<typeof gradeProductive>> & { latencyMs?: number };
    try {
      grade = (await gradeProductive({
        exam,
        level: item.level,
        skill: item.skill,
        taskPrompt,
        response: text,
        userId: user.id,
      })) as Awaited<ReturnType<typeof gradeProductive>> & { latencyMs?: number };
    } catch (err) {
      // RR-399 A3: the AI call failed, so the learner received nothing: give the free use back before the error goes out.
      await gate.release();
      throw err;
    }
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
