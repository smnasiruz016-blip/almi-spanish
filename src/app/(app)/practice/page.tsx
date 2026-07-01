// Practice picker: choose an exam → CEFR level → skill, then run a practice item.
// Reading/Listening are free (auto-marked); Writing/Speaking are Pro (AI feedback).

import Link from "next/link";
import { EXAMS, EXAM_FAMILIES, examsByFamily } from "@/lib/spanish/exams";
import { LEVELS, LEVEL_LABEL, SKILL_ORDER, SKILL_LABEL, SKILL_SLUG, isObjective } from "@/lib/spanish/types";

export const metadata = { title: "Practice" };

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; level?: string }>;
}) {
  const { exam: examId, level } = await searchParams;
  const exam = EXAMS.find((e) => e.id === examId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-almi-ink">Choose your practice</h1>
      <p className="mt-2 text-sm text-almi-text-muted">
        Pick the exam your goal needs, your level, then a skill. Compréhension de l&apos;oral &amp; écrite
        are free; Expression écrite &amp; orale get AI feedback (Pro). Estimates only — confirm with the
        official body.
      </p>

      {/* Step 1 — exam */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-almi-ink">1. Exam</h2>
        <div className="mt-3 space-y-4">
          {EXAM_FAMILIES.map((fam) => (
            <div key={fam}>
              <p className="text-xs font-semibold uppercase tracking-wide text-almi-text-muted">{fam}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {examsByFamily(fam).map((e) => (
                  <Link
                    key={e.id}
                    href={`/practice?exam=${e.id}`}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      e.id === examId
                        ? "border-almi-coral bg-almi-coral/10 font-semibold text-almi-ink"
                        : "border-almi-bg-peach text-almi-text hover:border-almi-coral/50"
                    }`}
                  >
                    {e.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {exam?.family === "CCSE" && (
        <section className="mt-8">
          <div className="rounded-2xl border border-almi-coral/40 bg-almi-coral/5 p-5">
            <h2 className="font-display text-lg font-semibold text-almi-ink">Simulacro CCSE — 25 preguntas</h2>
            <p className="mt-1 text-sm text-almi-text-muted">
              A full 25-question civic mock drawn across the five tareas of the 2026 curriculum (~60/40 blend),
              45 minutes, pass 15/25 → APTO / NO APTO. Original questions — not the official exam.
            </p>
            <Link
              href="/practice/ccse-mock"
              className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full bg-almi-coral px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Empezar simulacro →
            </Link>
          </div>
        </section>
      )}

      {exam && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-almi-ink">2. Level</h2>
          <p className="mt-1 text-xs text-almi-text-muted">{exam.keyHonestFact}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Link
                key={l}
                href={`/practice?exam=${exam.id}&level=${l}`}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  l === level
                    ? "border-almi-coral bg-almi-coral/10 font-semibold text-almi-ink"
                    : "border-almi-bg-peach text-almi-text hover:border-almi-coral/50"
                }`}
              >
                {LEVEL_LABEL[l]}
              </Link>
            ))}
          </div>
        </section>
      )}

      {exam && level && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-almi-ink">3. Skill</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SKILL_ORDER.map((s) => (
              <Link
                key={s}
                href={`/practice/run?exam=${exam.id}&level=${level}&skill=${SKILL_SLUG[s]}`}
                className="flex flex-col rounded-2xl border border-almi-bg-peach bg-almi-paper p-4 hover:border-almi-coral/50"
              >
                <span className="font-display font-semibold text-almi-ink">{SKILL_LABEL[s]}</span>
                <span className="mt-1 text-xs text-almi-text-muted">
                  {isObjective(s) ? "Auto-marked · Free" : "AI feedback · Pro"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs text-almi-text-muted">
        Not sure which exam?{" "}
        <Link href="/which-spanish-test" className="font-semibold text-almi-coral hover:underline">
          Which Spanish test do you need? →
        </Link>
      </p>
    </div>
  );
}
