import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { universitiesByCountry, UNIVERSITY_COUNT } from "@/lib/seo/universities";

export const metadata: Metadata = {
  title: "Spanish-speaking universities — Spain & Latin America",
  description:
    "Destination universities across the Spanish-speaking world (Spain, Ibero-America and Equatorial Guinea). See the Spanish level each commonly asks for, and practise DELE and SIELE honestly.",
  alternates: { canonical: `${SITE_URL}/universities` },
};

export default function UniversitiesIndex() {
  const byCountry = universitiesByCountry();
  const countries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));

  return (
    <main>
      <section className="px-6 pt-16 pb-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-bold text-almi-ink sm:text-5xl">
            Study in the Spanish-speaking world
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-almi-text">
            {UNIVERSITY_COUNT} universities across Spain, Latin America and Equatorial Guinea, with the
            Spanish level each commonly asks for. Requirements are set per programme — always confirm with
            the university.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {countries.map((country) => (
            <div key={country}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-almi-coral">
                {country}
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {byCountry
                  .get(country)!
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((u) => (
                    <li key={u.slug}>
                      <Link
                        href={`/university/${u.slug}`}
                        className="block rounded-xl border border-almi-bg-peach bg-almi-paper px-4 py-2.5 text-sm text-almi-ink hover:bg-almi-bg-peach/50"
                      >
                        {u.name}
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
