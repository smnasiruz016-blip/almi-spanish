// On-demand pan-Hispanic TTS for the Comprensión auditiva (Listening) skill.
// Generates the audio server-side from the item's `audioScript` so the script
// (which would give away the answers) never reaches the client. Any signed-in
// user may fetch practice audio. Two-or-more-speaker scripts alternate voices.

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { synthesizeSpeech, synthesizeDialogue } from "@/lib/ai/openai";

export const runtime = "nodejs";

const audioPayloadSchema = z.object({
  audioScript: z.string().min(1),
  speakers: z.array(z.object({ role: z.string(), voice: z.string() })).optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ itemId: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }
  const { itemId } = await ctx.params;

  const item = await prisma.spanishItem.findFirst({
    where: { id: itemId, active: true, skill: "COMPRENSION_AUDITIVA" },
  });
  if (!item) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const parsed = audioPayloadSchema.safeParse(item.payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Bad item" }, { status: 500 });
  }

  try {
    const speakers = parsed.data.speakers ?? [];
    const audio =
      speakers.length >= 2
        ? await synthesizeDialogue(parsed.data.audioScript, speakers, user.id)
        : await synthesizeSpeech(parsed.data.audioScript, user.id, speakers[0]?.voice ?? "alloy");
    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store" },
    });
  } catch (err) {
    console.error("[spanish.audio] tts failed:", err);
    return NextResponse.json({ ok: false, error: "Audio unavailable" }, { status: 500 });
  }
}
