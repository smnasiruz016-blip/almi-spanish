// Build-time FORK HYGIENE GATE — the AlmiWorld §7 rule, enforced instead of trusted.
//
// WHY THIS EXISTS. This repo's lineage is:
//   almi-celpip → almi-goethe → almi-french → almi-spanish (you are here)
// Pinned from provenance, NOT assumed: spanish's first commit (2026-06-30) is one day after
// french's (2026-06-29), and spanish's item schema is field-identical to french's
// (level/skill/taskType/examFamily) — the shape french INTRODUCED by refactoring goethe's
// `module`. So the immediate ancestor is AlmiFrench, and above it AlmiGoethe (German) and
// AlmiCELPIP (Canadian English). A Spanish product has no reason to name a French exam, a
// German certificate, or the CLB.
//
// NOTE unlike french (its parent), Spanish exams (DELE/SIELE/CCSE) are for SPAIN, not
// Canada — so this fork has NO legitimate IRCC/CLB context, and the full CELPIP set is
// banned here (french removed IRCC/CLB because it teaches Canada-bound exams; spanish does
// not).
//
// Recurring lesson (documented in almi-swiss): the dangerous case is the LABEL localized
// while the FACT was not, and an identifier shipped in a spelling the banned list didn't
// hold. Product names are ENUMERATED in all four shapes.
//
// ⚠️ RE-CUT NOTES:
//  1. Spanish nouns are THIS product's subject and are NOT banned: DELE, SIELE, CCSE,
//     Instituto Cervantes, es-ES.
//  2. Bare "France"/"Francia"/"français" are NOT banned — a Spanish item may name France as
//     a neighbour/origin (same pattern as norwegian↔Denmark). Only the FRENCH EXAM nouns
//     (TEF/TCF/DELF/DALF/fr-FR) are the ancestor leak.
//  3. German SKILL words banned by WORD BOUNDARY + case (Spanish leer/escuchar/escribir/
//     hablar differ); French exam codes likewise word-boundary (DELF ≠ Spanish DELE).

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "scripts", "prisma"];
const SCAN_EXT = /\.(ts|tsx|js|mjs|json|prisma|css|md)$/;

const ALLOWLIST = new Map([
  ["src/lib/nav/family.ts", "links to sibling AlmiWorld products by name"],
  ["scripts/fork-hygiene-gate.mjs", "documents the banned nouns"],
  // (scripts/seo/build-origins.mjs was a vestigial one-off generator reading french's
  //  origins.json; DELETED rather than allowlisted — removing the leak beats preserving a
  //  blind spot. No allowlist hole remains.)
]);

const LINE_ESCAPE = "hygiene-allow";

// Ancestor (French + German + CELPIP) proper nouns. ⚠️ RE-CUT AT EVERY FORK. Spanish nouns
// are NOT here; bare country names are not here.
const BANNED = [
  // — French (immediate ancestor) — exam / locale. Bare France/français NOT here. —
  "fr-FR",
  // — German (Goethe) — institution / exam / locale —
  "Goethe-Institut", "Goethe-Zertifikat", "TestDaF",
  "de-DE",
  // — CELPIP (root) — Canadian English test + framework (no Canada context here → full set) —
  "CELPIP", "Canadian Language Benchmark",
  "Immigration, Refugees and Citizenship Canada",
  // Sibling/ancestor PRODUCT names appended below — GENERATED, not hand-listed.
];

const ANCESTOR_PRODUCTS = ["celpip", "goethe", "french"];
/** Every form a product slug ships in: almi-x · almi_x · almix · AlmiX. */
function productNameForms(p) {
  return [`almi-${p}`, `almi_${p}`, `almi${p}`, `Almi${p[0].toUpperCase()}${p.slice(1)}`];
}
for (const p of ANCESTOR_PRODUCTS) BANNED.push(...productNameForms(p));
BANNED.push("AlmiCELPIP");

