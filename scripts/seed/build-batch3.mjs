// Assembles the ten Batch-3 CCSE drafter outputs (raw3/*.json) into a single seed
// file scripts/seed/batch3.ts. Idempotent: re-run safely.
//
// Batch 3 = FULL 2026 CCSE curriculum coverage as SINGLE-QUESTION civic items
// (one item = one question), examFamily "CCSE", bucketed at level A2 /
// COMPRENSION_LECTORA / MCQ so the existing pickItems + scoring flow consume them
// unchanged. Per-item civic metadata (tarea, referenceYear, sourceRef,
// timeSensitive) lives inside payload (the items table has no dedicated columns —
// additive-free). The five official tareas + 60/40 blend are enforced here.
//
// 100% original: questions cover the same public civic FACTS as the official pool
// but reproduce no official CCSE question (Instituto Cervantes copyright).
//
// Run: node scripts/seed/build-batch3.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = resolve(__dirname, "raw3");

// raw file id → tarea (1..5)
const DRAFTERS = [
  ["t1a-corona-gobierno", 1],
  ["t1b-cortes-judicial", 1],
  ["t1c-constitucion-participacion", 1],
  ["t2-derechos-deberes", 2],
  ["t3a-organizacion-territorial", 3],
  ["t3b-geografia-fisica", 3],
  ["t4a-historia", 4],
  ["t4b-cultura", 4],
  ["t5a-servicios-tramites", 5],
  ["t5b-vida-cotidiana", 5],
];

// per-tarea target counts (breadth of the official ~300 pool) + 90% hard floor
const TARGET = { 1: 90, 2: 30, 3: 60, 4: 60, 5: 60 };

// old grouped 5-question CCSE sets to retire (deactivate) once the new bank lands
const OLD_CCSE_TITLES = [
  "CCSE — La Constitución y el Estado",
  "CCSE — Derechos, deberes e instituciones",
  "CCSE — Cultura, geografía y vida cotidiana",
];

const ALLOWED_ITEM_KEYS = new Set([
  "level", "skill", "taskType", "examFamily", "title", "prompt",
  "difficulty", "topicTag", "guidanceNote", "payload",
]);
const ALLOWED_PAYLOAD_KEYS = new Set([
  "tarea", "referenceYear", "sourceRef", "timeSensitive", "passages", "questions",
]);
const VALID_DIFFICULTY = new Set(["FOUNDATION", "CORE", "STRETCH"]);

function extractJson(raw) {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fence ? fence[1] : raw).trim();
  return JSON.parse(body);
}

const all = [];
let problems = 0;

for (const [id, tarea] of DRAFTERS) {
  let raw;
  try {
    raw = readFileSync(`${RAW}/${id}.json`, "utf8");
  } catch {
    console.warn(`SKIP ${id}: raw file not found`);
    continue;
  }
  if (!raw.trim()) { console.warn(`SKIP ${id}: raw file empty`); continue; }
  let items;
  try {
    items = extractJson(raw);
  } catch (e) {
    console.error(`PARSE FAIL ${id}: ${e.message}`);
    process.exit(1);
  }
  for (const it of items) {
    const clean = {};
    for (const k of Object.keys(it)) if (ALLOWED_ITEM_KEYS.has(k)) clean[k] = it[k];
    // force the CCSE bucket fields (all CCSE items share these; kind inside the
    // question — mcq|truefalse — carries the real format, not taskType)
    clean.level = "A2";
    clean.skill = "COMPRENSION_LECTORA";
    clean.taskType = "MCQ";
    clean.examFamily = "CCSE";
    // whitelist payload keys, force tarea/referenceYear to the file's declared values
    if (clean.payload && typeof clean.payload === "object") {
      const cp = {};
      for (const k of Object.keys(clean.payload)) if (ALLOWED_PAYLOAD_KEYS.has(k)) cp[k] = clean.payload[k];
      cp.tarea = tarea;
      cp.referenceYear = 2026;
      clean.payload = cp;
    }
    clean.__tarea = tarea; // scratch for reporting; stripped before emit
    all.push(clean);
  }
}

