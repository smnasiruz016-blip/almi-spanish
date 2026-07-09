import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

const EXAM_FAMILIES = [
  { tag: "DELE", line: "DELE A1–C2 — APTO/NO APTO · lifetime diplomas (Instituto Cervantes / Salamanca)" },
  { tag: "SIELE", line: "SIELE Global · S1–S5 modalities — 0–1000, CEFR A1–C1 · valid 5 years" },
  { tag: "CCSE", line: "CCSE — 25 civic questions, pass 15/25 · with DELE A2 for Spanish nationality" },
];

const SKILLS = [
  {
    es: "Comprensión auditiva",
    en: "Listening",
    tier: "Auto-marked · Free",
    blurb: "Listen to authentic pan-Hispanic audio and answer real comprehension tasks, with accents from across the Spanish-speaking world.",
  },
  {
    es: "Comprensión de lectura",
    en: "Reading",
    tier: "Auto-marked · Free",
    blurb: "Read complex Spanish texts and build fast, accurate comprehension across real document types.",
  },
  {
    es: "Expresión escrita",
    en: "Writing",
    tier: "AI feedback · Pro",
    blurb: "Write essays, letters, or open responses. Honest feedback on grammar, cohesion, and vocabulary range against your exam's criteria.",
  },
  {
    es: "Expresión oral",
    en: "Speaking",
    tier: "AI feedback · Pro",
    blurb: "Record spoken responses to real prompts. Graded on the official criteria for structure and fluency — never your accent.",
  },
];

const LEVELS = [
  "A1 — Acceso",
  "A2 — Plataforma",
  "B1 — Umbral",
  "B2 — Avanzado",
  "C1 — Dominio operativo eficaz",
  "C2 — Maestría",
];

const VALUE_PROPS = [
  {
    title: "Built around the real formats",
    body: "Practise the same task types as DELE, SIELE and CCSE — built to mirror the real exams, written from scratch, never copied from the test-makers.",
  },
  {
    title: "Honest scores on the real scale",
    body: "Each exam is scored differently, so we estimate on its own scale and map it to CEFR. DELE shows APTO/NO APTO with its group floors; SIELE shows your 0–1000 placement; CCSE shows your 25-question result. Ranges, not an invented precise overall.",
  },
  {
    title: "The right test for your goal",
    body: "Use the \"which Spanish test do you need?\" guide: DELE for a lifetime diploma and Spanish university admission, SIELE for a fast 5-year placement, CCSE (with DELE A2) for Spanish nationality.",
  },
  {
    title: "Giving back with every attempt",
    body: "25% of all AlmiWorld income supports the Shamool Foundation's free school in Lahore — free education and a daily meal for children who'd otherwise go without.",
  },
];

// Illustrative sample DELE report shown in the hero. DELE is APTO/NO APTO — there
// is NO overall band. Each skill is /25; the two level-dependent groups each total
// /50 with a 30/50 floor (this sample uses the B1–C1 comprensión/expresión
// pairing). These numbers are an example only; the card is clearly labelled a
// sample — never a real candidate, never a real DELE score.
const DELE_GROUPS: { name: string; channel: string; total: number; skills: { name: string; score: number }[] }[] = [
  {
    name: "Grupo 1",
    channel: "Comprensión",
    total: 38,
    skills: [
      { name: "Comprensión de lectura", score: 20 },
      { name: "Comprensión auditiva", score: 18 },
    ],
  },
  {
    name: "Grupo 2",
    channel: "Expresión",
    total: 33,
    skills: [
      { name: "Expresión escrita", score: 16 },
      { name: "Expresión oral", score: 17 },
    ],
  },
];

function DeleCardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-3xl border border-almi-bg-peach bg-almi-paper p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-almi-text-muted">Sample DELE report</p>
          <span className="rounded-full bg-almi-bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-almi-ink">Sample</span>
        </div>

        {/* DELE result = APTO/NO APTO, not an overall band */}
        <div className="mt-4 flex items-end justify-between rounded-2xl bg-almi-coral/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-almi-text-muted">Result · DELE B2</p>
            <p className="mt-0.5 text-4xl font-bold leading-none text-almi-teal">APTO</p>
          </div>
          <span className="rounded-full bg-almi-teal/15 px-3 py-1 text-sm font-bold text-almi-teal">71 / 100</span>
        </div>

        <div className="mt-4 space-y-4">
          {DELE_GROUPS.map((g) => (
            <div key={g.name}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold uppercase tracking-wide text-almi-text-muted">
                  {g.name} · {g.channel}
                </span>
                <span className="font-semibold text-almi-ink">
                  {g.total} / 50 <span className="font-normal text-almi-text-muted">(≥ 30)</span>
                </span>
              </div>
              <ul className="mt-2 space-y-2">
                {g.skills.map((s) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-almi-ink">{s.name}</span>
                      <span className="font-semibold text-almi-ink">{s.score} / 25</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-almi-bg-peach">
                      <div className="h-full rounded-full bg-almi-coral" style={{ width: `${(s.score / 25) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-almi-bg-peach bg-almi-bg px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wider text-almi-teal">Honest feedback · Expresión escrita</p>
          <p className="mt-1 text-sm text-almi-text">
            Task covered, but a single weak group can fail the whole exam — push your writing past the 30/50 group floor, not just the total.
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-almi-text-muted">Illustrative example — not a real DELE score.</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
              ALMISPANISH · DELE · SIELE · CCSE PRACTICE
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold text-almi-ink sm:text-5xl">
              Practise the Spanish exams with honest AI feedback.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-almi-text">
              Real task formats for DELE, SIELE and CCSE — all four skills, every CEFR level
              (A1–C2) — with an honest estimate on each exam&apos;s real scale, mapped to CEFR, so you
              know which test you need and where you stand.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
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

          {/* Illustrative DELE sample card */}
          <DeleCardMockup />
        </div>

        {/* exam family chips */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
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
          <p className="mt-4 text-base text-almi-text">
            One principle runs through it: tell you the truth. Honest feedback, original material, and
            a clear read on what to work on next.
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
                <p className="mt-0.5 text-sm text-almi-text-muted">{s.en}</p>
                <p className="mt-2 text-sm text-almi-text">{s.blurb}</p>
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
            Choose your exam and level, and every module runs at that standard.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((v) => (
              <li key={v} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-5">
                <h3 className="text-base font-semibold text-almi-ink">{v}</h3>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-almi-text-muted">
            DELE covers A1–C2; SIELE covers A1–C1 only; CCSE is a civic pass/fail test, not a CEFR level.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-semibold text-almi-ink">
            Spanish practice mapped to real outcomes.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
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
          <h2 className="font-display text-3xl font-semibold text-almi-ink">One flat rate. No hidden billing games.</h2>
          <p className="mt-3 text-base text-almi-text">
            <span className="font-semibold text-almi-ink">$12/month</span> — 7-day free trial, cancel anytime.
          </p>
          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-almi-text">
            {[
              "Full access to the Expresión escrita & Expresión oral AI feedback engines",
              "Unlimited auto-marked Comprensión auditiva & Comprensión de lectura, free",
              "Full practice for DELE, SIELE and CCSE",
              "100% original pan-Hispanic material across all six CEFR levels",
              "$12/month, one-click cancel from your dashboard",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-almi-teal" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Start practising free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-base font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
            >
              See pricing
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-md text-xs text-almi-text-muted">
            Admission, registration, or a passing test is not a visa or nationality — confirm current
            rules with the Spanish consulate, registro civil, or your university.
          </p>
        </div>
      </section>

      {/* Q&A */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-almi-ink">Questions, answered</h2>
          <dl className="mt-8 space-y-6">
            {[
              {
                q: "How much does it cost?",
                a: "$12/month with a 7-day free trial. Comprensión auditiva and de lectura practice is free; AI feedback on Expresión escrita and oral is part of Pro.",
              },
              {
                q: "Which Spanish exams do you cover?",
                a: "DELE, SIELE and CCSE, across all six CEFR levels.",
              },
              {
                q: "Are the Writing and Speaking scores official?",
                a: "No. They are AI criteria-based estimates to guide your preparation — only the Instituto Cervantes and SIELE award real results.",
              },
              {
                q: "Do I need an account?",
                a: "Yes — create a free account to practise Comprensión auditiva and de lectura; a 7-day trial adds AI Expresión escrita and oral feedback.",
              },
              {
                q: "Can I cancel?",
                a: "Yes, anytime, from your account. Cancel before the trial ends and you pay nothing.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
                <dt className="font-semibold text-almi-ink">{item.q}</dt>
                <dd className="mt-2 text-sm text-almi-text">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 text-center">
            <Link href="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep">
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
