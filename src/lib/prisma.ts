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
