// C2 wave — original Spanish items at the mastery register (dense argumentative,
// academic and literary prose; implicit meaning, authorial stance, irony, nuanced
// lexis and connectors; long-form productive tasks). Pan-Hispanic audio. Never
// translated, never copied from Instituto Cervantes / Universidad de Salamanca.
// Reading/Listening SHARED (examFamily null); Writing/Speaking carry an examFamily
// (DELE or SIELE).
//
// Run: npm run seed:c2   (needs DATABASE_URL set)

import { PrismaClient, Prisma } from "@prisma/client";
import { isDirectRun } from "./_entry";

const prisma = new PrismaClient();

export const ITEMS: Prisma.SpanishItemCreateManyInput[] = [
  // ---------- Comprensión de lectura (Reading) — shared ----------
  {
    level: "C2", skill: "COMPRENSION_LECTORA", taskType: "MCQ", examFamily: null,
    title: "La nostalgia y sus trampas",
    prompt: "Lee el texto y responde a las preguntas.",
    difficulty: "STRETCH", topicTag: "ensayo",
    payload: {
      passages: [{ id: "p1", body: "La nostalgia goza hoy de una reputación inmerecida. La invocamos como si fuera una forma noble de la memoria, cuando con frecuencia es su falsificación más eficaz: no recuerda el pasado, lo edita; lima sus asperezas, ilumina lo que conviene y sume en la penumbra lo que estorba. De ahí su peligro político. Quien promete devolvernos un ayer esplendoroso rara vez nos describe el ayer que existió; nos vende, más bien, el decorado de un anhelo presente, proyectado hacia atrás. La nostalgia, en suma, no mira al pasado: lo usa como espejo en el que contemplar, embellecidos, nuestros descontentos de hoy." }],
      questions: [
        { id: "q1", kind: "mcq", stem: "¿Cuál es la tesis del autor sobre la nostalgia?", options: [{ id: "a", text: "Que tiende a falsificar el pasado al servicio del presente" }, { id: "b", text: "Que es la forma más fiel de la memoria" }, { id: "c", text: "Que describe el pasado con exactitud" }], answer: "a" },
        { id: "q2", kind: "mcq", stem: "¿Por qué advierte de su 'peligro político'?", options: [{ id: "a", text: "Porque vende un pasado idealizado que nunca existió" }, { id: "b", text: "Porque impide votar" }, { id: "c", text: "Porque es ilegal" }], answer: "a" },
        { id: "q3", kind: "mcq", stem: "El tono del autor frente a la nostalgia es...", options: [{ id: "a", text: "Crítico y desmitificador" }, { id: "b", text: "Admirativo" }, { id: "c", text: "Indiferente" }], answer: "a" },
      ],
    },
  },
  {
    level: "C2", skill: "COMPRENSION_LECTORA", taskType: "VERDADERO_FALSO", examFamily: null,
    title: "Sobre la objetividad periodística",
    prompt: "Lee el texto e indica si es verdadero o falso.",
    difficulty: "STRETCH", topicTag: "medios",
    payload: {
      passages: [{ id: "p1", body: "Se reprocha al periodismo no ser objetivo, como si la objetividad absoluta fuera un estado alcanzable que la mala fe se empeña en traicionar. Conviene, sin embargo, deshacer el equívoco. Toda mirada selecciona, y seleccionar es ya interpretar: decidir qué se cuenta y qué se calla, en qué orden y con qué palabras, comporta inevitablemente una toma de posición. Lo honesto no es, pues, fingir una neutralidad imposible, sino explicitar el punto de vista y someterlo al contraste de los hechos. La objetividad, más que un punto de partida, es una disciplina; menos un don que un método." }],
      questions: [
        { id: "q1", kind: "truefalse", stem: "El autor sostiene que la objetividad absoluta es plenamente alcanzable.", answer: "false" },
        { id: "q2", kind: "truefalse", stem: "Según el texto, seleccionar la información ya implica interpretar.", answer: "true" },
        { id: "q3", kind: "truefalse", stem: "El autor propone explicitar el punto de vista y contrastarlo con los hechos.", answer: "true" },
      ],
    },
  },

  // ---------- Comprensión auditiva (Listening) — shared ----------
  {
    level: "C2", skill: "COMPRENSION_AUDITIVA", taskType: "MCQ", examFamily: null,
    title: "Conferencia sobre la traducción",
    prompt: "Escucha el fragmento y responde.",
    difficulty: "STRETCH", topicTag: "lengua",
    payload: {
      audioScript: "Se repite, con resignación, que traducir es traicionar, como si toda traducción fuera una pérdida y el original un absoluto inalcanzable. Permítanme invertir el lugar común. La traducción no es la sombra del texto, sino su prolongación: lo obliga a decirse de nuevo, a probarse en otra lengua y, con frecuencia, a descubrir en ese tránsito significados que en el original permanecían latentes. Que algo se pierda no debería escandalizarnos; también en la lectura, incluso en la propia lengua, perdemos y añadimos sin cesar. El verdadero traidor no es quien traduce, sino quien lee sin escuchar.",
      speakers: [{ role: "Traductora", voice: "es-AR-female" }],
      questions: [
        { id: "q1", stem: "¿Qué postura defiende la ponente sobre la traducción?", options: [{ id: "a", text: "Que es una prolongación creativa, no solo una pérdida" }, { id: "b", text: "Que siempre es una traición imperdonable" }, { id: "c", text: "Que es imposible y debería evitarse" }], answer: "a" },
        { id: "q2", stem: "¿A quién señala como 'el verdadero traidor'?", options: [{ id: "a", text: "A quien lee sin escuchar" }, { id: "b", text: "A quien traduce" }, { id: "c", text: "Al autor del original" }], answer: "a" },
        { id: "q3", stem: "El recurso de 'invertir el lugar común' indica que la ponente...", options: [{ id: "a", text: "Cuestiona una idea aceptada para proponer otra" }, { id: "b", text: "Repite lo que todos piensan" }, { id: "c", text: "Evita dar su opinión" }], answer: "a" },
      ],
    },
  },

  // ---------- Expresión escrita (Writing) — AI, exam-specific ----------
  {
    level: "C2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "DELE",
    title: "Ensayo de opinión a partir de varias fuentes",
    prompt: "Tarea de expresión escrita (DELE C2).",
    difficulty: "STRETCH", topicTag: "cultura",
    guidanceNote: "Integra y contrasta posturas; voz propia, precisión léxica y cohesión sofisticada.",
    payload: {
      situation: "Un debate público enfrenta a quienes ven en la inteligencia artificial una amenaza para la creatividad humana y a quienes la consideran una herramienta que la amplía.",
      instruction: "Escribe un ensayo en el que contrastes ambas posturas, las matices con argumentos y ejemplos, y desarrolles una posición propia bien fundamentada. Cuida la cohesión y el registro culto. Escribe entre 300 y 350 palabras.",
      wordMin: 300, wordMax: 350,
    },
  },
  {
    level: "C2", skill: "EXPRESION_ESCRITA", taskType: "WRITING_TASK", examFamily: "SIELE",
    title: "Texto de divulgación con postura",
    prompt: "Tarea de expresión escrita (SIELE, nivel C1+).",
    difficulty: "STRETCH", topicTag: "ciencia",
    guidanceNote: "Claridad expositiva de alto nivel; equilibrio entre rigor y accesibilidad.",
    payload: {
      situation: "Una revista de divulgación te encarga un texto sobre los límites éticos de la edición genética.",
      instruction: "Escribe un artículo de divulgación. Explica el tema con rigor pero de forma accesible, expón los dilemas éticos, contrasta posiciones y cierra con una reflexión propia. Escribe entre 300 y 350 palabras.",
      wordMin: 300, wordMax: 350,
    },
  },

  // ---------- Expresión oral (Speaking) — AI, exam-specific ----------
  {
    level: "C2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "DELE",
    title: "Disertación y debate",
    prompt: "Tarea de expresión oral (DELE C2).",
    difficulty: "STRETCH", topicTag: "filosofia",
    payload: {
      taskPrompt: "Disertación: «La libertad de expresión no consiste en el derecho a decir lo que se piensa, sino en la obligación de escuchar lo que no se quiere oír». Analiza la afirmación, discútela con argumentos sólidos, considera sus límites y defiende una posición personal articulada.",
      prepSeconds: 300, speakSeconds: 240,
    },
  },
  {
    level: "C2", skill: "EXPRESION_ORAL", taskType: "SPEAKING_TASK", examFamily: "SIELE",
    title: "Síntesis y valoración crítica",
    prompt: "Tarea de expresión oral (SIELE, nivel C1+).",
    difficulty: "STRETCH", topicTag: "sociedad",
    payload: {
      taskPrompt: "Se debate si las grandes ciudades deberían priorizar al peatón frente al automóvil de forma radical. Sintetiza los argumentos de cada bando, evalúa sus implicaciones económicas, sociales y ambientales, y formula una recomendación matizada.",
      prepSeconds: 300, speakSeconds: 240,
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
  console.log(`seed:c2 — ${created} created, ${ITEMS.length - created} already present`);
}

if (isDirectRun(import.meta.url)) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
