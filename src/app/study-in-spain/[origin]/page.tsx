import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  ORIGINS,
  findOrigin,
  visaRoute,
  nationalityLine,
  type Origin,
} from "@/lib/seo/origins";
import { CEFR_LEVELS, CEFR_LABEL } from "@/lib/spanish/cefr";

export const revalidate = 86_400;
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
  const url = `${SITE_URL}/study-in-spain/${o.slug}`;
  return {
    title: `Study in Spain from ${o.name} — Spanish test, visa & nationality`,
    description:
      `An honest guide for students from ${o.name}: which Spanish exam you need (DELE / SIELE), ` +
      `the real entry route (${visaRoute(o).short}), and the ${o.natYears}-year nationality track. ` +
      `Native search: “${o.nativeStudy}”.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Study in Spain from ${o.name}`,
      description: `${o.nativeStudy} — the honest Spanish-exam, visa and nationality guide for ${o.name}.`,
      url,
      siteName: "AlmiSpanish",
      type: "article",
      locale: "en_US",
    },
  };
}

function Card({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">{label}</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-almi-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-almi-text">{children}</p>
    </div>
  );
}

export default async function StudyInSpainOriginPage({
  params,
}: {
  params: Promise<{ origin: string }>;
}) {
  const { origin } = await params;
  const o: Origin | undefined = findOrigin(origin);
  if (!o) notFound();

  const visa = visaRoute(o);
  const nat = nationalityLine(o);

  return (
    <main>
      {/* Hero — native search wording first, then English */}
      <section className="px-6 pt-16 pb-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · STUDY IN SPAIN · {o.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Study in Spain from {o.name}
          </h1>
          <p className="mt-3 text-lg text-almi-text-muted" lang={o.lang}>
            {o.nativeStudy} · {o.nativeExam}
          </p>
          <p className="mt-5 max-w-2xl text-lg text-almi-text">
            The honest picture for students in {o.name}: which Spanish exam actually fits your goal,
            how you enter Spain ({visa.short}), and — if you settle — the {o.natYears}-year route to
            nationality. Then practise DELE and SIELE task formats with feedback on the real scale.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise free
            </Link>
            <Link
              href="/which-spanish-test"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
            >
              Which Spanish test do you need? →
            </Link>
          </div>
        </div>
      </section>

      {/* Real corridor facts — differentiated per origin */}
      <section className="px-6 pb-12">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <Card label="Entry route" title={visa.short}>
            {visa.line}
          </Card>
          <Card label="Nationality" title={`${nat.short} (DELE A2 + CCSE)`}>
            {nat.line}
          </Card>
          <Card label="For study" title="DELE B1/B2/C1 or SIELE">
            Most Spanish universities accept DELE or SIELE for admission to a Spanish-taught programme;
            the exact level varies by course. SIELE (0–1000, no pass/fail) is a fast pan-Hispanic option;
            DELE is a lifetime diploma. Confirm the required level with the university.
          </Card>
          <Card label="Search intent" title={`How people in ${o.name} search`}>
            <span lang={o.lang}>“{o.nativeStudy}”</span> and <span lang={o.lang}>“{o.nativeExam}”</span>{" "}
            ({o.langLabel}). Whatever the wording, the exam and the level are what a university or the
            registro civil actually checks.
          </Card>
        </div>
      </section>

      {/* Levels */}
      <section className="border-t border-almi-bg-peach bg-almi-bg-peach/40 px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-2xl font-semibold text-almi-ink">
            Practise at every level, A1–C2
          </h2>
          <ul className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
            {CEFR_LEVELS.map((v) => (
              <li key={v} className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-4 text-center">
                <span className="text-base font-semibold text-almi-ink">{CEFR_LABEL[v]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Confirm line */}
      <section className="px-6 py-12">
        <p className="mx-auto max-w-2xl text-center text-sm text-almi-text-muted">
          Admission, registration or naturalisation is not a visa — confirm current rules with the
          Spanish consulate, the registro civil, your university, or Instituto Cervantes. SIELE is not
          accepted for Spanish nationality.
        </p>
      </section>
    </main>
  );
}
