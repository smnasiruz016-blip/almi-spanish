import { PrismaClient } from "@prisma/client";

// Normalize the pooled connection string for Prisma on serverless. The Neon-Vercel
// integration sets DATABASE_URL to the PgBouncer pooled host with
// `channel_binding=require&sslmode=require`, but WITHOUT `pgbouncer=true`. On
// Vercel Functions that combination makes every query fail (prepared-statement /
// channel-binding errors) — the exact 500 that hit the sibling products. We fix it
// at the client layer (survives integration env re-syncs): force pgbouncer=true +
// sslmode=require and drop channel_binding on the pooled host. Direct/unpooled
// hosts are left untouched.
function pooledDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("-pooler")) {
      u.searchParams.set("pgbouncer", "true");
      u.searchParams.set("sslmode", "require");
      u.searchParams.delete("channel_binding");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

// Singleton pattern for Next.js dev — prevents the "too many connections"
// error when hot-reloading. In production each lambda gets its own client.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: pooledDatabaseUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Prisma error codes that mean "the connection failed", not "the query was wrong".
 *
 * Only these are retried. A P2002 unique-constraint violation or a malformed query is
 * deterministic — retrying it just fails twice and doubles the latency of a page that
 * was going to error anyway. The difference matters: a retry that hides a real bug is
 * worse than no retry.
 *
 *   P1001 can't reach database server        P1002 server reached but timed out
 *   P1008 operation timed out                P1017 server closed the connection
 *   P2024 timed out fetching a pooled connection
 */
const RETRYABLE_DB_CODES = new Set(["P1001", "P1002", "P1008", "P1017", "P2024"]);

function isRetryableDbError(e: unknown): boolean {
  const code = (e as { code?: unknown })?.code;
  if (typeof code === "string" && RETRYABLE_DB_CODES.has(code)) return true;
  // Prisma does not always attach a code (initialization errors, raw driver faults),
  // so fall back to the message — matched narrowly, never on the word "error".
  const msg = e instanceof Error ? e.message : String(e ?? "");
  return /can't reach database server|connection closed|connection reset|server has closed the connection|timed out fetching a new connection|ECONNRESET|ETIMEDOUT/i.test(msg);
}

/**
 * Run a DB read, retrying ONCE on a connection-class failure.
 *
 * WHY THIS EXISTS. AlmiSpanish's /api/status was flagged HTTP 500 by AlmiMonitor while
 * the app was entirely healthy: homepage 200, every page 200, the same endpoint 200 on
 * every subsequent probe, item count exactly at baseline, last deploy 8 days earlier,
 * and function invocations of $0.31 for a 28-day cycle — nothing like a crash loop.
 * What is left is a single transient failure: this is a low-traffic product on Neon,
 * whose compute autosuspends, and the first query against a resuming compute can fail
 * outright. There was no retry anywhere in the path, so one unlucky request became one
 * 500, and one 500 became a red line in the weekly health mail.
 *
 * A health endpoint that reports DOWN because the database was asleep is reporting on
 * the wrong thing, and it is expensive in a way that does not show on a bill: it trains
 * people to skim past the weekly mail, which is how a real outage gets missed.
 *
 * ONE retry, not a loop: if a second attempt against a woken compute also fails, that
 * is a real fault and should surface as one. The backoff is short because this runs
 * inside a request — long enough for a Neon compute to finish resuming, not long enough
 * for the caller to notice.
 *
 * ⚠️ NOT SHARED YET. Thirteen sibling products have a byte-identical /api/status with
 * the same missing retry (verified 2026-07-28: spanish, french, goethe, danish, dutch,
 * icelandic, portuguese, swedish, norwegian, italian, korean, japanese, celpip, swiss —
 * all try/catch, none retrying). There is no shared status module to fix once; they are
 * copies. Promoting this to @smnasiruz016-blip/almi-data is the right home and needs a
 * package publish plus a version bump in each repo.
 */
export async function withDbRetry<T>(op: () => Promise<T>, backoffMs = 300): Promise<T> {
  try {
    return await op();
  } catch (e) {
    if (!isRetryableDbError(e)) throw e;
    await new Promise((r) => setTimeout(r, backoffMs));
    return await op();
  }
}
