// Run one practice item for a chosen exam + level + skill. Loads the item
// server-side and strips answer keys before handing it to the client composer.

import Link from "next/link";
import { findExam } from "@/lib/spanish/exams";
import { LEVELS, SKILL_SLUG, SKILL_LABEL } from "@/lib/spanish/types";
import type { CefrLevel, SpanishSkill } from "@prisma/client";
import { pickItems, stripAnswers } from "@/lib/spanish/session";
import { Composer, type ComposerItem } from "@/components/spanish/Composer";

export const metadata = { title: "Practice run" };

const SLUG_TO_SKILL = Object.fromEntries(
  Object.entries(SKILL_SLUG).map(([skill, slug]) => [slug, skill as SpanishSkill]),
) as Record<string, SpanishSkill>;

export default async function RunPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; level?: string; skill?: string }>;
}) {
  const sp = await searchParams;
  const exam = findExam(sp.exam ?? "");
  const level = sp.level as CefrLevel | undefined;
  const skill = SLUG_TO_SKILL[sp.skill ?? ""];

  if (!exam || !level || !LEVELS.includes(level) || !skill) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-almi-text">That practice link is incomplete.</p>
        <Link href="/practice" className="mt-4 inline-block font-semibold text-almi-coral hover:underline">
          ← Back to practice
        </Link>
      </div>
    );
  }

  const items = await pickItems({ level, skill, exam, limit: 1 });
  const item = items[0];

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-almi-ink">
          No {SKILL_LABEL[skill]} items at {level} yet
        </h1>
        <p className="mt-3 text-sm text-almi-text-muted">
          Original Spanish content is being added wave by wave. Try another level or skill.
        </p>
        <Link href="/practice" className="mt-5 inline-block font-semibold text-almi-coral hover:underline">
          ← Back to practice
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-almi-text-muted">
        {exam.name} · {level} · {SKILL_LABEL[skill]}
      </p>
      <Composer item={stripAnswers(item) as unknown as ComposerItem} examId={exam.id} />
    </div>
  );
}
