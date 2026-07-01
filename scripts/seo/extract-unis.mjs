import fs from "node:fs";

const all = JSON.parse(fs.readFileSync(
  "C:/Users/Lenovo/Documents/GitHub/almistudy/lib/universities-publishable.json", "utf8"));

// 20 Spanish-speaking countries (Spain + Ibero-America + Equatorial Guinea)
const SP = new Set(["ES","MX","EC","CL","CO","BO","SV","PE","VE","CU","PY","DO","CR","AR","NI","GT","PA","HN","UY","GQ"]);

const rows = all.filter(u => u.publishable && u.country && SP.has(u.country.iso2));

// Trim to a clean, page-ready shape. Keep AlmiStudy's own unique slug as the param.
// noindex only the handful whose site was never verified.
const out = rows.map(u => {
  // shorten over-long names that carry parenthetical native names — keep the lead form.
  const name = u.name;
  return {
    slug: u.slug,
    name,
    city: u.city ?? null,
    country: { iso2: u.country.iso2, name: u.country.name, slug: u.country.slug },
    region: u.region ?? null,
    controlType: u.controlType ?? null,
    officialWebsite: u.officialWebsite ?? null,
    subjects: Array.isArray(u.subjects) ? u.subjects.slice(0, 12) : [],
    verified: u.verificationStatus !== "curator_added_unverified_site", // 3 → noindex
    source: u.source
      ? { title: u.source.title ?? null, publisher: u.source.publisher ?? null, url: u.source.url ?? null }
      : null,
  };
});

out.sort((a, b) => a.country.name.localeCompare(b.country.name) || a.name.localeCompare(b.name));

fs.writeFileSync("C:/Projects/almi-spanish/src/data/spanish-universities.json", JSON.stringify(out) + "\n");

const byC = {};
out.forEach(u => byC[u.country.name] = (byC[u.country.name] || 0) + 1);
console.log("universities written:", out.length);
console.log("noindex (unverified):", out.filter(u => !u.verified).length);
console.log("by country:", JSON.stringify(byC));
console.log("with officialWebsite:", out.filter(u => u.officialWebsite).length);
