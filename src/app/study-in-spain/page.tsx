import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { ORIGINS, REGION_ORDER } from "@/lib/seo/origins";

export const metadata: Metadata = {
  title: "Study in Spain — the Spanish test you need, from any country",
  description:
    "Choose your country for an honest guide to studying in Spain: which Spanish exam (DELE / SIELE), the real entry route (EU free movement or student visa), and the route to Spanish nationality.",
  alternates: { canonical: `${SITE_URL}/study-in-spain` },
};

export default function StudyInSpainIndex() {
  const byRegion = new Map<string, typeof ORIGINS>();
  for (const o of ORIGINS) {
    const arr = byRegion.get(o.region) ?? [];
    arr.push(o);
    byRegion.set(o.region, arr);
  }
  const regions = REGION_ORDER.filter((r) => byRegion.has(r));

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Study in Spain — from your country
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-almi-text">
            Every country has its own real corridor to Spain: EU nationals move freely, everyone else needs
            a student visa, and only some countries get the 2-year nationality track. Pick yours for the
            honest picture — which Spanish exam you need, and where you stand.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {regions.map((region) => (
            <div key={region}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-almi-coral">
                {region}
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {byRegion
                  .get(region)!
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/study-in-spain/${o.slug}`}
                        className="block rounded-xl border border-almi-bg-peach bg-almi-paper px-4 py-2.5 text-sm text-almi-ink hover:bg-almi-bg-peach/50"
                      >
                        {o.name}
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
