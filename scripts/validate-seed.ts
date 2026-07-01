// Dev-only: validate every seed item's payload against a Zod schema for its skill,
// so a malformed payload is caught here, not at scoring time.
// Run: npm run validate:seed
import { z } from "zod";
import { ITEMS as A1 } from "./seed/a1";
import { ITEMS as A2 } from "./seed/a2";
import { ITEMS as B1 } from "./seed/b1";
import { ITEMS as B2 } from "./seed/b2";
import { ITEMS as C1 } from "./seed/c1";
import { ITEMS as C2 } from "./seed/c2";
import { ITEMS as CCSE } from "./seed/ccse";
import { ITEMS as BATCH1 } from "./seed/batch1";
import { ITEMS as BATCH2 } from "./seed/batch2";
import { ITEMS as BATCH3 } from "./seed/batch3";

const ITEMS = [...A1, ...A2, ...B1, ...B2, ...C1, ...C2, ...CCSE, ...BATCH1, ...BATCH2, ...BATCH3];

const mcqQuestion = z.object({
  id: z.string(),
  stem: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() })),
  answer: z.string(),
});

const readingQuestion = z.object({
  id: z.string(),
  kind: z.enum(["mcq", "match", "truefalse"]),
  stem: z.string(),
  options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  answer: z.string(),
});

const readingSchema = z.object({
  passages: z.array(z.object({ id: z.string(), heading: z.string().optional(), body: z.string() })),
  questions: z.array(readingQuestion),
});

const listeningSchema = z.object({
  audioScript: z.string(),
  speakers: z.array(z.object({ role: z.string(), voice: z.string() })),
  questions: z.array(mcqQuestion),
});

const writingSchema = z.object({
  situation: z.string(),
  instruction: z.string(),
  wordMin: z.number(),
  wordMax: z.number(),
});

const speakingSchema = z.object({
  taskPrompt: z.string(),
  prepSeconds: z.number(),
  speakSeconds: z.number(),
});

type Schema = { safeParse: (v: unknown) => { success: boolean; error?: unknown } };

function schemaFor(skill: string): Schema | null {
  if (skill === "COMPRENSION_LECTORA") return readingSchema;
  if (skill === "COMPRENSION_AUDITIVA") return listeningSchema;
  if (skill === "EXPRESION_ESCRITA") return writingSchema;
  if (skill === "EXPRESION_ORAL") return speakingSchema;
  return null;
}

// Integrity rules:
//   • Writing/Speaking (productive) MUST carry an examFamily (DELE or SIELE).
//   • Reading/Listening (objective) are shared (examFamily null) UNLESS they are
//     CCSE civic items, which are reading-shaped and carry examFamily = CCSE.
let bad = 0;
const titles = new Set<string>();
for (const it of ITEMS) {
  const sc = schemaFor(it.skill as string);
  if (!sc) {
    bad++;
    console.error(`FAIL [${it.skill}] ${it.title}: no schema`);
    continue;
  }
  const res = sc.safeParse(it.payload);
  if (!res.success) {
    bad++;
    console.error(`FAIL [${it.level} ${it.skill}] ${it.title}:`, JSON.stringify(res.error).slice(0, 300));
  }
  const productive = it.skill === "EXPRESION_ESCRITA" || it.skill === "EXPRESION_ORAL";
  const isCcse = it.examFamily === "CCSE";
  if (productive && !it.examFamily) {
    bad++;
    console.error(`FAIL [${it.skill}] ${it.title}: productive item needs examFamily`);
  }
  if (productive && isCcse) {
    bad++;
    console.error(`FAIL [${it.skill}] ${it.title}: CCSE is civic-objective, not a productive skill`);
  }
  if (!productive && it.examFamily && !isCcse) {
    bad++;
    console.error(`FAIL [${it.skill}] ${it.title}: shared item must not set examFamily (unless CCSE)`);
  }
  const key = `${it.level}/${it.skill}/${it.title}`;
  if (titles.has(key)) {
    bad++;
    console.error(`FAIL duplicate: ${key}`);
  }
  titles.add(key);
}
console.log(bad ? `\n${bad} invalid item(s)` : `All ${ITEMS.length} items valid ✓`);
process.exit(bad ? 1 : 0);
