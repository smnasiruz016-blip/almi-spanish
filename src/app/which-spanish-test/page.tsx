import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Which Spanish test do you need? DELE vs SIELE vs CCSE",
  description:
    "An honest guide to choosing the right Spanish exam for your goal — Spanish nationality (DELE A2 + CCSE), study in Spain or Latin America (DELE / SIELE), a fast pan-Hispanic level certificate (SIELE), or a lifetime diploma (DELE). Mapped to CEFR.",
  alternates: { canonical: `${SITE_URL}/which-spanish-test` },
};

type Row = { goal: string; exam: string; fact: string };

const ROWS: Row[] = [
  {
    goal: "Spanish nationality",
    exam: "DELE A2 + CCSE",
    fact: "For applicants who are not from a Spanish-speaking country, the standard route is DELE A2 (language, lifetime valid) plus CCSE (civics, 15/25). Nationals of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea, Portugal and people of Sephardic origin are generally DELE-exempt, but CCSE applies to virtually everyone.",
  },
  {
    goal: "A lifetime credential",
    exam: "DELE A1–C2",
    fact: "DELE diplomas never expire. Scored APTO/NO APTO — you need ≥60% overall, ≥60% in each of the two groups, AND ≥25% in every single skill.",
  },
  {
    goal: "A fast, flexible level certificate",
    exam: "SIELE Global",
    fact: "One sitting, results in weeks, 0–1000 (CEFR A1–C1), no pass or fail. Valid 5 years. Pan-Hispanic — accepted across Spain and Latin America.",
  },
  {
    goal: "Study in Spain",
    exam: "DELE B1/B2/C1 or SIELE",
    fact: "Many universities accept DELE or SIELE for admission; the required level varies. Confirm the exact requirement with the university.",
  },
  {
    goal: "Study or work in Latin America",
    exam: "SIELE (or DELE)",
    fact: "SIELE is co-issued by UNAM (Mexico), Salamanca and Buenos Aires, so its audio and usage are pan-Hispanic — a natural fit across the region.",
  },
  {
    goal: "Prove only one or two skills",
    exam: "SIELE S1–S5 modalities",
    fact: "Independent modalities certify single or partial skills on their own sub-scales — choose by which skills your goal requires.",
  },
];

const CONFIRM =
  "Admission, registration or naturalisation is not a visa — confirm current rules with the Spanish consulate, registro civil, the university, or Instituto Cervantes.";

export default function WhichSpanishTestPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Which Spanish test do you need?",
    itemListElement: ROWS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${r.goal} → ${r.exam}`,
    })),
  };

  return (
    <main className="px-6 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">ALMISPANISH GUIDE</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-almi-ink">
          Which Spanish test do you need?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-almi-text">
          Spanish isn&apos;t one exam. The right test depends entirely on your goal — nationality,
          study, work, or a lifetime credential — and each is scored on a different scale. Here is the
          honest version, mapped to CEFR.
        </p>

        <div className="mt-10 space-y-4">
          {ROWS.map((r) => (
            <div key={r.goal} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h2 className="font-display text-lg font-semibold text-almi-ink">{r.goal}</h2>
                <span className="text-sm font-semibold text-almi-coral">{r.exam}</span>
              </div>
              <p className="mt-2 text-sm text-almi-text">{r.fact}</p>
              <p className="mt-2 text-xs text-almi-text-muted">{CONFIRM}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-almi-bg-peach bg-almi-bg-peach/40 p-6 text-sm text-almi-text">
          <p className="font-semibold text-almi-ink">How the scoring differs</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>DELE</strong> — each skill /25 → /100 in two groups (the pairing depends on the level: A1/A2 group written vs oral skills; B1–C1 group comprehension vs expression). APTO needs ≥60% total (60/100), ≥60% per group (30/50) <em>and</em> ≥25% in every skill. Lifetime diploma.</li>
            <li><strong>SIELE</strong> — each skill 0–250 → 0–1000, no pass/fail; maps to CEFR A1–C1. Certificate valid 5 years.</li>
            <li><strong>CCSE</strong> — 25 civic-knowledge questions from the official 300-pool; pass 15/25. Not a CEFR test — paired with DELE A2 for nationality.</li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
          >
            Practise free for your exam
          </Link>
        </div>
      </div>
    </main>
  );
}
