"use client";

// Client runner for the CCSE mock (simulacro). Renders 25 per-tarea civic
// questions, a 45-minute countdown (auto-submits at zero), and posts the chosen
// options to /api/spanish/ccse-mock/submit. Shows an honest APTO / NO APTO estimate
// with a per-tarea breakdown — never an official result.

import { useCallback, useEffect, useRef, useState } from "react";

export type MockQuestion = {
  id: string;
  tarea: number;
  stem: string;
  options: { id: string; text: string }[];
};

type MockResult = {
  result: { apto: "APTO" | "NO APTO"; correct: number; total: number; pass: number; passed: boolean; message: string; pairingNote: string; sourceNote: string; confirm: string };
  correct: number;
  total: number;
  perTarea: Record<string, { correct: number; total: number }>;
};

const TAREA_LABEL: Record<number, string> = {
  1: "Gobierno, legislación y participación",
  2: "Derechos y deberes",
  3: "Organización territorial y geografía",
  4: "Cultura e historia",
  5: "Sociedad y vida cotidiana",
};

const MOCK_SECONDS = 45 * 60;

export function CcseMock({ questions }: { questions: MockQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MockResult | null>(null);
  const [remaining, setRemaining] = useState(MOCK_SECONDS);
  const submittedRef = useRef(false);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/spanish/ccse-mock/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo puntuar el simulacro.");
        submittedRef.current = false;
      } else {
        setResult(data as MockResult);
      }
    } catch {
      setError("Error de red — inténtalo de nuevo.");
      submittedRef.current = false;
    } finally {
      setBusy(false);
    }
  }, [answers]);

  // Countdown; auto-submit at zero.
  useEffect(() => {
    if (result) return;
    if (remaining <= 0) {
      void submit();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, result, submit]);

  if (result) {
    const r = result.result;
    const apto = r.apto === "APTO";
    const tareas = Object.keys(result.perTarea)
      .map(Number)
      .filter((t) => t > 0)
      .sort((a, b) => a - b);
    return (
      <div className="mt-4">
        <div
          className={`rounded-2xl border p-6 ${apto ? "border-emerald-300 bg-emerald-50" : "border-almi-coral bg-almi-coral/10"}`}
        >
          <p className="font-display text-3xl font-bold text-almi-ink">{r.apto}</p>
          <p className="mt-1 text-almi-text">
            {result.correct}/{result.total} correctas · aprobado con {r.pass}/{r.total}
          </p>
          <p className="mt-2 text-sm text-almi-text-muted">{r.message}</p>
        </div>

        <h3 className="mt-6 font-display text-lg font-semibold text-almi-ink">Por tarea</h3>
        <div className="mt-2 divide-y divide-almi-bg-peach rounded-2xl border border-almi-bg-peach">
          {tareas.map((t) => (
            <div key={t} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <span className="text-almi-text">Tarea {t} · {TAREA_LABEL[t] ?? ""}</span>
              <span className="font-semibold text-almi-ink">
                {result.perTarea[t].correct}/{result.perTarea[t].total}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-almi-text-muted">{r.sourceNote}</p>
        <p className="mt-1 text-xs text-almi-text-muted">{r.pairingNote}</p>
        <p className="mt-1 text-xs text-almi-text-muted">{r.confirm}</p>

        <a
          href="/practice/ccse-mock"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-almi-coral px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-coral-deep"
        >
          Otro simulacro
        </a>
      </div>
    );
  }

  const answered = Object.keys(answers).length;
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mt-4">
      <div className="sticky top-0 z-10 -mx-6 flex items-center justify-between border-b border-almi-bg-peach bg-almi-bg/95 px-6 py-3 backdrop-blur">
        <span className="text-sm font-medium text-almi-text">
          {answered}/{questions.length} respondidas
        </span>
        <span
          className={`font-mono text-sm font-semibold ${remaining <= 60 ? "text-almi-coral-deep" : "text-almi-ink"}`}
        >
          {mm}:{ss}
        </span>
      </div>

      <h1 className="mt-4 font-display text-2xl font-bold text-almi-ink">Simulacro CCSE</h1>
      <p className="mt-2 text-sm text-almi-text-muted">
        25 preguntas originales sobre el temario CCSE 2026, repartidas por tarea. Elige una respuesta en cada
        pregunta. Apruebas con 15/25. No es el examen oficial: es una estimación de práctica.
      </p>

      <div className="mt-5 space-y-4">
        {questions.map((q, i) => (
          <fieldset key={q.id} className="rounded-2xl border border-almi-bg-peach p-4">
            <legend className="px-1 text-sm font-medium text-almi-ink">
              {i + 1}. {q.stem}
            </legend>
            <div className="mt-2 space-y-1.5">
              {q.options.map((o) => (
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

      {error && <p className="mt-4 text-sm font-medium text-almi-coral-deep">{error}</p>}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={busy}
        className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-almi-coral px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-coral-deep disabled:opacity-60"
      >
        {busy ? "Puntuando…" : "Terminar y ver el resultado"}
      </button>
    </div>
  );
}
