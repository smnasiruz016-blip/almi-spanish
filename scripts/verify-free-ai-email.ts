// RR-399 A4 · a non-paid account must verify its email before its FREE AI scoring (the same light check as DET, Goethe and French).
// Practice without AI never asks for it, and paid users are unchanged. Pure functions + a source read: no database, no AI.
// Run: npx tsx scripts/verify-free-ai-email.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const ROUTE = "src/app/api/spanish/submit/route.ts";
let failed = 0;
const t = async (name: string, fn: () => unknown | Promise<unknown>) => {
  try { await fn(); console.log(`  PASS ${name}`); } catch (e) { failed++; console.log(`  FAIL ${name}\n       ${(e as Error).message.split("\n")[0]}`); }
};
const HOUR = 3_600_000, DAY = 24 * HOUR;
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

(async () => {
  const fa = await import(pathToFileURL(join(ROOT, "src/lib/billing/free-access.ts")).href);
  const now = Date.now();
  const free = { id: "f", email: "learner@example.com", createdAt: new Date(now - HOUR), subscriptionStatus: null, stripeSubscriptionId: null, subscriptionCurrentPeriodEnd: null, compProUntil: null };

  await t("an unverified free account is refused its free AI scoring, with the exact message", () => {
    assert.equal(fa.freeAiNeedsVerifiedEmail({ ...free, emailVerified: null }), true);
    assert.equal(fa.VERIFY_EMAIL_FOR_FREE_AI, "Please verify your email before your free AI scoring.");
  });
  await t("a verified free account passes", () => {
    assert.equal(fa.freeAiNeedsVerifiedEmail({ ...free, emailVerified: new Date(now - HOUR) }), false);
  });
  await t("paid users are unchanged (a subscriber, and a comped account even without a verified email)", () => {
    const sub = { ...free, emailVerified: new Date(now - 30 * DAY), subscriptionStatus: "active", stripeSubscriptionId: "sub_a", subscriptionCurrentPeriodEnd: new Date(now + 20 * DAY) };
    assert.equal(fa.freeAiNeedsVerifiedEmail(sub), false);
    assert.equal(fa.freeAiNeedsVerifiedEmail({ ...free, emailVerified: null, compProUntil: new Date(now + 20 * DAY) }), false);
  });
  await t("the AI route refuses an unverified free account with 403 BEFORE the free door and BEFORE any AI call", () => {
    const src = strip(readFileSync(join(ROOT, ROUTE), "utf8"));
    const check = src.indexOf("if (freeAiNeedsVerifiedEmail(user))");
    assert.ok(check > 0, "the route does not ask freeAiNeedsVerifiedEmail(user)");
    assert.match(src.slice(check, check + 200), /VERIFY_EMAIL_FOR_FREE_AI \}, \{ status: 403 \}/);
    const door = src.indexOf("aiGate("), ai = src.indexOf("gradeProductive(");
    assert.ok(door > check && ai > check, "the email check must come before aiGate() and gradeProductive()");
  });
  await t("practice without AI never asks for it (the check sits in the AI branch, after the objective marking)", () => {
    const src = strip(readFileSync(join(ROOT, ROUTE), "utf8"));
    assert.ok(src.indexOf("markObjective(") > 0 && src.indexOf("if (freeAiNeedsVerifiedEmail(user))") > src.indexOf("markObjective("));
  });
  console.log(failed ? `\nEMAIL TEST FAIL (${failed})` : "\nEMAIL TEST PASS");
  process.exitCode = failed ? 1 : 0;
})();
