// Lightweight ops/health endpoint: confirms the practice item bank is seeded and
// reports active counts per sub-test (no PII, counts only). Used to verify a
// deploy's auto-seed step landed.

import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    // ONE retry on a connection-class failure — see withDbRetry(). A Neon compute
    // resuming from autosuspend can fail the first query on a low-traffic product, and
    // without this that single failure is reported as the product being down.
    const [byModule, total, approvedReviews] = await withDbRetry(() => Promise.all([
      prisma.spanishItem.groupBy({
        by: ["level", "skill"],
        where: { active: true },
        _count: true,
      }),
      prisma.spanishItem.count({ where: { active: true } }),
      prisma.review.count({ where: { approved: true } }),
    ]));
    const items: Record<string, number> = {};
    for (const r of byModule) items[`${r.level}.${r.skill}`] = r._count;
    return NextResponse.json(
      { ok: true, itemsActive: total, items, approvedReviews },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "error" },
      { status: 500 },
    );
  }
}
