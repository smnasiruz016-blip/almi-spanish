import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  ORIGINS,
  findOrigin,
  deleExemptForNationality,
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
  const url = `${SITE_URL}/spanish-nationality/${o.slug}`;
  const exempt = deleExemptForNationality(o);
  return {
    title: `Spanish nationality from ${o.name} — DELE A2 & CCSE requirements`,
    description:
      `What ${o.name} nationals need for Spanish nationality by residence: the ${o.natYears}-year ` +
      `residence track, ${exempt ? "DELE A2 is generally waived (Spanish-speaking country)" : "DELE A2 (or higher)"}, ` +
      `and the CCSE civic test. A requirement, not a guarantee — SIELE is not accepted.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Spanish nationality from ${o.name}`,
      description: `The honest DELE A2 + CCSE requirements and ${o.natYears}-year residence track for ${o.name} nationals.`,
      url,
      siteName: "AlmiSpanish",
      type: "article",
      locale: "en_US",
    },
  };
}

export default async function NationalityOriginPage({
  params,
}: {
  params: Promise<{ origin: string }>;
}) {
  const { origin } = await params;
  const o: Origin | undefined = findOrigin(origin);
  if (!o) notFound();

  const exempt = deleExemptForNationality(o);
  const fast = o.natYears === 2;

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · SPANISH NATIONALITY · {o.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Spanish nationality from {o.name}
          </h1>
          <p className="mt-3 text-lg text-almi-text-muted" lang={o.lang}>
            {o.nativeExam}
          </p>
          <p className="mt-5 text-lg text-almi-text">
            For nationality by residence, {o.name} nationals face two language-and-civics checks — and a
            residence clock. Here is the honest version. None of it is a guarantee; the decision rests with
            the Spanish authorities.
          </p>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Residence track */}
          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Residence required</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-almi-ink">
              {fast ? "2 years" : "10 years"} of legal residence
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">
              {fast
                ? `As an Ibero-American / related country under Código Civil art. 22.1, ${o.name} nationals can generally apply after 2 years of legal residence, rather than the general 10.`
                : `${o.name} nationals generally need 10 years of legal residence before applying. (The 2-year fast track is reserved for Ibero-American and a few related countries.)`}
            </p>
          </div>

          {/* DELE A2 */}
          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Language · DELE A2</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-almi-ink">
              {exempt ? "Generally exempt" : "DELE A2 or higher required"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">
              {exempt
                ? `Because Spanish is an official language of ${o.name}, its nationals are generally exempt from the DELE A2 language requirement. The CCSE civic test still applies. If you want to certify your level anyway, DELE is a lifetime diploma and SIELE is a fast pan-Hispanic option.`
                : `Adults must pass DELE A2 (or a higher DELE level) — a lifetime-valid diploma issued by Instituto Cervantes. It is scored APTO / NO APTO. This is the standard language proof for naturalisation from ${o.name}. SIELE is not accepted for nationality.`}
            </p>
            {!exempt && (
              <Link
                href="/signup"
                className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-almi-coral px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-coral-deep"
              >
                Practise DELE A2 free
              </Link>
            )}
          </div>

          {/* CCSE */}
          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Civics · CCSE</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-almi-ink">
              CCSE — pass 15 of 25
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">
              The CCSE (Conocimientos Constitucionales y Socioculturales de España) is a 25-question civic
              test drawn from the official Instituto Cervantes pool. You pass with 15 correct. It applies to
              virtually all applicants, including {o.name} nationals{exempt ? " who are exempt from DELE" : ""}.
              We only ever practise against the real, official curriculum — never invented facts.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <p className="mx-auto max-w-2xl text-center text-sm text-almi-text-muted">
          A requirement is not a guarantee. Naturalisation is decided by the Spanish authorities, and rules
          change — confirm the current DELE and CCSE requirements with the registro civil and Instituto
          Cervantes. SIELE is not accepted for Spanish nationality.
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/study-in-spain/${o.slug}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-2.5 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
          >
            Study in Spain from {o.name} →
          </Link>
        </div>
      </section>
    </main>
  );
}
