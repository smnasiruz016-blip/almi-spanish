// A1 wave — original Spanish items at the beginner register (very short texts:
// signs, forms, simple messages; present tense, basic vocabulary — numbers, days,
// family, food, prices). Pan-Hispanic: audio uses varied Spanish-speaking voices.
// Never translated, never copied from Instituto Cervantes / Universidad de
// Salamanca. Reading/Listening are SHARED (examFamily null); Writing/Speaking carry
// an examFamily (DELE or SIELE).
//
// Run: npm run seed:a1   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "A1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Mensaje de una amiga",
    prompt: "Lee el mensaje y responde a las preguntas.",
    difficulty: "FOUNDATION", topicTag: "vida-cotidiana",
    payload: {
      passages: [{ id: "p1", body: "¡Hola! Quedamos a las cuatro en la cafetería de la plaza. ¡Hasta luego! Marta" }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿A qué hora quedan?", options: [{ id: "a", text: "A las dos" }, { id: "b", text: "A las cuatro" }, { id: "c", text: "A las catorce" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Dónde quedan?", options: [{ id: "a", text: "En la cafetería" }, { id: "b", text: "En la estación" }, { id: "c", text: "En casa" }], answer: "a" },
      ],
    },
  },
  {
    level: "A1", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "Cartel de la tienda",
    prompt: "Lee el cartel e indica si es verdadero o falso.",
    difficulty: "FOUNDATION", topicTag: "compras",
    payload: {
      passages: [{ id: "p1", body: "Abierto de lunes a sábado, de 9:00 a 20:00. Domingo cerrado." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "La tienda abre los domingos.", answer: "false" },
        { id: "q2", kind: "truefalse", stem: "La tienda abre a las nueve de la mañana.", answer: "true" },
      ],
    },
  },
  {
    level: "A1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "La lista de la compra",
    prompt: "Lee la lista y responde.",
    difficulty: "CORE", topicTag: "vida-cotidiana",
    payload: {
      passages: [{ id: "p1", body: "Compra: pan, leche, seis huevos, manzanas y café." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuántos huevos hay que comprar?", options: [{ id: "a", text: "Tres" }, { id: "b", text: "Seis" }, { id: "c", text: "Diez" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Qué fruta está en la lista?", options: [{ id: "a", text: "Manzanas" }, { id: "b", text: "Plátanos" }, { id: "c", text: "Naranjas" }], answer: "a" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "A1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "En la cafetería",
    prompt: "Escucha el diálogo y responde.",
    difficulty: "FOUNDATION", topicTag: "restaurantes",
    payload: {
      audioScript: "—Buenos días, ¿qué va a tomar? —Un café con leche, por favor. —¿Algo más? —No, gracias. ¿Cuánto es? —Un euro con cincuenta.",
      speakers: [{ role: "Camarero", voice: "es-ES-male" }, { role: "Cliente", voice: "es-MX-female" }],
      questions: [
        { id: "q1", stem: "¿Qué pide la clienta?", options: [{ id: "a", text: "Un café con leche" }, { id: "b", text: "Un té" }, { id: "c", text: "Un zumo" }], answer: "a" },
        { id: "q2", stem: "¿Cuánto cuesta?", options: [{ id: "a", text: "Un euro" }, { id: "b", text: "Un euro con cincuenta" }, { id: "c", text: "Cinco euros" }], answer: "b" },
      ],
    },
  },
  {
    level: "A1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Anuncio en la estación",
    prompt: "Escucha el anuncio y responde.",
    difficulty: "CORE", topicTag: "viajes",
    payload: {
      audioScript: "Atención, por favor. El tren con destino a Madrid sale a las diez y media de la mañana desde el andén número tres. Gracias.",
      speakers: [{ role: "Megafonía", voice: "es-AR-female" }],
      questions: [
        { id: "q1", stem: "¿A qué hora sale el tren a Madrid?", options: [{ id: "a", text: "A las diez" }, { id: "b", text: "A las diez y media" }, { id: "c", text: "A las once y media" }], answer: "b" },
        { id: "q2", stem: "¿De qué andén sale?", options: [{ id: "a", text: "Del andén tres" }, { id: "b", text: "Del andén dos" }, { id: "c", text: "Del andén trece" }], answer: "a" },
      ],
    },
  },
  {
    level: "A1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Ana se presenta",
    prompt: "Escucha la presentación y responde.",
    difficulty: "FOUNDATION", topicTag: "presentaciones",
    payload: {
      audioScript: "Hola, me llamo Ana. Soy de Colombia, de Bogotá. Tengo veinticinco años y soy profesora de inglés. Vivo en Madrid con mi hermana.",
      speakers: [{ role: "Ana", voice: "es-CO-female" }],
      questions: [
        { id: "q1", stem: "¿De dónde es Ana?", options: [{ id: "a", text: "De Colombia" }, { id: "b", text: "De España" }, { id: "c", text: "De México" }], answer: "a" },
        { id: "q2", stem: "¿Cuál es su profesión?", options: [{ id: "a", text: "Profesora" }, { id: "b", text: "Médica" }, { id: "c", text: "Estudiante" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "A1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Responder a una invitación",
    prompt: "Tarea de expresión escrita (DELE A1).",
    difficulty: "CORE", topicTag: "vida-social",
    guidanceNote: "Saludo, aceptar la invitación, preguntar la hora y despedirse.",
    payload: {
      situation: "Un amigo te invita a su cumpleaños el sábado.",
      instruction: "Escribe un mensaje corto a tu amigo. Acepta la invitación, pregunta a qué hora es la fiesta y di qué vas a llevar. Escribe entre 25 y 40 palabras.",
      wordMin: 25, wordMax: 40,
    },
  },
  {
    level: "A1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Correo a una academia",
    prompt: "Tarea de expresión escrita (SIELE, nivel A1).",
    difficulty: "FOUNDATION", topicTag: "vida-practica",
    guidanceNote: "Datos personales sencillos y una frase de presentación.",
    payload: {
      situation: "Te apuntas a una clase de español en una academia.",
      instruction: "Escribe un correo a la academia. Di tu nombre, de dónde eres, qué idiomas hablas y por qué quieres estudiar español. Escribe entre 25 y 40 palabras.",
      wordMin: 25, wordMax: 40,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "A1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Presentación personal",
    prompt: "Tarea de expresión oral (DELE A1).",
    difficulty: "FOUNDATION", topicTag: "presentaciones",
    payload: {
      taskPrompt: "Preséntate. Di tu nombre, tu edad, de dónde eres, dónde vives y habla un poco de tu familia.",
      prepSeconds: 60, speakSeconds: 60,
    },
  },
  {
    level: "A1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Mi rutina diaria",
    prompt: "Tarea de expresión oral (SIELE, nivel A1).",
    difficulty: "CORE", topicTag: "vida-cotidiana",
    payload: {
      taskPrompt: "Habla de un día normal en tu vida: a qué hora te levantas, qué haces por la mañana, qué comes y qué haces por la tarde.",
      prepSeconds: 60, speakSeconds: 60,
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
  console.log(`seed:a1 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