// SELF-CHECK — a global find-replace can rewrite this list to ban our own name.
const SELF_NAMES = ["AlmiSpanish", "almi-spanish", "almi_spanish", "almispanish"];
for (const n of SELF_NAMES) {
  if (BANNED.some((b) => b.toLowerCase() === n.toLowerCase())) {
    console.error("");
    console.error(`FORK-HYGIENE GATE IS MISCONFIGURED: BANNED contains "${n}", which is THIS product's own name.`);
    console.error("Every legitimate mention of ourselves would be reported as an ancestor leak. Fix BANNED.");
    console.error("");
    process.exit(2);
  }
}

// Word-boundary bans (\b). French exam acronyms (TEF/TCF/DELF/DALF) — DELF ≠ Spanish DELE.
// German skill words + telc (Capitalised, case-sensitive). CLB/IRCC Canadian.
const BANNED_WORD = [
  "TEF", "TCF", "DELF", "DALF",                     // French exams (ancestor)
  "CLB", "IRCC", "telc",                            // CELPIP / German exam acronyms
  "Schreiben", "Sprechen", "Hören", "Lesen",        // German skill words
];

// ── Scanning machinery (real-entity-gate design: strip comments, scan STRING values).

function stripComments(text) {
  let out = "";
  let i = 0;
  let quote = null;
  let inLine = false;
  let inBlock = false;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (inLine) {
      if (c === "\n") { inLine = false; out += c; }
      else out += " ";
      i++; continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") { inBlock = false; out += "  "; i += 2; continue; }
      out += c === "\n" ? c : " ";
      i++; continue;
    }
    if (quote) {
      if (c === "\\") { out += text.slice(i, i + 2); i += 2; continue; }
      if (c === quote) quote = null;
      out += c; i++; continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; out += c; i++; continue; }
    if (c === "/" && n === "/") { inLine = true; out += "  "; i += 2; continue; }
    if (c === "/" && n === "*") { inBlock = true; out += "  "; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

// Prisma comments are `//` and `///` — NOT `#`. stripComments handles `//` while
// respecting string literals, so prisma reuses it.

function jsonStrings(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) for (const v of node) jsonStrings(v, out);
  else if (node && typeof node === "object") for (const v of Object.values(node)) jsonStrings(v, out);
  return out;
}

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (e === "node_modules" || e === ".next" || e === ".git") continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.test(e)) out.push(full);
  }
  return out;
}

const violations = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    if (ALLOWLIST.has(rel)) continue;
    const raw = readFileSync(file, "utf8");
    let text;
    if (rel.endsWith(".json")) {
      try { text = jsonStrings(JSON.parse(raw)).join("\n"); }
      catch { text = raw; }
    } else if (rel.endsWith(".prisma")) {
      text = stripComments(raw);   // prisma comments are //
    } else {
      text = stripComments(raw);
    }
    const lines = text.split(/\r?\n/);
    const rawLines = raw.split(/\r?\n/);

    lines.forEach((line, i) => {
      if ((rawLines[i] ?? "").includes(LINE_ESCAPE)) return;
      for (const term of BANNED) {
        if (line.includes(term)) {
          violations.push(`${rel}:${i + 1}  banned ancestor noun "${term}"\n      ${line.trim().slice(0, 120)}`);
        }
      }
      for (const term of BANNED_WORD) {
        if (new RegExp(`\\b${term}\\b`).test(line)) {
          violations.push(`${rel}:${i + 1}  banned ancestor noun "${term}"\n      ${line.trim().slice(0, 120)}`);
        }
      }
    });
  }
}

if (violations.length) {
  console.error("\n✗ FORK HYGIENE GATE FAILED — ancestor content found.\n");
  console.error("  Spain must read as Spain. These are leaks from the fork lineage");
  console.error("  (celpip → goethe → french → spanish).\n");
  for (const v of [...new Set(violations)]) console.error(`  ${v}`);
  console.error(`\n  ${violations.length} violation(s). Fix the FACT, not just the label.\n`);
  process.exit(1);
}

console.log(`✓ Fork hygiene gate: clean (no ancestor nouns across ${SCAN_DIRS.join(", ")}).`);
