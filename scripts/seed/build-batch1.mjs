// Assembles the six Batch-1 drafter outputs (Reading + Listening, DELE/SIELE
// shared) into a single seed file scripts/seed/batch1.ts. Idempotent: re-run
// safely. Cleans stray keys, checks intra-batch + cross-file title collisions,
// and reports per-level/skill counts.
//
// Run: node scripts/seed/build-batch1.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = resolve(__dirname, "raw");

// level → raw JSON file (drafter output persisted from context)
const DRAFTERS = [
  ["a1", "A1"],
  ["a2", "A2"],
  ["b1", "B1"],
  ["b2", "B2"],
  ["c1", "C1"],
  ["c2", "C2"],
];

const ALLOWED_ITEM_KEYS = new Set([
  "level", "skill", "taskType", "examFamily", "title", "prompt",
  "difficulty", "topicTag", "guidanceNote", "payload",
]);
const ALLOWED_OPT_KEYS = new Set(["id", "text"]);

function extractJson(raw) {
  // Strip a ```json ... ``` fence if present, else assume raw is JSON.
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fence ? fence[1] : raw).trim();
  return JSON.parse(body);
}

// Recursively drop any option keys other than id/text (kills stray "text2" etc.)
function cleanOptions(questions) {
  for (const q of questions ?? []) {
    if (Array.isArray(q.options)) {
      q.options = q.options.map((o) => {
        const c = {};
        for (const k of Object.keys(o)) if (ALLOWED_OPT_KEYS.has(k)) c[k] = o[k];
        return c;
      });
    }
  }
}

const all = [];
const perLevelPresent = {};
for (const [id, level] of DRAFTERS) {
  let raw;
  try {
    raw = readFileSync(`${RAW}/${id}.json`, "utf8");
  } catch {
    console.warn(`SKIP ${level}: raw file ${id}.json not found`);
    continue;
  }
  if (!raw.trim()) {
    console.warn(`SKIP ${level}: raw file empty`);
    continue;
  }
  let items;
  try {
    items = extractJson(raw);
  } catch (e) {
    console.error(`PARSE FAIL ${level}: ${e.message}`);
    process.exit(1);
  }
  perLevelPresent[level] = true;
  for (const it of items) {
    // whitelist item keys
    const clean = {};
    for (const k of Object.keys(it)) if (ALLOWED_ITEM_KEYS.has(k)) clean[k] = it[k];
    if (clean.payload?.questions) cleanOptions(clean.payload.questions);
    all.push(clean);
  }
}

// ---- integrity checks -------------------------------------------------------
let problems = 0;

// 1. every item is shared Reading/Listening with examFamily null
for (const it of all) {
  const shared = it.skill === "COMPRENSION_LECTORA" || it.skill === "COMPRENSION_AUDITIVA";
  if (!shared) {
    console.error(`BAD skill (not R/L): ${it.level} ${it.skill} — ${it.title}`);
    problems++;
  }
  if (it.examFamily != null) {
    console.error(`BAD examFamily (must be null): ${it.level} ${it.title}`);
    problems++;
  }
  // answer must reference an existing option (mcq) or be true/false
  for (const q of it.payload?.questions ?? []) {
    if (Array.isArray(q.options) && q.options.length) {
      if (!q.options.some((o) => o.id === q.answer)) {
        console.error(`BAD answer key: ${it.level} ${it.title} / ${q.id} → ${q.answer}`);
        problems++;
      }
    } else if (q.answer !== "true" && q.answer !== "false") {
      console.error(`BAD truefalse answer: ${it.level} ${it.title} / ${q.id} → ${q.answer}`);
      problems++;
    }
  }
}

// 2. intra-batch title uniqueness per (level, skill)
const seen = new Map();
for (const it of all) {
  const key = `${it.level}/${it.skill}/${it.title}`;
  if (seen.has(key)) {
    console.error(`DUPLICATE within batch: ${key}`);
    problems++;
  }
  seen.set(key, true);
}

// 3. cross-file title collisions against existing a1..c2 seed files
const existingTitles = new Set();
for (const lvl of ["a1", "a2", "b1", "b2", "c1", "c2"]) {
  const src = readFileSync(resolve(__dirname, `${lvl}.ts`), "utf8");
  // crude but effective: pull every  level: "X" ... title: "Y"  pairing is hard;
  // instead capture each title string and each level string, then rely on the
  // fact that titles are globally distinctive. We conservatively flag any exact
  // title match and resolve by hand if needed.
  const re = /title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) existingTitles.add(m[1]);
}
for (const it of all) {
  if (existingTitles.has(it.title)) {
    console.error(`COLLISION with existing seed title: "${it.title}" (${it.level})`);
    problems++;
  }
}

// ---- report -----------------------------------------------------------------
const counts = {};
for (const it of all) {
  const lvl = it.level;
  counts[lvl] ??= { R: 0, L: 0 };
  if (it.skill === "COMPRENSION_LECTORA") counts[lvl].R++;
  else counts[lvl].L++;
}
console.log("\nPer-level counts (Reading / Listening):");
for (const lvl of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
  if (!counts[lvl]) { console.log(`  ${lvl}: (not present)`); continue; }
  console.log(`  ${lvl}: ${counts[lvl].R} R / ${counts[lvl].L} L`);
}
console.log(`Total items: ${all.length}`);

if (problems) {
  console.error(`\n${problems} problem(s) — batch1.ts NOT written.`);
  process.exit(1);
}

// ---- emit scripts/seed/batch1.ts -------------------------------------------
const header = `// Batch 1 — original DELE/SIELE Reading + Listening items, drafted to reach
// 16+ per skill per level (A1–C2). Reading/Listening are SHARED across DELE and
// SIELE, so examFamily is null. Pan-Hispanic audio voices (Spain + Latin America).
// 100% original: task FORMATS mirror the real exams, but no real exam question is
// reproduced — never copied from Instituto Cervantes / Universidad de Salamanca.
//
// Generated by scripts/seed/build-batch1.mjs — do not edit by hand; re-run the
// builder to regenerate. Run: npm run seed:batch1   (needs DATABASE_URL set)

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
  console.log(\`seed:batch1 — \${created} created, \${ITEMS.length - created} already present\`);
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
writeFileSync(resolve(__dirname, "batch1.ts"), out, "utf8");
console.log(`\nWrote scripts/seed/batch1.ts (${all.length} items).`);