// ---- integrity checks (structural = hard fail) ------------------------------
for (const it of all) {
  const where = `${it.__tarea} "${it.title}"`;
  if (it.level !== "A2") { console.error(`BAD level (must A2): ${where}`); problems++; }
  if (it.skill !== "COMPRENSION_LECTORA") { console.error(`BAD skill (must reading): ${where}`); problems++; }
  if (it.taskType !== "MCQ") { console.error(`BAD taskType (must MCQ): ${where}`); problems++; }
  if (it.examFamily !== "CCSE") { console.error(`BAD examFamily (must CCSE): ${where}`); problems++; }
  if (!VALID_DIFFICULTY.has(it.difficulty)) { console.error(`BAD difficulty: ${where}`); problems++; }
  if (!it.title || !it.topicTag || !it.prompt) { console.error(`MISSING core field: ${where}`); problems++; }

  const p = it.payload ?? {};
  if (p.referenceYear !== 2026) { console.error(`BAD referenceYear: ${where}`); problems++; }
  if (typeof p.sourceRef !== "string" || !p.sourceRef.trim()) { console.error(`MISSING sourceRef: ${where}`); problems++; }
  if (typeof p.timeSensitive !== "boolean") { console.error(`MISSING/BAD timeSensitive: ${where}`); problems++; }
  if (!Array.isArray(p.passages) || p.passages.length < 1 || !p.passages[0]?.body) {
    console.error(`BAD passages: ${where}`); problems++;
  }
  // SINGLE-QUESTION rule (rejects grouped / productive shapes)
  if (!Array.isArray(p.questions) || p.questions.length !== 1) {
    console.error(`NOT single-question (questions.length must be 1): ${where}`); problems++;
    continue;
  }
  const q = p.questions[0];
  if (!q.id || !q.stem) { console.error(`BAD question (id/stem): ${where}`); problems++; continue; }
  if (q.kind !== "mcq" && q.kind !== "truefalse") { console.error(`BAD kind: ${where} → ${q.kind}`); problems++; }
  if (!Array.isArray(q.options) || q.options.length < 2) { console.error(`BAD options: ${where}`); problems++; continue; }
  if (q.kind === "mcq" && q.options.length !== 3) { console.error(`MCQ needs 3 options: ${where} (has ${q.options.length})`); problems++; }
  if (!q.options.some((o) => o.id === q.answer)) {
    console.error(`BAD answer key (not an option id): ${where} → ${q.answer}`); problems++;
  }
}

// ---- per-tarea counts + 60/40 blend -----------------------------------------
const byTarea = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
for (const it of all) byTarea[it.__tarea]++;
for (const t of [1, 2, 3, 4, 5]) {
  const floor = Math.floor(TARGET[t] * 0.9);
  if (byTarea[t] < floor) {
    console.error(`TAREA ${t} under floor: ${byTarea[t]} < ${floor} (target ${TARGET[t]})`);
    problems++;
  }
}
const govSide = byTarea[1] + byTarea[2] + byTarea[3];
const cultSide = byTarea[4] + byTarea[5];
const total = govSide + cultSide;
const govPct = total ? Math.round((govSide / total) * 100) : 0;
if (govPct < 54 || govPct > 66) {
  console.error(`BLEND off 60/40: government-side ${govPct}% (want ~60%)`);
  problems++;
}

