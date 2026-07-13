import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  ORIGINS,
  findOrigin,
  deleExemptForNationality,
  visaRoute,
  type Origin,
} from "@/lib/seo/origins";

export const revalidate = false;
export const dynamicParams = true;

export function generateStaticParams() {
  return ORIGINS.map((o) => ({ origin: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ origin: string }>;
}): Promise<Metadata> {
  const { origin } = await params;
  const o = findOrigin(origin);
  if (!o) return {};
  const url = `${SITE_URL}/which-spanish-test/${o.slug}`;
  return {
    title: `Which Spanish test do you need in ${o.name}? DELE vs SIELE vs CCSE`,
    description:
      `An honest guide for ${o.name}: DELE A2 + CCSE for nationality, DELE or SIELE for study in Spain, ` +
      `SIELE for a fast pan-Hispanic certificate. Native search: “${o.nativeExam}”.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Which Spanish test do you need in ${o.name}?`,
      description: `DELE vs SIELE vs CCSE — the right Spanish exam for your goal, from ${o.name}.`,
      url,
      siteName: "AlmiSpanish",
      type: "article",
      locale: "en_US",
    },
  };
}

type Row = { goal: string; exam: string; fact: string };

function rowsFor(o: Origin): Row[] {
  const exempt = deleExemptForNationality(o);
  const visa = visaRoute(o);
  return [
    {
      goal: "Spanish nationality",
      exam: exempt ? "CCSE (DELE A2 waived)" : "DELE A2 + CCSE",
      fact: exempt
        ? `Because Spanish is official in ${o.name}, its nationals are generally exempt from DELE A2 — but the CCSE civic test (15/25) still applies. Residence track: ${o.natYears} years. SIELE is not accepted for nationality.`
        : `The standard route from ${o.name} is DELE A2 (lifetime-valid) plus the CCSE civic test (15/25). Residence track: ${o.natYears} years. SIELE is not accepted for nationality.`,
    },
    {
      goal: "Study in Spain",
      exam: "DELE B1/B2/C1 or SIELE",
      fact: `Entry route from ${o.name}: ${visa.short}. Universities set the Spanish level for a Spanish-taught programme and accept DELE or SIELE — confirm the exact level with the university.`,
    },
    {
      goal: "A fast, flexible level certificate",
      exam: "SIELE Global",
      fact: "One sitting, 0–1000 (CEFR A1–C1), no pass or fail, valid 5 years. Pan-Hispanic — accepted across Spain and Latin America.",
    },
    {
      goal: "A lifetime credential",
      exam: "DELE A1–C2",
      fact: "DELE diplomas never expire. Scored APTO/NO APTO — ≥60% overall, ≥60% in each group, AND ≥25% in every skill.",
    },
  ];
}

export default async function WhichTestOriginPage({
  params,
}: {
  params: Promise<{ origin: string }>;
}) {
  const { origin } = await params;
  const o: Origin | undefined = findOrigin(origin);
  if (!o) notFound();

  const rows = rowsFor(o);

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · {o.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Which Spanish test do you need in {o.name}?
          </h1>
          <p className="mt-3 text-lg text-almi-text-muted" lang={o.lang}>
            {o.nativeExam}
          </p>
          <p className="mt-5 text-lg text-almi-text">
            Spanish isn&apos;t one exam. The right one depends on your goal — and some facts depend on being
            from {o.name} specifically. Here is the honest breakdown.
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-3xl space-y-4">
          {rows.map((r) => (
            <div key={r.goal} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-almi-ink">{r.goal}</h2>
                <span className="rounded-full bg-almi-bg-peach px-3 py-1 text-xs font-bold text-almi-ink">
                  {r.exam}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-almi-text">{r.fact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
          >
            Practise free
          </Link>
          <Link
            href={`/study-in-spain/${o.slug}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
          >
            Study in Spain from {o.name} →
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-almi-text-muted">
          Admission, registration or naturalisation is not a visa — confirm current rules with the Spanish
          consulate, registro civil, the university, or Instituto Cervantes.
        </p>
      </section>
    </main>
  );
}
