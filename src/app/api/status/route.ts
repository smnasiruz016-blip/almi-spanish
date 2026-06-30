// Lightweight ops/health endpoint: confirms the practice item bank is seeded and
// reports active counts per sub-test (no PII, counts only). Used to verify a
// deploy's auto-seed step landed.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const [byModule, total, approvedReviews] = await Promise.all([
      prisma.spanishItem.groupBy({
        by: ["level", "skill"],
        where: { active: true },
        _count: true,
      }),
      prisma.spanishItem.count({ where: { active: true } }),
      prisma.review.count({ where: { approved: true } }),
    ]);
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
