// B1 wave — original Spanish items at the intermediate register (opinions,
// narration, basic subjunctive, connectors of cause/consequence; everyday and
// some abstract topics). Pan-Hispanic audio. Never translated, never copied from
// Instituto Cervantes / Universidad de Salamanca. Reading/Listening SHARED
// (examFamily null); Writing/Speaking carry an examFamily (DELE or SIELE).
//
// Run: npm run seed:b1   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "B1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Un cambio de vida",
    prompt: "Lee el texto y responde a las preguntas.",
    difficulty: "CORE", topicTag: "sociedad",
    payload: {
      passages: [{ id: "p1", body: "Hace dos años, Marta dejó su trabajo en la ciudad y se mudó a un pueblo pequeño. Al principio echaba de menos el ruido y los cafés, pero pronto descubrió que vivía con menos estrés. Ahora trabaja desde casa y cultiva su propio huerto. Dice que no volvería a la ciudad, aunque reconoce que a veces se siente un poco aislada." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Por qué se mudó Marta al pueblo?", options: [{ id: "a", text: "Para vivir con menos estrés" }, { id: "b", text: "Para ganar más dinero" }, { id: "c", text: "Porque perdió su trabajo" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Qué aspecto negativo menciona?", options: [{ id: "a", text: "Que se siente aislada a veces" }, { id: "b", text: "Que el huerto es difícil" }, { id: "c", text: "Que echa de menos su sueldo" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "¿Volvería a la ciudad?", options: [{ id: "a", text: "No" }, { id: "b", text: "Sí, pronto" }, { id: "c", text: "Sí, el año que viene" }], answer: "a" },
      ],
    },
  },
  {
    level: "B1", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "El transporte público de la ciudad",
    prompt: "Lee el texto e indica si es verdadero o falso.",
    difficulty: "CORE", topicTag: "ciudad",
    payload: {
      passages: [{ id: "p1", body: "Desde enero, el ayuntamiento ha ampliado el horario del metro hasta las dos de la madrugada los fines de semana. Además, los menores de catorce años viajan gratis. La medida busca reducir el uso del coche y mejorar la calidad del aire, aunque algunos vecinos se quejan del ruido nocturno." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "El metro cierra más tarde los fines de semana.", answer: "true" },
        { id: "q2", kind: "truefalse", stem: "Todos los pasajeros viajan gratis.", answer: "false" },
        { id: "q3", kind: "truefalse", stem: "La medida quiere mejorar la calidad del aire.", answer: "true" },
      ],
    },
  },
  {
    level: "B1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Reseña de un restaurante",
    prompt: "Lee la reseña y responde.",
    difficulty: "STRETCH", topicTag: "ocio",
    payload: {
      passages: [{ id: "p1", body: "Fui a cenar a La Esquina el viernes. La comida estaba buenísima y los precios eran razonables. Lo único malo fue que tardaron casi una hora en servirnos, porque había mucha gente. El camarero fue muy amable y nos invitó a un postre por la espera. Volveré, pero reservaré mesa la próxima vez." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuál fue el principal problema?", options: [{ id: "a", text: "La comida estaba fría" }, { id: "b", text: "El servicio tardó mucho" }, { id: "c", text: "Los precios eran altos" }], answer: "b" },
        { id: "q2", kind: "mcq", stem: "¿Cómo reaccionó el camarero?", options: [{ id: "a", text: "Les invitó a un postre" }, { id: "b", text: "No hizo nada" }, { id: "c", text: "Les cobró menos" }], answer: "a" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "B1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Entrevista a una deportista",
    prompt: "Escucha la entrevista y responde.",
    difficulty: "CORE", topicTag: "deporte",
    payload: {
      audioScript: "—Lucía, ¿cómo empezaste a nadar? —Pues empecé con seis años porque mi médico se lo recomendó a mis padres. Nunca pensé que llegaría a competir. —¿Y qué es lo más difícil? —Sin duda, levantarme a las cinco para entrenar antes de ir a la universidad. —¿Cuál es tu meta? —Clasificarme para los Juegos del próximo año.",
      speakers: [{ role: "Periodista", voice: "es-AR-male" }, { role: "Lucía", voice: "es-ES-female" }],
      questions: [
        { id: "q1", stem: "¿Por qué empezó a nadar Lucía?", options: [{ id: "a", text: "Por recomendación médica" }, { id: "b", text: "Por sus amigos" }, { id: "c", text: "Por la televisión" }], answer: "a" },
        { id: "q2", stem: "¿Qué le resulta más difícil?", options: [{ id: "a", text: "Levantarse muy temprano" }, { id: "b", text: "Las competiciones" }, { id: "c", text: "Estudiar" }], answer: "a" },
        { id: "q3", stem: "¿Cuál es su meta?", options: [{ id: "a", text: "Clasificarse para los Juegos" }, { id: "b", text: "Dejar la natación" }, { id: "c", text: "Cambiar de deporte" }], answer: "a" },
      ],
    },
  },
  {
    level: "B1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Noticia en la radio",
    prompt: "Escucha la noticia y responde.",
    difficulty: "STRETCH", topicTag: "actualidad",
    payload: {
      audioScript: "Y ahora, el tiempo. Este fin de semana llegará una ola de calor a gran parte del país, con temperaturas que superarán los treinta y ocho grados. Las autoridades recomiendan beber mucha agua, evitar el sol del mediodía y vigilar a las personas mayores. Se espera que las temperaturas bajen el lunes.",
      speakers: [{ role: "Locutor", voice: "es-CO-male" }],
      questions: [
        { id: "q1", stem: "¿Qué tiempo se espera el fin de semana?", options: [{ id: "a", text: "Una ola de calor" }, { id: "b", text: "Lluvias fuertes" }, { id: "c", text: "Frío y nieve" }], answer: "a" },
        { id: "q2", stem: "¿Qué recomiendan las autoridades?", options: [{ id: "a", text: "Beber agua y evitar el sol del mediodía" }, { id: "b", text: "Quedarse sin salir nunca" }, { id: "c", text: "Hacer deporte al mediodía" }], answer: "a" },
        { id: "q3", stem: "¿Cuándo bajarán las temperaturas?", options: [{ id: "a", text: "El lunes" }, { id: "b", text: "El sábado" }, { id: "c", text: "No bajarán" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "B1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Carta a un periódico",
    prompt: "Tarea de expresión escrita (DELE B1).",
    difficulty: "CORE", topicTag: "sociedad",
    guidanceNote: "Expresa tu opinión con argumentos y usa conectores.",
    payload: {
      situation: "Has leído una noticia sobre la prohibición de los coches en el centro de tu ciudad.",
      instruction: "Escribe una carta al periódico. Da tu opinión sobre la medida, explica al menos dos razones y propón una alternativa. Escribe entre 100 y 130 palabras.",
      wordMin: 100, wordMax: 130,
    },
  },
  {
    level: "B1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Entrada de blog: una experiencia",
    prompt: "Tarea de expresión escrita (SIELE, nivel B1).",
    difficulty: "STRETCH", topicTag: "experiencias",
    guidanceNote: "Narra en pasado y describe sentimientos.",
    payload: {
      situation: "Escribes en tu blog sobre un viaje o una experiencia que cambió tu forma de ver algo.",
      instruction: "Escribe una entrada de blog. Cuenta qué pasó, cómo te sentiste y qué aprendiste de esa experiencia. Escribe entre 100 y 130 palabras.",
      wordMin: 100, wordMax: 130,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "B1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Valorar propuestas",
    prompt: "Tarea de expresión oral (DELE B1).",
    difficulty: "CORE", topicTag: "vida-social",
    payload: {
      taskPrompt: "Tu grupo de amigos quiere organizar una fiesta de despedida. Habla de las distintas opciones (lugar, comida, actividades), di cuál prefieres y por qué, y propón una decisión final.",
      prepSeconds: 120, speakSeconds: 120,
    },
  },
  {
    level: "B1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Tema de actualidad",
    prompt: "Tarea de expresión oral (SIELE, nivel B1).",
    difficulty: "STRETCH", topicTag: "actualidad",
    payload: {
      taskPrompt: "Habla sobre el uso del teléfono móvil entre los jóvenes: ventajas, desventajas y tu opinión personal. Da ejemplos concretos.",
      prepSeconds: 120, speakSeconds: 120,
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
  console.log(`seed:b1 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
