import fs from "node:fs";
const SP = "C:/Users/Lenovo/AppData/Local/Temp/claude/C--Users-Lenovo/ddf20eb0-6c79-470f-a7ad-36f929ade5c5/scratchpad";

const deburr = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugify = (s) =>
  deburr(String(s)).toLowerCase().replace(/[''`]/g, "").replace(/&#39;/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
// Only for ALL-CAPS sources (JCyL). Capitalises the first letter of each word
// (after start / space / slash / paren / hyphen) without breaking on accents.
const titleCaseCaps = (s) =>
  s.replace(/\s+/g, " ").trim().toLowerCase()
    .replace(/(^|[\s/(-])([a-záéíóúñü])/g, (a, sep, ch) => sep + ch.toUpperCase());

function normLevel(raw) {
  const t = deburr(String(raw)).toLowerCase();
  if (t.includes("doble")) return "Doble Grado";
  if (t.startsWith("g") || t.includes("grado") || t.includes("grau")) return "Grado";
  if (t.includes("master") || t.includes("máster") || t.includes("master")) return "Máster";
  if (t.includes("doctor")) return "Doctorado";
  return "Grado";
}

const out = [];
// caps=true only for ALL-CAPS sources (JCyL); others are already proper-cased.
const push = (name, level, university, region, pub, url, extra = {}, caps = false) => {
  const nm = (caps ? titleCaseCaps(name) : String(name).replace(/\s+/g, " ").trim());
  if (!nm || nm.length < 4) return;
  out.push({ name: nm, level: normLevel(level), university, country: { iso2: "ES", name: "Spain" }, region, source: { publisher: pub, url }, ...extra });
};

// ---- 1. Murcia (datos.um.es JSON) — grado + máster ----
for (const [file, lvl] of [["um-grado.json", "Grado"], ["um-master.json", "Máster"]]) {
  const arr = JSON.parse(fs.readFileSync(`${SP}/${file}`, "utf8"));
  const seen = new Set();
  for (const r of arr) {
    const n = r.titulacion;
    if (!n || seen.has(n)) continue;
    seen.add(n);
    push(n, lvl, "Universidad de Murcia", "Región de Murcia",
      "datos.um.es (Universidad de Murcia)", "https://datos.um.es/");
  }
}

// ---- 2. Castilla y León (JCyL open data CSV, latin1) ----
for (const [file, lvl] of [["jcyl-grados.csv", "Grado"], ["jcyl-master.csv", "Máster"]]) {
  const txt = fs.readFileSync(`${SP}/${file}`, "latin1");
  const lines = txt.split(/\r?\n/).slice(1).filter(Boolean);
  for (const line of lines) {
    const c = line.split(";");
    if (c.length < 5) continue;
    const uni = `Universidad de ${c[0].trim()}`;
    const name = c[4].trim();
    if (!name) continue;
    push(name, lvl, uni, "Castilla y León",
      "Junta de Castilla y León (datos abiertos)", "https://datosabiertos.jcyl.es/", {}, true);
  }
}

// ---- 3. Granada (UGR open data CSV, UTF-8) — 2015/16, flag dated ----
for (const f of ["ugr-0.csv", "ugr-1.csv", "ugr-2.csv"]) {
  const txt = fs.readFileSync(`${SP}/${f}`, "utf8");
  const lines = txt.split(/\r?\n/).slice(1).filter(Boolean);
  for (const line of lines) {
    // quoted CSV: "Titulación","Rama","Centro","Campus"
    const m = line.match(/^"([^"]*)"/);
    if (!m) continue;
    const name = m[1].trim();
    if (!name) continue;
    const lvl = f === "ugr-1.csv" ? "Máster" : f === "ugr-2.csv" ? "Doctorado" : "Grado";
    push(name, lvl, "Universidad de Granada", "Andalucía",
      "Universidad de Granada (datos abiertos)", "https://datosabiertos.ugr.es/", { dated: true });
  }
}

// ---- 4. Extremadura (opendata.unex.es SPARQL JSON) — active only ----
{
  const j = JSON.parse(fs.readFileSync(`${SP}/unex.json`, "utf8"));
  const seen = new Set();
  for (const b of j.results.bindings) {
    const name = b.foaf_name?.value;
    const uri = b.uri?.value || "";
    if (!name) continue;
    // active = no extinction course, or extinction year in the future (>=2025)
    const ext = b.ou_cursoExtincion?.value;
    const extYear = ext ? parseInt(ext.slice(0, 4), 10) : null;
    if (extYear !== null && extYear < 2025) continue; // phased out
    // skip old Licenciatura/Diplomatura by URI segment
    if (/\/(Licenciatura|Diplomatura|Ingenieria)\//i.test(uri)) continue;
    const lvl = /\/Master\//i.test(uri) ? "Máster" : /\/Doctorado\//i.test(uri) ? "Doctorado" : "Grado";
    const key = name + lvl;
    if (seen.has(key)) continue;
    seen.add(key);
    push(name, lvl, "Universidad de Extremadura", "Extremadura",
      "opendata.unex.es (Universidad de Extremadura)", "https://opendata.unex.es/");
  }
}

// ---- 5. Valencia (ICV WFS 2.0 XML) — 9 universities ----
{
  const xml = fs.readFileSync(`${SP}/gva-full.xml`, "utf8");
  const feats = xml.split("<ms:Titulaciones ").slice(1);
  const get = (block, tag) => {
    const m = block.match(new RegExp(`<ms:${tag}>([^<]*)</ms:${tag}>`));
    return m ? m[1].replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim() : "";
  };
  const seen = new Set();
  for (const raw of feats) {
    const block = raw.split("</ms:Titulaciones>")[0];
    const name = get(block, "nomgrado_c");
    const uni = get(block, "nomuniversidad_c");
    const tipo = get(block, "nomtipo_c") || get(block, "tipo");
    if (!name || !uni) continue;
    const key = uni + "|" + name;
    if (seen.has(key)) continue;
    seen.add(key);
    push(name, tipo || "Grado", uni, "Comunitat Valenciana",
      "Institut Cartogràfic Valencià / GVA", "https://terramapas.icv.gva.es/");
  }
}

// ---- unique slugs across the whole set ----
const used = new Map();
for (const p of out) {
  let base = slugify(`${p.name}-${p.university}`);
  if (!base) base = "programa";
  let s = base, i = 2;
  while (used.has(s)) s = `${base}-${i++}`;
  used.set(s, true);
  p.slug = s;
}

fs.writeFileSync("C:/Projects/almi-spanish/src/data/spanish-programmes.json", JSON.stringify(out) + "\n");

// report
const byPub = {}, byLvl = {}, byUni = new Set();
out.forEach((p) => {
  const src = p.source.publisher.split(" (")[0];
  byPub[src] = (byPub[src] || 0) + 1;
  byLvl[p.level] = (byLvl[p.level] || 0) + 1;
  byUni.add(p.university);
});
console.log("TOTAL programmes:", out.length);
console.log("by source:", JSON.stringify(byPub, null, 0));
console.log("by level:", JSON.stringify(byLvl));
console.log("universities:", byUni.size);
console.log("dated (Granada):", out.filter((p) => p.dated).length);
