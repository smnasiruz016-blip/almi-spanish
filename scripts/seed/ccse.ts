// CCSE wave — practice for the Conocimientos Constitucionales y Socioculturales de
// España test (civic knowledge, NOT a CEFR language test). Items are reading-shaped
// MCQ sets that mirror the real format (25 questions, pass 15/25). examFamily = CCSE.
//
// AMAANAT NOTE: these are CIVIC FACTS. Every answer must match the official
// curriculum EXACTLY — never fabricate a civic fact or answer. The questions below
// cover stable, verifiable facts about the Spanish Constitution and society, in the
// spirit of the official public 300-question pool published by the Instituto
// Cervantes. Before a real exam, candidates must study the
// CURRENT annual convocatoria (the pool is updated each year). This is practice
// only — it is not the official manual.
//
// Level is bucketed at A2 (the language level CCSE pairs with for nationality); the
// CCSE itself has no CEFR level.
//
// Run: npm run seed:ccse   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: "CCSE",
    title: "CCSE — La Constitución y el Estado",
    prompt: "Conocimientos constitucionales de España. Elige la respuesta correcta.",
    difficulty: "CORE", topicTag: "ccse-constitucion",
    guidanceNote: "Tema 1 del temario CCSE: Gobierno, legislación y participación ciudadana.",
    payload: {
      passages: [{ id: "p1", body: "Preguntas sobre la Constitución española y la organización del Estado." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿En qué año se aprobó la Constitución española?", options: [{ id: "a", text: "1975" }, { id: "b", text: "1978" }, { id: "c", text: "1981" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Qué forma política tiene el Estado español?", options: [{ id: "a", text: "Monarquía parlamentaria" }, { id: "b", text: "República federal" }, { id: "c", text: "Monarquía absoluta" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "¿Quién es el jefe del Estado en España?", options: [{ id: "a", text: "El presidente del Gobierno" }, { id: "b", text: "El Rey" }, { id: "c", text: "El presidente del Congreso" }], answer: "b" },
        { id: "q4", kind: "mcq", stem: "¿Cómo se llama el Parlamento español?", options: [{ id: "a", text: "Las Cortes Generales" }, { id: "b", text: "La Asamblea Nacional" }, { id: "c", text: "El Consejo de Estado" }], answer: "a" },
        { id: "q5", kind: "mcq", stem: "¿Qué día se celebra el Día de la Constitución?", options: [{ id: "a", text: "El 12 de octubre" }, { id: "b", text: "El 6 de diciembre" }, { id: "c", text: "El 1 de mayo" }], answer: "b" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: "CCSE",
    title: "CCSE — Derechos, deberes e instituciones",
    prompt: "Conocimientos constitucionales de España. Elige la respuesta correcta.",
    difficulty: "CORE", topicTag: "ccse-instituciones",
    guidanceNote: "Tema 1 del temario CCSE: derechos, deberes e instituciones.",
    payload: {
      passages: [{ id: "p1", body: "Preguntas sobre instituciones, derechos y deberes en España." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿A qué edad se alcanza la mayoría de edad en España?", options: [{ id: "a", text: "A los 16 años" }, { id: "b", text: "A los 18 años" }, { id: "c", text: "A los 21 años" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Quién elige al presidente del Gobierno?", options: [{ id: "a", text: "El Congreso de los Diputados" }, { id: "b", text: "El Rey directamente" }, { id: "c", text: "El Tribunal Supremo" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "¿En cuántas comunidades autónomas se organiza España?", options: [{ id: "a", text: "17" }, { id: "b", text: "12" }, { id: "c", text: "25" }], answer: "a" },
        { id: "q4", kind: "mcq", stem: "¿Cuál es la lengua oficial del Estado en toda España?", options: [{ id: "a", text: "El castellano (español)" }, { id: "b", text: "El catalán" }, { id: "c", text: "El gallego" }], answer: "a" },
        { id: "q5", kind: "mcq", stem: "¿Qué tribunal garantiza el cumplimiento de la Constitución?", options: [{ id: "a", text: "El Tribunal Constitucional" }, { id: "b", text: "El Tribunal de Cuentas" }, { id: "c", text: "La Audiencia Nacional" }], answer: "a" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: "CCSE",
    title: "CCSE — Cultura, geografía y vida cotidiana",
    prompt: "Conocimientos socioculturales de España. Elige la respuesta correcta.",
    difficulty: "CORE", topicTag: "ccse-cultura",
    guidanceNote: "Tema 2 del temario CCSE: cultura, historia y sociedad españolas.",
    payload: {
      passages: [{ id: "p1", body: "Preguntas sobre geografía, cultura y vida cotidiana en España." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuál es la capital de España?", options: [{ id: "a", text: "Barcelona" }, { id: "b", text: "Madrid" }, { id: "c", text: "Sevilla" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Cuál es la moneda oficial de España?", options: [{ id: "a", text: "El euro" }, { id: "b", text: "La peseta" }, { id: "c", text: "El dólar" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "¿Qué número se marca en España para una emergencia?", options: [{ id: "a", text: "El 112" }, { id: "b", text: "El 911" }, { id: "c", text: "El 100" }], answer: "a" },
        { id: "q4", kind: "mcq", stem: "¿Desde qué año es España miembro de la Unión Europea?", options: [{ id: "a", text: "1986" }, { id: "b", text: "1978" }, { id: "c", text: "2002" }], answer: "a" },
        { id: "q5", kind: "mcq", stem: "¿Cómo se llama el himno nacional de España?", options: [{ id: "a", text: "La Marcha Real" }, { id: "b", text: "El Himno de Riego" }, { id: "c", text: "La Canción del Pueblo" }], answer: "a" },
      ],
    },
  },
];

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
  console.log(`seed:ccse — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