// ---- title dedup (auto-disambiguate; all CCSE share level+skill) ------------
// Collect existing titles from the other seed files (conservative flat match).
const existingTitles = new Set();
for (const src of ["a1", "a2", "b1", "b2", "c1", "c2", "ccse"]) {
  const txt = readFileSync(resolve(__dirname, `${src}.ts`), "utf8");
  const re = /title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m; while ((m = re.exec(txt))) existingTitles.add(m[1]);
}
for (const src of ["batch1", "batch2"]) {
  const txt = readFileSync(resolve(__dirname, `${src}.ts`), "utf8");
  const re = /"title":\s*"((?:[^"\\]|\\.)*)"/g;
  let m; while ((m = re.exec(txt))) existingTitles.add(m[1]);
}
const used = new Set(existingTitles);
let renamed = 0;
const renameLog = [];
for (const it of all) {
  if (!used.has(it.title)) { used.add(it.title); continue; }
  const base = it.title;
  let n = 2, cand = `${base} (${n})`;
  while (used.has(cand)) { n++; cand = `${base} (${n})`; }
  renameLog.push(`${base} → ${cand}`);
  it.title = cand;
  used.add(cand);
  renamed++;
}

// ---- report -----------------------------------------------------------------
console.log("\nPer-tarea counts:");
for (const t of [1, 2, 3, 4, 5]) console.log(`  Tarea ${t}: ${byTarea[t]} (target ${TARGET[t]})`);
console.log(`Government-side (T1–T3): ${govSide} (${govPct}%)  ·  Culture/society-side (T4–T5): ${cultSide} (${100 - govPct}%)`);
console.log(`Total new CCSE items: ${all.length}`);
console.log(`Title collisions auto-renamed: ${renamed}`);
if (renameLog.length) console.log("  " + renameLog.slice(0, 25).join("\n  ") + (renameLog.length > 25 ? `\n  …(+${renameLog.length - 25} more)` : ""));

if (problems) {
  console.error(`\n${problems} structural problem(s) — batch3.ts NOT written.`);
  process.exit(1);
}

// strip scratch key
for (const it of all) delete it.__tarea;

// ---- emit scripts/seed/batch3.ts -------------------------------------------
const header = `// Batch 3 — original CCSE civic-knowledge items covering the FULL official 2026
// curriculum (temario CCSE 2026, Instituto Cervantes). SINGLE-QUESTION items
// (one item = one question), bucketed at level A2 / COMPRENSION_LECTORA / MCQ with
// examFamily "CCSE" so the existing session + scoring flow consume them unchanged.
// Per-item civic metadata (tarea 1–5, referenceYear, sourceRef, timeSensitive) is
// carried inside payload.
//
// 100% original: covers the same public civic FACTS as the official 300-question
// pool but reproduces NO official CCSE question. Every answer is verified against a
// primary official source (see payload.sourceRef).
//
// Generated by scripts/seed/build-batch3.mjs — do not edit by hand; re-run the
// builder to regenerate. Seeding also RETIRES (deactivates) the 3 legacy grouped
// 5-question CCSE sets so item shapes are never mixed.
// Run: npm run seed:batch3   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

const RETIRE_TITLES = ${JSON.stringify(OLD_CCSE_TITLES, null, 2)};

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = `;

const footer = `;

async function main() {
  let created = 0;
  for (const item of ITEMS) {
    const exists = await prisma.spanishItem.findFirst({
      where: { level: item.level, skill: item.skill, title: item.title },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.spanishItem.create({ data: item });
    created += 1;
  }
  // Retire the legacy grouped CCSE sets (deactivate, never delete) so single- and
  // multi-question shapes are never mixed in a draw.
  const retired = await prisma.spanishItem.updateMany({
    where: { examFamily: "CCSE", title: { in: RETIRE_TITLES }, active: true },
    data: { active: false },
  });
  console.log(\`seed:batch3 — \${created} created, \${ITEMS.length - created} already present; \${retired.count} legacy set(s) retired\`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
`;

const out = header + JSON.stringify(all, null, 2) + footer;
writeFileSync(resolve(__dirname, "batch3.ts"), out, "utf8");
console.log(`\nWrote scripts/seed/batch3.ts (${all.length} items).`);
