"use client";

// One-item practice composer for all four skills:
//   Reading   — passages + questions, auto-marked
//   Listening — server TTS audio (script never sent) + questions, auto-marked
//   Writing   — production écrite, AI feedback (Pro)
//   Speaking  — spoken-answer transcript, AI feedback (Pro)
// Posts to /api/spanish/submit and renders the engine estimate.

import { useState } from "react";
import type { SpanishItem } from "@prisma/client";
import { Result, type SkillEstimate, type Feedback } from "./Result";

type Opt = { id: string; text: string };
type Q = { id: string; kind?: string; stem: string; options?: Opt[] };
type Payload = {
  passages?: { id: string; heading?: string; body: string }[];
  questions?: Q[];
  situation?: string;
  instruction?: string;
  wordMin?: number;
  wordMax?: number;
  taskPrompt?: string;
  prepSeconds?: number;
  speakSeconds?: number;
};

export type ComposerItem = Pick<SpanishItem, "id" | "skill" | "title" | "prompt"> & { payload: Payload };

export function Composer({ item, examId }: { item: ComposerItem; examId: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ estimate: SkillEstimate; feedback: Feedback } | null>(null);

  const p = item.payload;
  const isReading = item.skill === "COMPRENSION_LECTORA";
  const isListening = item.skill === "COMPRENSION_AUDITIVA";
  const isWriting = item.skill === "EXPRESION_ESCRITA";
  const isSpeaking = item.skill === "EXPRESION_ORAL";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function submit() {
    setBusy(true);
    setError(null);
    const response =
      isReading || isListening ? { answers } : isWriting ? { text } : { transcript: text };
    try {
      const res = await fetch("/api/spanish/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, examId, response }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not score this attempt.");
      } else {
        setResult({ estimate: data.estimate, feedback: data.feedback ?? null });
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (result) return <Result estimate={result.estimate} feedback={result.feedback} />;

  return (
    <div className="mt-4">
      <h1 className="font-display text-2xl font-bold text-almi-ink">{item.title}</h1>
      <p className="mt-2 whitespace-pre-line text-almi-text">{item.prompt}</p>

      {isListening && (
        <audio controls preload="none" className="mt-4 w-full" src={`/api/spanish/audio/${item.id}`}>
          Your browser does not support audio playback.
        </audio>
      )}

      {isReading &&
        p.passages?.map((psg) => (
          <article key={psg.id} className="mt-4 rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
            {psg.heading && <h3 className="font-semibold text-almi-ink">{psg.heading}</h3>}
            <p className="mt-2 whitespace-pre-line text-sm text-almi-text">{psg.body}</p>
          </article>
        ))}

      {(isReading || isListening) && (
        <div className="mt-5 space-y-4">
          {p.questions?.map((q, i) => (
            <fieldset key={q.id} className="rounded-2xl border border-almi-bg-peach p-4">
              <legend className="px-1 text-sm font-medium text-almi-ink">
                {i + 1}. {q.stem}
              </legend>
              <div className="mt-2 space-y-1.5">
                {(q.options ?? [
                  { id: "true", text: "Vrai" },
                  { id: "false", text: "Faux" },
                ]).map((o) => (
                  <label key={o.id} className="flex items-center gap-2 text-sm text-almi-text">
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={answers[q.id] === o.id}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                    />
                    {o.text}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {(isWriting || isSpeaking) && (
        <div className="mt-5">
          {isSpeaking && (
            <p className="mb-2 text-xs text-almi-text-muted">
              Speak your answer aloud, then type what you said (transcript). Graded on language only — never
              your accent. (In-browser recording is a later addition.)
            </p>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={isSpeaking ? 6 : 10}
            placeholder={isWriting ? "Tu respuesta en español…" : "Transcripción de tu respuesta…"}
            className="w-full rounded-2xl border border-almi-bg-peach bg-almi-paper p-4 text-sm text-almi-text"
          />
          {isWriting && (
            <p className="mt-1 text-xs text-almi-text-muted">
              {words} words{p.wordMin ? ` · target ${p.wordMin}–${p.wordMax ?? p.wordMin}` : ""}
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm font-medium text-almi-coral-deep">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-almi-coral px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-coral-deep disabled:opacity-60"
      >
        {busy ? "Scoring…" : "Submit for an estimate"}
      </button>
    </div>
  );
}
