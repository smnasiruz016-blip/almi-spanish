import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { programmesByUniversity, PROGRAMME_COUNT } from "@/lib/seo/programmes";

export const metadata: Metadata = {
  title: "Spanish degree programmes — DELE / SIELE level by programme",
  description:
    "Named degree programmes across 25 Spanish universities (from open-data catalogues), with the Spanish level commonly required. Practise DELE and SIELE honestly on the real scale.",
  alternates: { canonical: `${SITE_URL}/programs` },
};

export default function ProgramsIndex() {
  const byUni = programmesByUniversity();
  const unis = [...byUni.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Spanish degree programmes
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-almi-text">
            {PROGRAMME_COUNT.toLocaleString()} named programmes across 25 Spanish universities, from public
            open-data catalogues. Each is taught in Spanish; the exact entry level is set per programme —
            always confirm with the university.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {unis.map((uni) => (
            <div key={uni}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-almi-coral">
                {uni} <span className="text-almi-text-muted">({byUni.get(uni)!.length})</span>
              </h2>
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {byUni
                  .get(uni)!
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/program/${p.slug}`}
                        className="block rounded-lg px-3 py-1.5 text-sm text-almi-ink hover:bg-almi-bg-peach/50"
                      >
                        <span className="text-xs text-almi-text-muted">{p.level}</span> · {p.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
