// C1 wave — original Spanish items at the advanced register (complex, specialised
// and abstract texts; implicit meaning, register shifts, idiomatic and precise
// lexis). Pan-Hispanic audio. Never translated, never copied from Instituto
// Cervantes / Universidad de Salamanca. Reading/Listening SHARED (examFamily null);
// Writing/Speaking carry an examFamily (DELE or SIELE).
//
// Run: npm run seed:c1   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "C1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "La paradoja de la elección",
    prompt: "Lee el texto y responde a las preguntas.",
    difficulty: "STRETCH", topicTag: "psicologia",
    payload: {
      passages: [{ id: "p1", body: "Solemos asociar la libertad con la abundancia de opciones, como si tener más donde elegir nos hiciera necesariamente más libres y más felices. Sin embargo, diversos estudios sugieren lo contrario: ante un exceso de alternativas, muchas personas se paralizan, posponen la decisión o, una vez tomada, quedan insatisfechas, persuadidas de que alguna de las opciones descartadas habría sido mejor. La saturación, lejos de emanciparnos, genera una ansiedad sorda que el consumismo contemporáneo no hace sino alimentar. Quizá la verdadera libertad no resida en multiplicar las opciones, sino en aprender a renunciar a ellas sin remordimiento." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuál es la idea central del texto?", options: [{ id: "a", text: "Un exceso de opciones puede reducir el bienestar" }, { id: "b", text: "Cuantas más opciones, más felicidad" }, { id: "c", text: "Las decisiones no generan ansiedad" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Qué propone el autor al final?", options: [{ id: "a", text: "Aprender a renunciar sin remordimiento" }, { id: "b", text: "Eliminar toda elección" }, { id: "c", text: "Consumir más para ser libre" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "La expresión 'ansiedad sorda' sugiere una inquietud...", options: [{ id: "a", text: "Persistente pero poco evidente" }, { id: "b", text: "Ruidosa y visible" }, { id: "c", text: "Pasajera y leve" }], answer: "a" },
      ],
    },
  },
  {
    level: "C1", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "El valor del aburrimiento",
    prompt: "Lee el texto e indica si es verdadero o falso.",
    difficulty: "STRETCH", topicTag: "cultura",
    payload: {
      passages: [{ id: "p1", body: "Vivimos empeñados en eliminar cualquier intersticio de tedio: la cola del supermercado, el trayecto en metro o la sala de espera se han convertido en oportunidades para consultar el móvil. No obstante, algunos investigadores reivindican el aburrimiento como un estado fértil, antesala de la creatividad y del pensamiento divergente. Cuando la mente no está ocupada en una tarea concreta, divaga, establece conexiones inesperadas y, a menudo, resuelve aquello que la atención dirigida no lograba desentrañar. Privarnos sistemáticamente de esos vacíos podría salir más caro de lo que imaginamos." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "El texto presenta el aburrimiento como algo siempre negativo.", answer: "false" },
        { id: "q2", kind: "truefalse", stem: "Según el texto, la mente desocupada puede favorecer la creatividad.", answer: "true" },
        { id: "q3", kind: "truefalse", stem: "El autor sugiere que llenar todos los vacíos no tiene consecuencias.", answer: "false" },
      ],
    },
  },
  {
    level: "C1", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "Reseña de un ensayo",
    prompt: "Lee la reseña y responde.",
    difficulty: "CORE", topicTag: "literatura",
    payload: {
      passages: [{ id: "p1", body: "La autora despliega una prosa de aparente sencillez que, sin embargo, esconde una arquitectura precisa. Allí donde otros recurrirían a la grandilocuencia, ella opta por la contención, confiando en que el lector sepa leer entre líneas. El resultado es un ensayo que incomoda más por lo que insinúa que por lo que afirma, y que se resiste a las conclusiones cómodas. No es una lectura para quien busque respuestas cerradas, sino para quien esté dispuesto a convivir con la duda." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Qué caracteriza el estilo de la autora según el crítico?", options: [{ id: "a", text: "La contención y la sugerencia" }, { id: "b", text: "La grandilocuencia" }, { id: "c", text: "La simpleza sin profundidad" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿A qué tipo de lector se dirige el libro?", options: [{ id: "a", text: "A quien acepta convivir con la duda" }, { id: "b", text: "A quien busca respuestas cerradas" }, { id: "c", text: "A quien evita la reflexión" }], answer: "a" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "C1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Tertulia sobre el lenguaje",
    prompt: "Escucha el fragmento y responde.",
    difficulty: "STRETCH", topicTag: "lengua",
    payload: {
      audioScript: "—A mí me inquieta que se diga que el idioma se 'empobrece' porque los jóvenes usan menos palabras. —Es un viejo temor, francamente. Cada generación ha lamentado la decadencia de la lengua, y aquí seguimos. Lo que ocurre no es empobrecimiento, sino desplazamiento: se pierden términos, sí, pero se incorporan otros, sobre todo del ámbito digital. —Cierto, aunque yo distinguiría entre la lengua coloquial, que siempre fue cambiante, y la capacidad de expresarse con matices, que sí me parece que conviene cultivar deliberadamente.",
      speakers: [{ role: "Periodista", voice: "es-ES-female" }, { role: "Lingüista", voice: "es-CO-male" }],
      questions: [
        { id: "q1", stem: "¿Qué opina el lingüista sobre el supuesto empobrecimiento del idioma?", options: [{ id: "a", text: "Que es más un desplazamiento que un empobrecimiento" }, { id: "b", text: "Que el idioma está en decadencia" }, { id: "c", text: "Que los jóvenes destruyen la lengua" }], answer: "a" },
        { id: "q2", stem: "¿Qué matiz introduce la periodista al final?", options: [{ id: "a", text: "Conviene cultivar deliberadamente la expresión con matices" }, { id: "b", text: "La lengua coloquial nunca cambia" }, { id: "c", text: "No hay que enseñar lengua" }], answer: "a" },
      ],
    },
  },
  {
    level: "C1", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Fragmento de un pódcast de economía",
    prompt: "Escucha el fragmento y responde.",
    difficulty: "STRETCH", topicTag: "economia",
    payload: {
      audioScript: "Conviene desconfiar de las cifras de crecimiento cuando se presentan sin contexto. Una economía puede crecer y, al mismo tiempo, repartir ese crecimiento de forma tan desigual que la mayoría no perciba mejora alguna en su vida cotidiana. Por eso insisto: el dato agregado es necesario, pero insuficiente. Si no lo acompañamos de indicadores sobre cómo se distribuye la riqueza, corremos el riesgo de confundir el termómetro con la salud del paciente.",
      speakers: [{ role: "Economista", voice: "es-MX-male" }],
      questions: [
        { id: "q1", stem: "¿Cuál es la advertencia principal del economista?", options: [{ id: "a", text: "El crecimiento sin datos de distribución puede engañar" }, { id: "b", text: "El crecimiento siempre mejora la vida de todos" }, { id: "c", text: "Las cifras no sirven para nada" }], answer: "a" },
        { id: "q2", stem: "¿Qué significa 'confundir el termómetro con la salud del paciente'?", options: [{ id: "a", text: "Tomar un indicador parcial por la realidad completa" }, { id: "b", text: "Ir siempre al médico" }, { id: "c", text: "Medir mal la temperatura" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "C1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Ensayo argumentativo",
    prompt: "Tarea de expresión escrita (DELE C1).",
    difficulty: "STRETCH", topicTag: "sociedad",
    guidanceNote: "Tesis clara, desarrollo matizado, contraargumentos y conclusión; registro culto.",
    payload: {
      situation: "Un suplemento cultural debate sobre si la digitalización está cambiando nuestra forma de leer y pensar.",
      instruction: "Escribe un texto argumentativo. Plantea una tesis, desarróllala con argumentos y ejemplos, integra al menos un contraargumento y cierra con una conclusión personal y matizada. Escribe entre 220 y 260 palabras.",
      wordMin: 220, wordMax: 260,
    },
  },
  {
    level: "C1", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Informe a partir de datos",
    prompt: "Tarea de expresión escrita (SIELE, nivel C1).",
    difficulty: "STRETCH", topicTag: "trabajo",
    guidanceNote: "Organiza la información, interpreta tendencias y formula recomendaciones.",
    payload: {
      situation: "Eres responsable de un área y debes informar sobre la evolución del teletrabajo en tu organización.",
      instruction: "Escribe un informe. Describe las tendencias observadas, analiza sus causas y consecuencias, y propón recomendaciones justificadas para la dirección. Escribe entre 220 y 260 palabras.",
      wordMin: 220, wordMax: 260,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "C1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Monólogo y valoración crítica",
    prompt: "Tarea de expresión oral (DELE C1).",
    difficulty: "STRETCH", topicTag: "cultura",
    payload: {
      taskPrompt: "Se afirma que el acceso ilimitado a la información nos ha hecho más informados pero no necesariamente más sabios. Desarrolla esta idea con un razonamiento articulado, matiza la afirmación y aporta ejemplos concretos.",
      prepSeconds: 240, speakSeconds: 180,
    },
  },
  {
    level: "C1", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Negociar una postura",
    prompt: "Tarea de expresión oral (SIELE, nivel C1).",
    difficulty: "STRETCH", topicTag: "actualidad",
    payload: {
      taskPrompt: "Tu ciudad estudia limitar el turismo en el centro histórico. Expón los intereses en juego (vecinos, comercios, visitantes), valora las distintas posturas y defiende una solución de compromiso razonada.",
      prepSeconds: 240, speakSeconds: 180,
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
  console.log(`seed:c1 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
