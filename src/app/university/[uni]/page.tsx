import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { UNIVERSITIES, findUniversity, languageLine } from "@/lib/seo/universities";

export const revalidate = 86_400;
export const dynamicParams = true;

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ uni: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uni: string }>;
}): Promise<Metadata> {
  const { uni } = await params;
  const u = findUniversity(uni);
  if (!u) return {};
  const url = `${SITE_URL}/university/${u.slug}`;
  return {
    title: `${u.name} — Spanish level for admission (${u.country.name})`,
    description:
      `What Spanish level ${u.name} in ${u.country.name} commonly asks for — around DELE B2 for a ` +
      `Spanish-taught degree, confirmed per programme. Practise DELE and SIELE on the real scale.`,
    alternates: { canonical: url },
    robots: u.verified ? undefined : { index: false, follow: true },
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ uni: string }>;
}) {
  const { uni } = await params;
  const u = findUniversity(uni);
  if (!u) notFound();

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-almi-coral">
            ALMISPANISH · UNIVERSITY · {u.country.name.toUpperCase()}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-almi-ink sm:text-4xl">{u.name}</h1>
          <p className="mt-2 text-base text-almi-text-muted">
            {[u.city, u.country.name].filter(Boolean).join(" · ")}
            {u.controlType ? ` · ${u.controlType}` : ""}
          </p>
          <p className="mt-5 text-lg text-almi-text">{languageLine(u)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-almi-coral px-7 py-3 text-base font-semibold text-almi-ink hover:bg-almi-coral-deep"
            >
              Practise DELE / SIELE free
            </Link>
            {u.officialWebsite && (
              <a
                href={u.officialWebsite}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-almi-ink/15 px-6 py-3 text-sm font-semibold text-almi-ink hover:bg-almi-bg-peach/50"
              >
                Official website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {u.subjects.length > 0 && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-almi-coral">
              Subjects taught
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {u.subjects.map((s) => (
                <li key={s} className="rounded-full bg-almi-bg-peach px-3 py-1 text-sm text-almi-ink">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="px-6 py-10">
        <p className="mx-auto max-w-2xl text-center text-sm text-almi-text-muted">
          Admission is not a visa, and language requirements are set per programme — confirm the current
          requirement with {u.name}.
          {u.source?.publisher && (
            <>
              {" "}University details via {u.source.url ? (
                <a href={u.source.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
                  {u.source.publisher}
                </a>
              ) : (
                u.source.publisher
              )}.
            </>
          )}
        </p>
      </section>
    </main>
  );
}
