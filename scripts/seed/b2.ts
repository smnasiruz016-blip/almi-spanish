// B2 wave — original Spanish items at the upper-intermediate register (developed
// argumentation, abstract and specialised topics, nuanced opinion, wider range of
// subjunctive and connectors). Pan-Hispanic audio. Never translated, never copied
// from Instituto Cervantes / Universidad de Salamanca. Reading/Listening SHARED
// (examFamily null); Writing/Speaking carry an examFamily (DELE or SIELE).
//
// Run: npm run seed:b2   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "B2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "El teletrabajo, ¿una solución o un problema?",
    prompt: "Lee el artículo y responde a las preguntas.",
    difficulty: "CORE", topicTag: "trabajo",
    payload: {
      passages: [{ id: "p1", body: "El auge del teletrabajo ha transformado la vida laboral de millones de personas. Sus defensores destacan la flexibilidad y el ahorro de tiempo en desplazamientos. Sin embargo, varios estudios advierten de un lado menos visible: la dificultad para desconectar y la sensación de aislamiento. Los expertos coinciden en que el problema no es el modelo en sí, sino la ausencia de límites claros entre la vida personal y la profesional. Por ello, algunas empresas han empezado a regular el llamado 'derecho a la desconexión'." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "Según el texto, ¿cuál es el verdadero problema del teletrabajo?", options: [{ id: "a", text: "La falta de límites entre trabajo y vida personal" }, { id: "b", text: "El modelo en sí mismo" }, { id: "c", text: "El ahorro de tiempo" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Qué han empezado a hacer algunas empresas?", options: [{ id: "a", text: "Regular el derecho a la desconexión" }, { id: "b", text: "Prohibir el teletrabajo" }, { id: "c", text: "Reducir los sueldos" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "¿Qué actitud adopta el autor?", options: [{ id: "a", text: "Equilibrada: ve ventajas e inconvenientes" }, { id: "b", text: "Totalmente en contra" }, { id: "c", text: "Totalmente a favor" }], answer: "a" },
      ],
    },
  },
  {
    level: "B2", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "El consumo de productos locales",
    prompt: "Lee el texto e indica si es verdadero o falso.",
    difficulty: "STRETCH", topicTag: "medio-ambiente",
    payload: {
      passages: [{ id: "p1", body: "Comprar productos de temporada y de proximidad se ha presentado como una forma sencilla de reducir la huella ecológica. No obstante, los especialistas matizan que el impacto del transporte suele ser menor de lo que se cree y que pesa más cómo se cultiva un alimento que la distancia que recorre. En otras palabras, un tomate de invernadero local puede contaminar más que uno traído de lejos cultivado al aire libre." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "El texto afirma que la distancia es siempre el factor más importante.", answer: "false" },
        { id: "q2", kind: "truefalse", stem: "Según los especialistas, cómo se cultiva un alimento puede pesar más que la distancia.", answer: "true" },
        { id: "q3", kind: "truefalse", stem: "El autor presenta el consumo local como una solución sin matices.", answer: "false" },
      ],
    },
  },
  {
    level: "B2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Carta de un lector",
    prompt: "Lee la carta y responde.",
    difficulty: "CORE", topicTag: "sociedad",
    payload: {
      passages: [{ id: "p1", body: "Señor director: Escribo para expresar mi malestar por el cierre de la biblioteca de mi barrio. Se nos ha dicho que la decisión responde a un recorte presupuestario, pero me cuesta entender que se ahorre precisamente en cultura. La biblioteca no era solo un edificio con libros: era el único espacio donde muchos estudiantes sin recursos podían estudiar y donde los mayores se reunían. Espero que el ayuntamiento reconsidere una medida que, lejos de ahorrar, empobrece al barrio." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuál es el propósito de la carta?", options: [{ id: "a", text: "Protestar por el cierre de una biblioteca" }, { id: "b", text: "Agradecer una nueva biblioteca" }, { id: "c", text: "Pedir más libros" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Qué argumento principal usa el lector?", options: [{ id: "a", text: "La biblioteca cumplía una función social importante" }, { id: "b", text: "El edificio era muy bonito" }, { id: "c", text: "Había demasiados libros" }], answer: "a" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "B2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Debate sobre la tecnología en las aulas",
    prompt: "Escucha el fragmento y responde.",
    difficulty: "STRETCH", topicTag: "educacion",
    payload: {
      audioScript: "—Yo creo que las tabletas en clase distraen más de lo que ayudan. Los alumnos acaban mirando otras cosas. —Entiendo tu preocupación, pero el problema no es la herramienta, sino cómo se usa. Bien planteada, una tableta permite acceder a recursos que un libro no ofrece. —Puede ser, aunque me preocupa que dependamos demasiado de la pantalla y descuidemos la escritura a mano, que también desarrolla la memoria.",
      speakers: [{ role: "Profesor", voice: "es-ES-male" }, { role: "Pedagoga", voice: "es-MX-female" }],
      questions: [
        { id: "q1", stem: "¿Cuál es la postura de la pedagoga?", options: [{ id: "a", text: "El problema no es la herramienta, sino su uso" }, { id: "b", text: "Las tabletas siempre distraen" }, { id: "c", text: "Hay que prohibir la tecnología" }], answer: "a" },
        { id: "q2", stem: "¿Qué le preocupa al profesor al final?", options: [{ id: "a", text: "Depender demasiado de la pantalla" }, { id: "b", text: "El precio de las tabletas" }, { id: "c", text: "La falta de internet" }], answer: "a" },
      ],
    },
  },
  {
    level: "B2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Conferencia sobre el sueño",
    prompt: "Escucha el fragmento de la conferencia y responde.",
    difficulty: "STRETCH", topicTag: "salud",
    payload: {
      audioScript: "Durante años se pensó que dormir era simplemente descansar, un tiempo perdido. Hoy sabemos que es justo lo contrario: mientras dormimos, el cerebro consolida lo aprendido y elimina sustancias de desecho. Por eso, dormir poco no solo provoca cansancio, sino que afecta a la memoria y al estado de ánimo. La recomendación de siete u ocho horas no es un capricho, sino una necesidad biológica que demasiada gente ignora.",
      speakers: [{ role: "Investigadora", voice: "es-AR-female" }],
      questions: [
        { id: "q1", stem: "Según la conferencia, ¿qué hace el cerebro mientras dormimos?", options: [{ id: "a", text: "Consolida lo aprendido y elimina desechos" }, { id: "b", text: "No hace nada, solo descansa" }, { id: "c", text: "Pierde memoria" }], answer: "a" },
        { id: "q2", stem: "¿Cómo describe la ponente las siete u ocho horas de sueño?", options: [{ id: "a", text: "Como una necesidad biológica" }, { id: "b", text: "Como un capricho" }, { id: "c", text: "Como algo opcional" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "B2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Artículo de opinión",
    prompt: "Tarea de expresión escrita (DELE B2).",
    difficulty: "STRETCH", topicTag: "sociedad",
    guidanceNote: "Estructura clara (introducción, argumentos, conclusión); registro formal.",
    payload: {
      situation: "Una revista juvenil te pide un artículo sobre el papel de las redes sociales en la vida de los jóvenes.",
      instruction: "Escribe un artículo de opinión. Presenta el tema, expón ventajas e inconvenientes con ejemplos y termina con tu valoración personal. Escribe entre 150 y 180 palabras.",
      wordMin: 150, wordMax: 180,
    },
  },
  {
    level: "B2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Correo formal de propuesta",
    prompt: "Tarea de expresión escrita (SIELE, nivel B2).",
    difficulty: "CORE", topicTag: "trabajo",
    guidanceNote: "Registro formal; justifica la propuesta con argumentos.",
    payload: {
      situation: "Trabajas en una empresa que quiere mejorar la conciliación entre la vida laboral y personal.",
      instruction: "Escribe un correo a la dirección. Propón una medida concreta, explica sus beneficios para la empresa y los empleados, y anticipa una posible objeción. Escribe entre 150 y 180 palabras.",
      wordMin: 150, wordMax: 180,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "B2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Defender una postura",
    prompt: "Tarea de expresión oral (DELE B2).",
    difficulty: "STRETCH", topicTag: "sociedad",
    payload: {
      taskPrompt: "Algunos proponen que los estudios universitarios sean gratuitos para todos. Expón los argumentos a favor y en contra, defiende tu propia postura y responde a posibles objeciones.",
      prepSeconds: 180, speakSeconds: 150,
    },
  },
  {
    level: "B2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Comentar datos",
    prompt: "Tarea de expresión oral (SIELE, nivel B2).",
    difficulty: "STRETCH", topicTag: "actualidad",
    payload: {
      taskPrompt: "Una encuesta muestra que cada vez más jóvenes prefieren alquilar antes que comprar una vivienda. Describe el fenómeno, propón posibles causas y valora si te parece una tendencia positiva o negativa.",
      prepSeconds: 180, speakSeconds: 150,
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
  console.log(`seed:b2 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
