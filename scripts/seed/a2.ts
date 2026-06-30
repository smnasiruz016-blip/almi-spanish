// A2 wave — original Spanish items at the elementary register (short everyday
// texts; present, pretérito perfecto / indefinido, basic connectors). Pan-Hispanic
// audio. Never translated, never copied from Instituto Cervantes / Universidad de
// Salamanca. Reading/Listening SHARED (examFamily null); Writing/Speaking carry an
// examFamily (DELE or SIELE).
//
// Run: npm run seed:a2   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Correo de unas vacaciones",
    prompt: "Lee el correo y responde a las preguntas.",
    difficulty: "FOUNDATION", topicTag: "viajes",
    payload: {
      passages: [{ id: "p1", body: "Hola, Luis: La semana pasada estuve en Valencia con mi familia. Visitamos la playa y comimos paella. El hotel estaba cerca del centro y era muy cómodo. Volvemos el domingo. Un abrazo, Carmen." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Con quién viajó Carmen?", options: [{ id: "a", text: "Con su familia" }, { id: "b", text: "Con unos amigos" }, { id: "c", text: "Sola" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Dónde estaba el hotel?", options: [{ id: "a", text: "En la playa" }, { id: "b", text: "Cerca del centro" }, { id: "c", text: "En las afueras" }], answer: "b" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "Normas de la biblioteca",
    prompt: "Lee las normas e indica si es verdadero o falso.",
    difficulty: "CORE", topicTag: "vida-publica",
    payload: {
      passages: [{ id: "p1", body: "Biblioteca municipal. Horario: de lunes a viernes, de 9:00 a 21:00. No se puede comer ni hablar por teléfono. Se pueden llevar tres libros durante quince días." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "Se puede hablar por teléfono dentro de la biblioteca.", answer: "false" },
        { id: "q2", kind: "truefalse", stem: "Puedes llevarte tres libros a casa.", answer: "true" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Anuncio de trabajo",
    prompt: "Lee el anuncio y responde.",
    difficulty: "CORE", topicTag: "trabajo",
    payload: {
      passages: [{ id: "p1", body: "Se busca camarero/a para cafetería en el centro. Horario de tarde, de 16:00 a 22:00. Necesario hablar español e inglés. Enviar currículum a empleo@cafecentro.es." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Qué horario tiene el puesto?", options: [{ id: "a", text: "De mañana" }, { id: "b", text: "De tarde" }, { id: "c", text: "De noche" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Qué idiomas hay que hablar?", options: [{ id: "a", text: "Español e inglés" }, { id: "b", text: "Solo español" }, { id: "c", text: "Español y francés" }], answer: "a" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "A2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "En la consulta del médico",
    prompt: "Escucha el diálogo y responde.",
    difficulty: "CORE", topicTag: "salud",
    payload: {
      audioScript: "—Buenas tardes, ¿qué le pasa? —Me duele la cabeza desde ayer y tengo un poco de fiebre. —¿Ha tomado algo? —Sí, una pastilla esta mañana. —Bien, descanse y beba mucha agua. Si sigue igual, vuelva el viernes.",
      speakers: [{ role: "Médica", voice: "es-ES-female" }, { role: "Paciente", voice: "es-PE-male" }],
      questions: [
        { id: "q1", stem: "¿Qué le duele al paciente?", options: [{ id: "a", text: "La cabeza" }, { id: "b", text: "El estómago" }, { id: "c", text: "La espalda" }], answer: "a" },
        { id: "q2", stem: "¿Qué le recomienda la médica?", options: [{ id: "a", text: "Descansar y beber agua" }, { id: "b", text: "Hacer deporte" }, { id: "c", text: "Ir al hospital" }], answer: "a" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Mensaje de voz",
    prompt: "Escucha el mensaje y responde.",
    difficulty: "FOUNDATION", topicTag: "vida-cotidiana",
    payload: {
      audioScript: "Hola, soy Pedro. Te llamo para decirte que la cena del sábado se cambia al domingo a las nueve, en el mismo restaurante. Avísame si puedes ir. ¡Gracias!",
      speakers: [{ role: "Pedro", voice: "es-MX-male" }],
      questions: [
        { id: "q1", stem: "¿Qué día es ahora la cena?", options: [{ id: "a", text: "El sábado" }, { id: "b", text: "El domingo" }, { id: "c", text: "El viernes" }], answer: "b" },
        { id: "q2", stem: "¿A qué hora es la cena?", options: [{ id: "a", text: "A las siete" }, { id: "b", text: "A las nueve" }, { id: "c", text: "A las diez" }], answer: "b" },
      ],
    },
  },
  {
    level: "A2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Cómo llegar al museo",
    prompt: "Escucha las indicaciones y responde.",
    difficulty: "CORE", topicTag: "ciudad",
    payload: {
      audioScript: "Para llegar al museo, sigue todo recto por esta calle y, al llegar a la plaza, gira a la derecha. El museo está al lado de una farmacia. Está a unos diez minutos andando.",
      speakers: [{ role: "Vecina", voice: "es-CL-female" }],
      questions: [
        { id: "q1", stem: "¿Hacia dónde hay que girar en la plaza?", options: [{ id: "a", text: "A la derecha" }, { id: "b", text: "A la izquierda" }, { id: "c", text: "Seguir recto" }], answer: "a" },
        { id: "q2", stem: "¿Qué hay al lado del museo?", options: [{ id: "a", text: "Una farmacia" }, { id: "b", text: "Un banco" }, { id: "c", text: "Una escuela" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "A2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Contar un fin de semana",
    prompt: "Tarea de expresión escrita (DELE A2).",
    difficulty: "CORE", topicTag: "vida-cotidiana",
    guidanceNote: "Usa el pretérito para contar acciones pasadas; conecta las ideas.",
    payload: {
      situation: "Una amiga quiere saber qué hiciste el fin de semana pasado.",
      instruction: "Escríbele un correo. Cuéntale adónde fuiste, qué hiciste, con quién y si te gustó. Escribe entre 50 y 70 palabras.",
      wordMin: 50, wordMax: 70,
    },
  },
  {
    level: "A2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Reclamación sencilla",
    prompt: "Tarea de expresión escrita (SIELE, nivel A2).",
    difficulty: "STRETCH", topicTag: "vida-practica",
    guidanceNote: "Explica el problema con claridad y pide una solución de forma educada.",
    payload: {
      situation: "Compraste unos zapatos por internet y han llegado rotos.",
      instruction: "Escribe un correo a la tienda. Explica qué compraste, cuál es el problema y qué solución quieres. Escribe entre 50 y 70 palabras.",
      wordMin: 50, wordMax: 70,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "A2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Describir tu ciudad",
    prompt: "Tarea de expresión oral (DELE A2).",
    difficulty: "CORE", topicTag: "ciudad",
    payload: {
      taskPrompt: "Habla de la ciudad o el pueblo donde vives: cómo es, qué hay para hacer, qué te gusta y qué cambiarías.",
      prepSeconds: 90, speakSeconds: 90,
    },
  },
  {
    level: "A2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Planes para las vacaciones",
    prompt: "Tarea de expresión oral (SIELE, nivel A2).",
    difficulty: "CORE", topicTag: "viajes",
    payload: {
      taskPrompt: "Habla de tus próximas vacaciones: adónde quieres ir, con quién, qué vas a hacer y por qué has elegido ese lugar.",
      prepSeconds: 90, speakSeconds: 90,
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
  console.log(`seed:a2 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
