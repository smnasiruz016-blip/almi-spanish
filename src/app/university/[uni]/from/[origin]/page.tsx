import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { findUniversity, languageLine, entryLine } from "@/lib/seo/universities";
import { findOrigin, type Origin } from "@/lib/seo/origins";
import type { University } from "@/lib/seo/universities";

// On-demand ISR: 465 unis × 196 origins is ~90k pages — built on first request and
// cached, not prerendered at build. The sitemap lists them so Google discovers them.
export const revalidate = false;
export const dynamicParams = true;
export function generateStaticParams() {
  return [] as { uni: string; origin: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uni: string; origin: string }>;
}): Promise<Metadata> {
  const { uni, origin } = await params;
  const u = findUniversity(uni);
  const o = findOrigin(origin);
  if (!u || !o) return {};
  const url = `${SITE_URL}/university/${u.slug}/from/${o.slug}`;
  return {
    title: `Study at ${u.name} from ${o.name} — Spanish level & entry`,
    description:
      `From ${o.name} to ${u.name} in ${u.country.name}: the Spanish level commonly required (around ` +
      `DELE B2, confirm per programme), your entry route (${entryLine(u, o).short}), and honest DELE/SIELE practice.`,
    alternates: { canonical: url },
    robots: u.verified ? undefined : { index: false, follow: true },
  };
}

export default async function UniversityFromOriginPage({
  params,
}: {
  params: Promise<{ uni: string; origin: string }>;
}) {
  const { uni, origin } = await params;
  const u: University | undefined = findUniversity(uni);
  const o: Origin | undefined = findOrigin(origin);
  if (!u || !o) notFound();

  const entry = entryLine(u, o);

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · {o.name.toUpperCase()} → {u.country.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-almi-ink sm:text-4xl">
            Study at {u.name} from {o.name}
          </h1>
          <p className="mt-2 text-base text-almi-text-muted">
            {[u.city, u.country.name].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-3 text-lg text-almi-text-muted" lang={o.lang}>
            {o.nativeStudy} · {o.nativeExam}
          </p>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Spanish level</p>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">{languageLine(u)}</p>
          </div>

          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">
              Entry from {o.name} · {entry.short}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">{entry.line}</p>
          </div>

          {u.subjects.length > 0 && (
            <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Subjects taught</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {u.subjects.map((s) => (
                  <li key={s} className="rounded-full bg-almi-bg-peach px-3 py-1 text-sm text-almi-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-3">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
          >
            Practise DELE / SIELE free
          </Link>
          <Link
            href={`/university/${u.slug}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
          >
            About {u.name} →
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-almi-text-muted">
          Admission is not a visa, and language requirements are set per programme — confirm the current
          requirement with {u.name} and the {u.country.name} immigration authorities.
          {u.source?.publisher && <> University details via {u.source.publisher}.</>}
        </p>
      </section>
    </main>
  );
}
