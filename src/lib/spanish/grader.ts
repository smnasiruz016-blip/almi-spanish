// AI grader for the productive skills (Expresión escrita / Expresión oral). Grades
// the candidate's SPANISH text (or Whisper transcript) against the official
// criteria FOR THE CHOSEN EXAM + LEVEL — we do NOT hardcode a fixed criteria count
// (it varies by exam/level). Returns an honest quality fraction (0–1, fed to the
// scoring bridge) plus qualitative feedback in English. Speaking is graded from the
// transcript only — never the accent. No fabricated official score.

import { z } from "zod";
import { getAnthropicClient, recordCost } from "@/lib/ai/anthropic-client";
import { MODELS } from "@/lib/ai/models";
import type { Exam } from "./exams";
import type { CefrLevel, SpanishSkill } from "@prisma/client";
import { SKILL_LABEL } from "./types";

// Plain-typed schema (no min/max/enum constraints — Anthropic structured output
// rejects those; we validate ranges with Zod after parsing).
const gradeShape = z.object({
  fraction: z.number(), // 0..1 estimated quality on this exam+level's criteria
  level_estimate: z.string(), // e.g. "around B2"
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  summary: z.string(),
});
export type Grade = z.infer<typeof gradeShape> & { fraction: number };

const JSON_SCHEMA = {
  type: "object",
  properties: {
    fraction: { type: "number" },
    level_estimate: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
  required: ["fraction", "level_estimate", "strengths", "improvements", "summary"],
} as const;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export async function gradeProductive(args: {
  exam: Exam;
  level: CefrLevel;
  skill: SpanishSkill; // EXPRESION_ESCRITA | EXPRESION_ORAL
  taskPrompt: string;
  response: string; // Spanish text or transcript
  userId: string | null;
}): Promise<Grade> {
  const { exam, level, skill, taskPrompt, response, userId } = args;
  const isSpeaking = skill === "EXPRESION_ORAL";

  const system = [
    `You are an experienced examiner for ${exam.name} (${exam.body}).`,
    `Grade this ${SKILL_LABEL[skill]} response at CEFR ${level}, against the OFFICIAL ${exam.name} assessment criteria for this skill and level (do not assume a fixed number of criteria — use the real ones for this exam/level).`,
    isSpeaking
      ? "This is a transcript of spoken Spanish. Judge language only (task achievement, coherence, range, accuracy). NEVER judge accent or pronunciation — they are not in the transcript. Treat all standard varieties of Spanish (peninsular and Latin American) as equally correct."
      : "Judge task achievement, coherence/cohesion, lexical range, and grammatical accuracy as the official criteria define them for this exam and level. Treat all standard varieties of Spanish (peninsular and Latin American) as equally correct.",
    "Be honest and strict but fair. `fraction` is your estimate of how fully this meets the criteria at this level, 0 to 1. Do NOT invent an official score or band number. Write feedback in English.",
  ].join(" ");

  const user = [
    `TASK:\n${taskPrompt}`,
    `\nCANDIDATE RESPONSE (Spanish):\n${response}`,
    `\nReturn JSON only.`,
  ].join("\n");

  const client = getAnthropicClient();
  const started = Date.now();
  let raw = "";
  let usage = { inputTokens: 0, outputTokens: 0 };
  try {
    const msg = await client.messages.create({
      model: MODELS.SONNET,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
      tools: [
        {
          name: "report_grade",
          description: "Report the grade and feedback.",
          input_schema: JSON_SCHEMA as unknown as {
            type: "object";
            properties: Record<string, unknown>;
            required: string[];
          },
        },
      ],
      tool_choice: { type: "tool", name: "report_grade" },
    });
    usage = { inputTokens: msg.usage.input_tokens, outputTokens: msg.usage.output_tokens };
    const block = msg.content.find((b) => b.type === "tool_use");
    raw = block && block.type === "tool_use" ? JSON.stringify(block.input) : "";
    await recordCost({
      userId,
      feature: isSpeaking ? "expresion_oral.grade" : "expresion_escrita.grade",
      model: MODELS.SONNET,
      usage,
      success: true,
    });
  } catch (err) {
    await recordCost({
      userId,
      feature: isSpeaking ? "expresion_oral.grade" : "expresion_escrita.grade",
      model: MODELS.SONNET,
      usage,
      success: false,
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }

  const parsed = gradeShape.parse(JSON.parse(raw));
  return { ...parsed, fraction: clamp01(parsed.fraction), latencyMs: Date.now() - started } as Grade & {
    latencyMs: number;
  };
}
