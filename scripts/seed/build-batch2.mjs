// Assembles the eleven Batch-2 drafter outputs (Writing + Speaking, EXAM-SPECIFIC)
// into a single seed file scripts/seed/batch2.ts. Idempotent: re-run safely.
// Cleans stray keys, runs integrity + collision checks, reports per-level/skill/
// exam counts.
//
// Batch 2 differs from Batch 1: productive items are graded on each exam's OWN
// criteria, so every item carries an examFamily (DELE or SIELE) — never null,
// never CCSE. SIELE tops out at C1 (no SIELE C2).
//
// Run: node scripts/seed/build-batch2.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = resolve(__dirname, "raw2");

// raw file id → [examFamily, level]
const DRAFTERS = [
  ["dele-a1", "DELE", "A1"],
  ["dele-a2", "DELE", "A2"],
  ["dele-b1", "DELE", "B1"],
  ["dele-b2", "DELE", "B2"],
  ["dele-c1", "DELE", "C1"],
  ["dele-c2", "DELE", "C2"],
  ["siele-a1", "SIELE", "A1"],
  ["siele-a2", "SIELE", "A2"],
  ["siele-b1", "SIELE", "B1"],
  ["siele-b2", "SIELE", "B2"],
  ["siele-c1", "SIELE", "C1"],
];

// Per-level word-count / timing anchors (must match the drafter briefs exactly).
const ANCHORS = {
  A1: { wordMin: 25, wordMax: 40, prep: 60, speak: 60 },
  A2: { wordMin: 50, wordMax: 70, prep: 90, speak: 90 },
  B1: { wordMin: 100, wordMax: 130, prep: 120, speak: 120 },
  B2: { wordMin: 150, wordMax: 180, prep: 180, speak: 150 },
  C1: { wordMin: 220, wordMax: 260, prep: 240, speak: 180 },
  C2: { wordMin: 300, wordMax: 350, prep: 300, speak: 240 },
};

const ALLOWED_ITEM_KEYS = new Set([
  "level", "skill", "taskType", "examFamily", "title", "prompt",
  "difficulty", "topicTag", "guidanceNote", "payload",
]);
const VALID_DIFFICULTY = new Set(["FOUNDATION", "CORE", "STRETCH"]);

function extractJson(raw) {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fence ? fence[1] : raw).trim();
  return JSON.parse(body);
}

const all = [];
let problems = 0;

for (const [id, exam, level] of DRAFTERS) {
  let raw;
  try {
    raw = readFileSync(`${RAW}/${id}.json`, "utf8");
  } catch {
    console.warn(`SKIP ${id}: raw file not found`);
    continue;
  }
  if (!raw.trim()) {
    console.warn(`SKIP ${id}: raw file empty`);
    continue;
  }
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
    // force examFamily/level to the bucket's declared value (belt + braces)
    clean.examFamily = exam;
    clean.level = level;
    all.push(clean);
  }
}

// ---- integrity checks -------------------------------------------------------
for (const it of all) {
  const productive = it.skill === "EXPRESION_ESCRITA" || it.skill === "EXPRESION_ORAL";
  if (!productive) {
    console.error(`BAD skill (not W/S): ${it.level} ${it.skill} — ${it.title}`);
    problems++;
    continue;
  }
  // exam-specific: examFamily must be DELE or SIELE, never null, never CCSE
  if (it.examFamily !== "DELE" && it.examFamily !== "SIELE") {
    console.error(`BAD examFamily (must be DELE/SIELE): ${it.level} ${it.title} → ${it.examFamily}`);
    problems++;
  }
  // SIELE has no C2
  if (it.examFamily === "SIELE" && it.level === "C2") {
    console.error(`BAD SIELE C2 (SIELE tops out at C1): ${it.title}`);
    problems++;
  }
  // taskType must agree with skill
  const wantTask = it.skill === "EXPRESION_ESCRITA" ? "WRITING_TASK" : "SPEAKING_TASK";
  if (it.taskType !== wantTask) {
    console.error(`BAD taskType: ${it.level} ${it.skill} ${it.title} → ${it.taskType} (want ${wantTask})`);
    problems++;
  }
  if (!VALID_DIFFICULTY.has(it.difficulty)) {
    console.error(`BAD difficulty: ${it.level} ${it.title} → ${it.difficulty}`);
    problems++;
  }
  if (!it.title || !it.topicTag || !it.prompt) {
    console.error(`MISSING core field: ${it.level} ${it.skill} ${JSON.stringify(it.title)}`);
    problems++;
  }
  // payload shape + anchor sanity
  const a = ANCHORS[it.level];
  const p = it.payload ?? {};
  if (it.skill === "EXPRESION_ESCRITA") {
    if (typeof p.situation !== "string" || typeof p.instruction !== "string") {
      console.error(`BAD writing payload (situation/instruction): ${it.level} ${it.title}`);
      problems++;
    }
    if (p.wordMin !== a.wordMin || p.wordMax !== a.wordMax) {
      console.error(`BAD word range: ${it.level} ${it.title} → ${p.wordMin}-${p.wordMax} (want ${a.wordMin}-${a.wordMax})`);
      problems++;
    }
    if (typeof p.instruction === "string" && !p.instruction.includes(String(a.wordMax))) {
      console.error(`WARN instruction omits word count: ${it.level} ${it.title}`);
      problems++;
    }
  } else {
    if (typeof p.taskPrompt !== "string" || !p.taskPrompt.trim()) {
      console.error(`BAD speaking payload (taskPrompt): ${it.level} ${it.title}`);
      problems++;
    }
    if (p.prepSeconds !== a.prep || p.speakSeconds !== a.speak) {
      console.error(`BAD timing: ${it.level} ${it.title} → ${p.prepSeconds}/${p.speakSeconds} (want ${a.prep}/${a.speak})`);
      problems++;
    }
  }
}

