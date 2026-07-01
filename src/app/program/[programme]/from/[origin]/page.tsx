import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { findProgramme, programmeLanguageLine, isIndexableProgramme } from "@/lib/seo/programmes";
import { findOrigin, visaRoute, type Origin } from "@/lib/seo/origins";

// On-demand ISR: 2,024 programmes × 196 origins ≈ 397k pages — built on first request,
// not prerendered. The chunked sitemap lists them for discovery.
export const revalidate = 86_400;
export const dynamicParams = true;
export function generateStaticParams() {
  return [] as { programme: string; origin: string }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programme: string; origin: string }>;
}): Promise<Metadata> {
  const { programme, origin } = await params;
  const p = findProgramme(programme);
  const o = findOrigin(origin);
  if (!p || !o) return {};
  const url = `${SITE_URL}/program/${p.slug}/from/${o.slug}`;
  return {
    title: `${p.name} from ${o.name} — Spanish level & entry`,
    description:
      `Study ${p.name} (${p.level}) at ${p.university} from ${o.name}: the Spanish level commonly required, ` +
      `your entry route (${visaRoute(o).short}), and honest DELE / SIELE practice.`,
    alternates: { canonical: url },
    robots: isIndexableProgramme(p) ? undefined : { index: false, follow: true },
  };
}

export default async function ProgrammeFromOriginPage({
  params,
}: {
  params: Promise<{ programme: string; origin: string }>;
}) {
  const { programme, origin } = await params;
  const p = findProgramme(programme);
  const o: Origin | undefined = findOrigin(origin);
  if (!p || !o) notFound();

  const visa = visaRoute(o);

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · {o.name.toUpperCase()} → {p.region.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-almi-ink sm:text-4xl">
            {p.name} — from {o.name}
          </h1>
          <p className="mt-2 text-base text-almi-text-muted">
            {p.level} · {p.university}
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
            <p className="mt-2 text-sm leading-relaxed text-almi-text">{programmeLanguageLine(p)}</p>
          </div>
          <div className="rounded-2xl border border-almi-bg-peach bg-almi-paper p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-almi-coral">Entry from {o.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-almi-text">{visa.line}</p>
          </div>
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
            href={`/program/${p.slug}`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
          >
            About this programme →
          </Link>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-almi-text-muted">
          Admission is not a visa, and the language requirement is set per programme — confirm with{" "}
          {p.university}. Programme data via {p.source.publisher}
          {p.dated ? " (catalogue vintage 2015/16 — confirm the programme is still offered)." : "."}
        </p>
      </section>
    </main>
  );
}
