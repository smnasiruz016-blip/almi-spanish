import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { PROGRAMMES, findProgramme, programmeLanguageLine, isIndexableProgramme } from "@/lib/seo/programmes";

export const revalidate = false;
export const dynamicParams = true;

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ programme: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programme: string }>;
}): Promise<Metadata> {
  const { programme } = await params;
  const p = findProgramme(programme);
  if (!p) return {};
  const url = `${SITE_URL}/program/${p.slug}`;
  return {
    title: `${p.name} — Spanish level (${p.university})`,
    description:
      `${p.name} (${p.level}) at ${p.university}: the Spanish level commonly required, and honest DELE / ` +
      `SIELE practice on the real scale.`,
    alternates: { canonical: url },
    robots: isIndexableProgramme(p) ? undefined : { index: false, follow: true },
  };
}

export default async function ProgrammePage({
  params,
}: {
  params: Promise<{ programme: string }>;
}) {
  const { programme } = await params;
  const p = findProgramme(programme);
  if (!p) notFound();

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · {p.level.toUpperCase()} · {p.country.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-almi-ink sm:text-4xl">{p.name}</h1>
          <p className="mt-2 text-base text-almi-text-muted">{p.university}</p>
          <p className="mt-5 text-lg text-almi-text">{programmeLanguageLine(p)}</p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise DELE / SIELE free
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <p className="mx-auto max-w-2xl text-center text-sm text-almi-text-muted">
          Admission is not a visa, and the language requirement is set per programme — confirm the current
          requirement with {p.university}. Programme data via {p.source.url ? (
            <a href={p.source.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
              {p.source.publisher}
            </a>
          ) : (
            p.source.publisher
          )}
          {p.dated ? " (catalogue vintage 2015/16 — confirm the programme is still offered)." : "."}
        </p>
      </section>
    </main>
  );
}