// intra-batch title uniqueness per (level, skill) — DB dedup keys on
// {level, skill, title}, so a DELE and SIELE item that share a title at the
// same level+skill would collide and one would be silently skipped.
const seen = new Map();
for (const it of all) {
  const key = `${it.level}/${it.skill}/${it.title}`;
  if (seen.has(key)) {
    console.error(`DUPLICATE within batch (would collide on seed): ${key}`);
    problems++;
  }
  seen.set(key, true);
}

// cross-file title collisions vs existing seed files (a1..c2 + batch1)
const existingTitles = new Set();
for (const src of ["a1", "a2", "b1", "b2", "c1", "c2", "batch1"]) {
  const txt = readFileSync(resolve(__dirname, `${src}.ts`), "utf8");
  const re = /title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(txt))) existingTitles.add(m[1]);
}
// batch1.ts is emitted as JSON, so titles look like  "title": "..."
{
  const txt = readFileSync(resolve(__dirname, "batch1.ts"), "utf8");
  const re = /"title":\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(txt))) existingTitles.add(m[1]);
}
for (const it of all) {
  if (existingTitles.has(it.title)) {
    console.error(`COLLISION with existing seed title: "${it.title}" (${it.level} ${it.examFamily})`);
    problems++;
  }
}

// ---- report -----------------------------------------------------------------
const counts = {};
for (const it of all) {
  const k = `${it.examFamily}/${it.level}`;
  counts[k] ??= { W: 0, S: 0 };
  if (it.skill === "EXPRESION_ESCRITA") counts[k].W++;
  else counts[k].S++;
}
console.log("\nPer exam / level counts (Writing / Speaking):");
for (const [, exam, level] of DRAFTERS) {
  const c = counts[`${exam}/${level}`];
  if (!c) { console.log(`  ${exam} ${level}: (not present)`); continue; }
  const flag = c.W < 16 || c.S < 16 ? "  <-- under 16" : "";
  console.log(`  ${exam} ${level}: ${c.W} W / ${c.S} S${flag}`);
}
console.log(`Total items: ${all.length}`);

if (problems) {
  console.error(`\n${problems} problem(s) — batch2.ts NOT written.`);
  process.exit(1);
}

// ---- emit scripts/seed/batch2.ts -------------------------------------------
const header = `// Batch 2 — original, EXAM-SPECIFIC Writing (Expresión escrita) + Speaking
// (Expresión oral) items, drafted to reach 16+ per skill per level per exam.
// Unlike Batch 1's shared Reading/Listening bank, productive skills are graded on
// each exam's OWN criteria, so examFamily is REQUIRED (DELE A1–C2, SIELE A1–C1 —
// SIELE has no C2). 100% original: task FORMATS mirror the real exams, but no real
// exam question is reproduced — never copied from Instituto Cervantes / Universidad
// de Salamanca / SIELE.
//
// Generated by scripts/seed/build-batch2.mjs — do not edit by hand; re-run the
// builder to regenerate. Run: npm run seed:batch2   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

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
  console.log(\`seed:batch2 — \${created} created, \${ITEMS.length - created} already present\`);
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
writeFileSync(resolve(__dirname, "batch2.ts"), out, "utf8");
console.log(`\nWrote scripts/seed/batch2.ts (${all.length} items).`);
