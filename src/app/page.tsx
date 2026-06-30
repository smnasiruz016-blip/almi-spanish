import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { CEFR_LEVELS, CEFR_LABEL } from "@/lib/spanish/cefr";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

const EXAM_FAMILIES = [
  { tag: "DELE", line: "DELE A1–C2 — APTO/NO APTO · lifetime diplomas (Instituto Cervantes / Salamanca)" },
  { tag: "SIELE", line: "SIELE Global · S1–S5 modalities — 0–1000, CEFR A1–C1 · valid 5 years" },
  { tag: "CCSE", line: "CCSE — 25 civic questions, pass 15/25 · with DELE A2 for Spanish nationality" },
];

const SKILLS = [
  { es: "Comprensión auditiva", en: "Listening", tier: "Auto-marked · Free" },
  { es: "Comprensión de lectura", en: "Reading", tier: "Auto-marked · Free" },
  { es: "Expresión escrita", en: "Writing", tier: "AI feedback · Pro" },
  { es: "Expresión oral", en: "Speaking", tier: "AI feedback · Pro" },
];

const VALUE_PROPS = [
  {
    title: "Built around the real exam formats",
    body: "Practise the same task types as DELE, SIELE and CCSE — reading and listening layouts, written and spoken prompts, civic-knowledge questions — built to mirror the real exam, never copied from the test-makers.",
  },
  {
    title: "Honest scores on the real scale",
    body: "Each exam is scored differently, so we estimate on its own scale: DELE's APTO/NO APTO with its per-group floor, SIELE's 0–1000 placement, CCSE's 15/25 pass — mapped to CEFR. Ranges and real structure, never an invented precise overall.",
  },
  {
    title: "The right test for your goal",
    body: "Use the \"which Spanish test do you need?\" guide: DELE for a lifetime diploma, SIELE for a fast pan-Hispanic level certificate, DELE A2 + CCSE for Spanish nationality.",
  },
  {
    title: "Giving back with every attempt",
    body: "25% of all AlmiWorld income supports the Shamool Foundation's free school in Lahore — free education and a daily meal for underprivileged children.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · DELE · SIELE · CCSE PRACTICE
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Practise the Spanish exams with honest AI feedback.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-almi-text">
            Real task formats for DELE, SIELE and CCSE — all four skills, every CEFR level
            (A1–C2) — with an honest estimate on each exam&apos;s real scale, mapped to CEFR, so you
            know which test you need and where you stand.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise free
            </Link>
            <span className="text-sm text-almi-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-almi-ink hover:underline">
                Log in →
              </Link>
            </span>
          </div>
          <p className="mt-5 text-xs text-almi-text-muted">
            $12/month · 7-day free trial · cancel anytime · Listening &amp; Reading free · Original
            pan-Hispanic material, never copied
          </p>
        </div>

        {/* exam family chips */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {EXAM_FAMILIES.map((f) => (
            <div key={f.tag} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-almi-coral">{f.tag}</p>
              <p className="mt-2 text-sm text-almi-text">{f.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t border-almi-bg-peach bg-almi-paper px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-semibold text-almi-ink">
            An honest estimate, and the right test for your goal.
          </h2>
          <p className="mt-5 text-base text-almi-text">
            Spanish isn&apos;t one exam. DELE is a lifetime diploma scored APTO/NO APTO with a
            per-group floor. SIELE is a 0–1000 placement with no pass or fail, valid five years. CCSE
            is a 25-question civic test (pass 15/25) paired with DELE A2 for Spanish nationality. Each
            is scored differently — so AlmiSpanish gives you an honest estimate on the real scale for
            your exam, mapped to CEFR, and points you to the test your goal actually needs. Then
            confirm with the official body.
          </p>
          <div className="mt-7 text-center">
            <Link
              href="/which-spanish-test"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
            >
              Which Spanish test do you need? →
            </Link>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-semibold text-almi-ink">The four skills</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-almi-text-muted">
            Listening and Reading are auto-marked and free to practise. Writing and Speaking are
            graded with honest AI feedback against the official criteria for your exam and level.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {SKILLS.map((s) => (
              <li key={s.en} className="flex flex-col rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold text-almi-ink">{s.es}</h3>
                  <span className="text-xs text-almi-text-muted">{s.tier}</span>
                </div>
                <p className="mt-1 text-sm text-almi-text-muted">{s.en}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Levels */}
      <section className="border-t border-almi-bg-peach bg-almi-bg-peach/40 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-semibold text-almi-ink">
            Six levels, every exam
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-almi-text-muted">
            Choose your exam and level and every module runs at that standard.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CEFR_LEVELS.map((v) => (
              <li key={v} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
                <h3 className="text-base font-semibold text-almi-ink">{CEFR_LABEL[v]}</h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <ul className="grid gap-4 sm:grid-cols-2">
            {VALUE_PROPS.map((v) => (
              <li key={v.title} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
                <h3 className="font-display text-lg font-semibold text-almi-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-almi-text">{v.body}</p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-almi-text-muted">
            Admission or registration is not a visa — confirm current rules with the Spanish
            consulate, registro civil, or your university.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-almi-bg-peach bg-almi-paper px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-almi-ink">Simple, honest pricing</h2>
          <p className="mt-3 text-base text-almi-text">
            $12/month — 7-day free trial, cancel anytime. Listening &amp; Reading practice is free;
            AI feedback on Writing &amp; Speaking is Pro.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-base font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
