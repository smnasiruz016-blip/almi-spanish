// CCSE mock: a 25-question civic simulacro drawn PER TAREA (the official ~60/40
// blend) from the original 2026-curriculum bank. Questions are loaded server-side
// and answer keys are stripped before anything reaches the client; marking happens
// in /api/spanish/ccse-mock/submit. Not the official CCSE — a practice estimate.

import Link from "next/link";
import { pickCcseMock } from "@/lib/spanish/session";
import { CcseMock, type MockQuestion } from "@/components/spanish/CcseMock";

export const metadata = { title: "Simulacro CCSE" };
export const dynamic = "force-dynamic";

export default async function CcseMockPage() {
  const items = await pickCcseMock();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-almi-ink">El simulacro CCSE aún no está listo</h1>
        <p className="mt-3 text-sm text-almi-text-muted">Estamos añadiendo el banco de preguntas cívicas.</p>
        <Link href="/practice" className="mt-5 inline-block font-semibold text-almi-coral hover:underline">
          ← Volver a practicar
        </Link>
      </div>
    );
  }

  const questions: MockQuestion[] = items.map((it) => {
    const payload = it.payload as {
      tarea?: number;
      questions?: { stem: string; options?: { id: string; text: string }[] }[];
    } | null;
    const q = payload?.questions?.[0];
    return {
      id: it.id,
      tarea: Number(payload?.tarea) || 0,
      stem: q?.stem ?? it.title,
      options: q?.options ?? [
        { id: "true", text: "Verdadero" },
        { id: "false", text: "Falso" },
      ],
    };
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-almi-text-muted">
        CCSE · Simulacro · 25 preguntas
      </p>
      <CcseMock questions={questions} />
    </div>
  );
}
