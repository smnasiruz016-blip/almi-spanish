import fs from "node:fs";
const SP = "C:/Users/Lenovo/AppData/Local/Temp/claude/C--Users-Lenovo/ddf20eb0-6c79-470f-a7ad-36f929ade5c5/scratchpad";
const OUT = "C:/Projects/almi-spanish/src/data/spanish-programmes.json";

const deburr = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugify = (s) =>
  deburr(String(s)).toLowerCase().replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const titleCaseCaps = (s) =>
  s.replace(/\s+/g, " ").trim().toLowerCase()
    .replace(/(^|[\s/(-])([a-záéíóúñü])/g, (a, sep, ch) => sep + ch.toUpperCase());
const norm = (s) =>
  deburr(s).toUpperCase().replace(/[^A-Z0-9]+/g, " ")
    .replace(/\b(DE|DEL|LA|LAS|LOS|EL|Y)\b/g, " ").replace(/\s+/g, " ").trim();

// ---- 1. existing Spain programmes: backfill country = Spain ----
const existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
for (const p of existing) {
  if (!p.country) p.country = { iso2: "ES", name: "Spain" };
}
// drop any previously-added CO rows so re-runs are idempotent
const spain = existing.filter((p) => p.country.iso2 === "ES");

// ---- 2. Colombia (SNIES via datos.gov.co, CC BY-SA 4.0) ----
// Source: MEN_MATRICULA_ESTADISTICA_ES (id 5wck-szir), distinct programmes for 2021.
const coRaw = JSON.parse(fs.readFileSync(`${SP}/co-programmes.json`, "utf8"));
const coUnis = JSON.parse(fs.readFileSync("C:/Projects/almi-spanish/src/data/spanish-universities.json", "utf8"))
  .filter((u) => u.country.iso2 === "CO");

// map normalised SNIES name -> our uni. Base = uni's own name; plus explicit aliases
// for official-name / suffix variants found in SNIES.
const ALIASES = {
  "universidad-del-rosario": "COLEGIO MAYOR DE NUESTRA SEÑORA DEL ROSARIO",
  "universidad-pedagogica-y-tecnologica-de-colombia": "UNIVERSIDAD PEDAGOGICA Y TECNOLOGICA DE COLOMBIA - UPTC",
  "universidad-tecnologica-de-pereira": "UNIVERSIDAD TECNOLOGICA DE PEREIRA - UTP",
};
const byNorm = new Map();
for (const u of coUnis) {
  byNorm.set(norm(u.name), u);
  if (ALIASES[u.slug]) byNorm.set(norm(ALIASES[u.slug]), u);
}

const levelOf = (name, nivel) => {
  const n = deburr(name).toUpperCase();
  if (/^ESPECIALIZACION/.test(n)) return "Especialización";
  if (/^MAESTRIA/.test(n)) return "Maestría";
  if (/^DOCTORADO/.test(n)) return "Doctorado";
  if (/^(TECNOLOGIA|TECNICA)/.test(n)) return "Tecnología / Técnica";
  return nivel === "2" ? "Posgrado" : "Pregrado";
};

const co = [];
const seen = new Set();
for (const r of coRaw) {
  const u = byNorm.get(norm(r.ies));
  if (!u) continue;
  const name = titleCaseCaps(r.prog);
  if (!name || name.length < 4) continue;
  const key = u.slug + "|" + name;
  if (seen.has(key)) continue;
  seen.add(key);
  co.push({
    name,
    level: levelOf(r.prog, r.nivel),
    university: u.name,
    country: { iso2: "CO", name: "Colombia" },
    region: "Colombia",
    source: {
      publisher: "SNIES · Ministerio de Educación Nacional (datos.gov.co, CC BY-SA 4.0)",
      url: "https://www.datos.gov.co/resource/5wck-szir",
    },
  });
}

// ---- 2b. Mexico — Instituto Politécnico Nacional (IPN) only ----
// datos.gob.mx is federated per-institution (no national programme registry); IPN is
// the one AlmiStudy Mexican uni that self-publishes open programme data. CC BY 4.0, 2024.
const REPO_RAW = "C:/Projects/almi-spanish/scripts/seo/raw";
const csvRows = (file) => {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const rows = lines.map((l) =>
    (l.match(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g) || [])
      .map((x) => x.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim()));
  const header = rows.shift();
  const pi = header.indexOf("programa");
  return { rows, pi };
};
const mxLevel = (name) => {
  const n = deburr(name).toLowerCase();
  if (/^maestr/.test(n)) return "Maestría";
  if (/^doctor/.test(n)) return "Doctorado";
  if (/^especial/.test(n)) return "Especialidad";
  return "Licenciatura"; // incl. Ingeniería, Médico Cirujano, etc.
};
const ipnUni = JSON.parse(fs.readFileSync("C:/Projects/almi-spanish/src/data/spanish-universities.json", "utf8"))
  .find((x) => x.country.iso2 === "MX" && /Polit/i.test(x.name));
const mx = [];
if (ipnUni) {
  const seenMx = new Set();
  for (const f of ["mx-ipn-matricula-2024.csv", "mx-ipn-programa-2024.csv"]) {
    const { rows, pi } = csvRows(`${REPO_RAW}/${f}`);
    if (pi < 0) continue;
    for (const c of rows) {
      const name = (c[pi] || "").trim();
      if (!name || name.length < 4 || seenMx.has(name)) continue;
      seenMx.add(name);
      mx.push({
        name,
        level: mxLevel(name),
        university: ipnUni.name,
        country: { iso2: "MX", name: "Mexico" },
        region: "México",
        source: {
          publisher: "Instituto Politécnico Nacional (datos.gob.mx, CC BY 4.0)",
          url: "https://www.datos.gob.mx/dataset/matricula_programa_academico_nivel_superior",
        },
      });
    }
  }
}

// ---- 2c. Costa Rica — CONARE diplomas 2021-2025 (datos abiertos, CC BY-SA 4.0) ----
// Distinct (universidad, carrera, grado) pre-extracted from the 32MB CONARE XLSX.
const crRaw = JSON.parse(fs.readFileSync(`${REPO_RAW}/cr-conare-distinct.json`, "utf8"));
const crUnis = JSON.parse(fs.readFileSync("C:/Projects/almi-spanish/src/data/spanish-universities.json", "utf8"))
  .filter((u) => u.country.iso2 === "CR");
// Our CR uni names are English; CONARE uses Spanish — map the state + main private unis.
const CR_ALIASES = {
  "university-of-costa-rica": "Universidad de Costa Rica",
  "national-university-of-costa-rica": "Universidad Nacional",
  "costa-rica-institute-of-technology": "Tecnológico de Costa Rica",
  "distance-state-university-costa-rica": "Universidad Estatal a Distancia",
  "national-technical-university-costa-rica": "Universidad Técnica Nacional",
  "ulacit": "Universidad Latinoamericana de Ciencia y Tecnología",
  "universidad-autonoma-de-centro-america": "Universidad Autónoma de Centro América",
  "universidad-de-iberoamerica": "Universidad de Iberoamérica",
  "universidad-internacional-de-las-americas": "Universidad Internacional de las Américas",
  // EARTH, INCAE, University for Peace are not in the CONARE diploma registry → stay uni-level.
};
const crByNorm = new Map();
for (const u of crUnis) {
  crByNorm.set(norm(u.name), u);
  if (CR_ALIASES[u.slug]) crByNorm.set(norm(CR_ALIASES[u.slug]), u);
}
const titleGrado = (g) =>
  g.toLowerCase().replace(/(^|\s)([a-záéíóúñü])/g, (a, s, c) => s + c.toUpperCase());
const cr = [];
const seenCr = new Set();
for (const r of crRaw) {
  const u = crByNorm.get(norm(r.u));
  if (!u) continue;
  const carrera = String(r.c).replace(/\s+/g, " ").trim();
  const grado = titleGrado(String(r.g).trim());
  if (carrera.length < 4) continue;
  const key = u.slug + "|" + norm(carrera) + "|" + grado;
  if (seenCr.has(key)) continue;
  seenCr.add(key);
  cr.push({
    name: carrera,
    level: grado,
    university: u.name,
    country: { iso2: "CR", name: "Costa Rica" },
    region: "Costa Rica",
    source: {
      publisher: "CONARE — Consejo Nacional de Rectores (datos abiertos, CC BY-SA 4.0)",
      url: "https://www.conare.ac.cr/transparencia/datos-abiertos/",
    },
  });
}

// ---- 3. combine + unique slugs across the whole set ----
const all = [...spain, ...co, ...mx, ...cr];
const used = new Map();
for (const p of all) {
  let base = slugify(`${p.name}-${p.university}`) || "programa";
  let s = base, i = 2;
  while (used.has(s)) s = `${base}-${i++}`;
  used.set(s, true);
  p.slug = s;
}

fs.writeFileSync(OUT, JSON.stringify(all) + "\n");

const byCountry = {};
all.forEach((p) => (byCountry[p.country.name] = (byCountry[p.country.name] || 0) + 1));
console.log("TOTAL programmes:", all.length, "| Spain:", spain.length, "| Colombia:", co.length, "| Mexico(IPN):", mx.length, "| Costa Rica:", cr.length);
console.log("Colombia unis covered:", new Set(co.map((p) => p.university)).size, "/", coUnis.length);
console.log("Costa Rica unis covered:", new Set(cr.map((p) => p.university)).size, "/", crUnis.length);
const clv = {}; cr.forEach((p) => (clv[p.level] = (clv[p.level] || 0) + 1));
console.log("CR levels:", JSON.stringify(clv));
console.log("by country:", JSON.stringify(byCountry));
