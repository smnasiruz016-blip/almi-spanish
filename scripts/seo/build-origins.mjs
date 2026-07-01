// Build AlmiSpanish origins.json from the family ISO base (French wave-2 base).
// Excludes Spain itself -> 196 origins for "study in Spain from [origin]".
// Enriches each with VERIFIABLE, honest fields only:
//   - isEU:  EU/EEA/Switzerland => free movement, no student visa; else visado de estudios
//   - natYears: 2 (Ibero-American + Portugal/Andorra/Philippines/Eq.Guinea, Código Civil art. 22.1) | 10 general
//   - lang/langLabel + native "study in Spain" & "Spanish exam" phrases (real search language, never a country-name swap)
import fs from "node:fs";

const base = JSON.parse(fs.readFileSync("C:/Projects/almi-french/src/data/origins.json", "utf8"));

// EU + EEA (IS,LI,NO) + Switzerland (CH). Spain excluded from the origin list entirely.
const EU_EEA_EFTA = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","SE", // EU (minus ES)
  "IS","LI","NO","CH", // EEA + Switzerland
]);

// 2-year naturalisation fast-track (Código Civil art. 22.1): nationals of Ibero-American
// countries, Andorra, Philippines, Equatorial Guinea, and Portugal (+ Sephardic origin,
// which is ancestry-based not nationality-based, so not country-mapped here).
const TWO_YEAR = new Set([
  // Spanish-speaking Ibero-America
  "AR","BO","CL","CO","CR","CU","DO","EC","SV","GT","HN","MX","NI","PA","PY","PE","UY","VE",
  "BR", // Brazil (Portuguese, Ibero-American)
  "PT","AD","PH","GQ",
]);

// Native search-language phrases. study = "study in Spain", exam = Spanish-exam intent.
// Only real working/search languages used. DELE kept as the anchor exam term worldwide.
const LANG = {
  en: { label: "English",    study: "study in Spain",              exam: "Spanish exam (DELE)" },
  es: { label: "Spanish",    study: "estudiar en España",          exam: "examen DELE de español" },
  pt: { label: "Portuguese", study: "estudar na Espanha",          exam: "exame de espanhol DELE" },
  fr: { label: "French",     study: "étudier en Espagne",          exam: "examen d'espagnol DELE" },
  ar: { label: "Arabic",     study: "الدراسة في إسبانيا",           exam: "امتحان ديلي في اللغة الإسبانية" },
  de: { label: "German",     study: "in Spanien studieren",        exam: "Spanischprüfung DELE" },
  it: { label: "Italian",    study: "studiare in Spagna",          exam: "esame di spagnolo DELE" },
  nl: { label: "Dutch",      study: "studeren in Spanje",          exam: "Spaans examen DELE" },
  ru: { label: "Russian",    study: "учёба в Испании",             exam: "экзамен по испанскому DELE" },
  zh: { label: "Chinese",    study: "在西班牙留学",                  exam: "西班牙语 DELE 考试" },
  ja: { label: "Japanese",   study: "スペイン留学",                  exam: "スペイン語試験 DELE" },
  ko: { label: "Korean",     study: "스페인 유학",                   exam: "스페인어 시험 DELE" },
  hi: { label: "Hindi",      study: "स्पेन में पढ़ाई",                exam: "स्पेनिश परीक्षा DELE" },
  ur: { label: "Urdu",       study: "اسپین میں تعلیم",              exam: "ہسپانوی امتحان DELE" },
  bn: { label: "Bengali",    study: "স্পেনে পড়াশোনা",              exam: "স্প্যানিশ পরীক্ষা DELE" },
  tr: { label: "Turkish",    study: "İspanya'da okumak",           exam: "İspanyolca sınavı DELE" },
  fa: { label: "Persian",    study: "تحصیل در اسپانیا",             exam: "آزمون اسپانیایی DELE" },
  id: { label: "Indonesian", study: "kuliah di Spanyol",           exam: "ujian bahasa Spanyol DELE" },
  ms: { label: "Malay",      study: "belajar di Sepanyol",         exam: "peperiksaan bahasa Sepanyol DELE" },
  th: { label: "Thai",       study: "เรียนต่อสเปน",                 exam: "สอบภาษาสเปน DELE" },
  vi: { label: "Vietnamese", study: "du học Tây Ban Nha",          exam: "kỳ thi tiếng Tây Ban Nha DELE" },
  pl: { label: "Polish",     study: "studia w Hiszpanii",          exam: "egzamin z hiszpańskiego DELE" },
  uk: { label: "Ukrainian",  study: "навчання в Іспанії",          exam: "іспит з іспанської DELE" },
  ro: { label: "Romanian",   study: "studii în Spania",            exam: "examen de spaniolă DELE" },
  el: { label: "Greek",      study: "σπουδές στην Ισπανία",        exam: "εξετάσεις ισπανικών DELE" },
  sw: { label: "Swahili",    study: "kusomea Uhispania",           exam: "mtihani wa Kihispania DELE" },
  am: { label: "Amharic",    study: "በስፔን መማር",                   exam: "የስፓኒሽ ፈተና DELE" },
  he: { label: "Hebrew",     study: "ללמוד בספרד",                 exam: "מבחן ספרדית DELE" },
  sv: { label: "Swedish",    study: "studera i Spanien",           exam: "spanskaprov DELE" },
  no: { label: "Norwegian",  study: "studere i Spania",            exam: "spanskeksamen DELE" },
  da: { label: "Danish",     study: "studere i Spanien",           exam: "spanskeksamen DELE" },
  fi: { label: "Finnish",    study: "opiskella Espanjassa",        exam: "espanjan kielikoe DELE" },
  cs: { label: "Czech",      study: "studium ve Španělsku",        exam: "zkouška ze španělštiny DELE" },
  sk: { label: "Slovak",     study: "štúdium v Španielsku",        exam: "skúška zo španielčiny DELE" },
  hu: { label: "Hungarian",  study: "tanulás Spanyolországban",    exam: "spanyol nyelvvizsga DELE" },
  bg: { label: "Bulgarian",  study: "обучение в Испания",          exam: "изпит по испански DELE" },
  sr: { label: "Serbian",    study: "студирање у Шпанији",         exam: "испит из шпанског DELE" },
  hr: { label: "Croatian",   study: "studiranje u Španjolskoj",    exam: "ispit iz španjolskog DELE" },
  sl: { label: "Slovenian",  study: "študij v Španiji",            exam: "izpit iz španščine DELE" },
  ne: { label: "Nepali",     study: "स्पेनमा अध्ययन",               exam: "स्पेनी भाषा परीक्षा DELE" },
  si: { label: "Sinhala",    study: "ස්පාඤ්ඤයේ අධ්‍යාපනය",          exam: "ස්පාඤ්ඤ භාෂා විභාගය DELE" },
  ta: { label: "Tamil",      study: "ஸ்பெயினில் படிப்பு",           exam: "ஸ்பானிஷ் தேர்வு DELE" },
  km: { label: "Khmer",      study: "សិក្សានៅអេស្ប៉ាញ",             exam: "ការប្រឡងភាសាអេស្ប៉ាញ DELE" },
  lo: { label: "Lao",        study: "ຮຽນຢູ່ສະເປນ",                 exam: "ສอบພาສາສະເປນ DELE" },
  my: { label: "Burmese",    study: "စပိန်တွင် ပညာသင်ကြားခြင်း",   exam: "စပိန်ဘာသာ စာမေးပွဲ DELE" },
  mn: { label: "Mongolian",  study: "Испанид суралцах",            exam: "Испани хэлний шалгалт DELE" },
  az: { label: "Azerbaijani",study: "İspaniyada təhsil",           exam: "İspan dili imtahanı DELE" },
  hy: { label: "Armenian",   study: "ուսումնառություն Իսպանիայում",exam: "իսպաներենի քննություն DELE" },
  ka: { label: "Georgian",   study: "სწავლა ესპანეთში",           exam: "ესპანური ენის გამოცდა DELE" },
  kk: { label: "Kazakh",     study: "Испанияда оқу",               exam: "Испан тілі емтиханы DELE" },
  uz: { label: "Uzbek",      study: "Ispaniyada o'qish",           exam: "Ispan tili imtihoni DELE" },
  ps: { label: "Pashto",     study: "په اسپانیا کې زده کړه",        exam: "د هسپانوي ژبې ازموینه DELE" },
  so: { label: "Somali",     study: "wax ka barashada Isbaanishka",exam: "imtixaanka Isbaanishka DELE" },
  sq: { label: "Albanian",   study: "studimi në Spanjë",           exam: "provimi i spanjishtes DELE" },
  mk: { label: "Macedonian", study: "студирање во Шпанија",         exam: "испит по шпански DELE" },
  bs: { label: "Bosnian",    study: "studiranje u Španiji",        exam: "ispit iz španskog DELE" },
  et: { label: "Estonian",   study: "õppimine Hispaanias",         exam: "hispaania keele eksam DELE" },
  lv: { label: "Latvian",    study: "studijas Spānijā",            exam: "spāņu valodas eksāmens DELE" },
  lt: { label: "Lithuanian", study: "studijos Ispanijoje",         exam: "ispanų kalbos egzaminas DELE" },
  is: { label: "Icelandic",  study: "nám á Spáni",                 exam: "spænskupróf DELE" },
  ky: { label: "Kyrgyz",     study: "Испанияда окуу",              exam: "Испан тили экзамени DELE" },
  tg: { label: "Tajik",      study: "таҳсил дар Испониё",           exam: "имтиҳони забони испанӣ DELE" },
  tk: { label: "Turkmen",    study: "Ispaniýada okamak",           exam: "Ispan dili synagy DELE" },
  tl: { label: "Filipino",   study: "mag-aral sa Espanya",         exam: "pagsusulit sa Espanyol DELE" },
};

// country ISO2 -> real search language
const CL = {
  AF:"fa", AL:"sq", DZ:"ar", AD:"es", AO:"pt", AG:"en", AR:"es", AM:"hy", AU:"en", AT:"de",
  AZ:"az", BS:"en", BH:"ar", BD:"bn", BB:"en", BY:"ru", BE:"nl", BZ:"en", BJ:"fr", BT:"en",
  BO:"es", BQ:"nl", BA:"bs", BW:"en", BR:"pt", BN:"ms", BG:"bg", BF:"fr", BI:"fr", KH:"km",
  CM:"fr", CA:"en", CV:"pt", CF:"fr", TD:"fr", CL:"es", CN:"zh", CO:"es", KM:"fr", CG:"fr",
  CR:"es", CI:"fr", HR:"hr", CU:"es", CY:"el", CZ:"cs", DK:"da", DJ:"fr", DM:"en", DO:"es",
  CD:"fr", EC:"es", EG:"ar", SV:"es", GQ:"es", ER:"en", EE:"et", SZ:"en", ET:"am", FJ:"en",
  FI:"fi", FR:"fr", GA:"fr", GM:"en", GE:"ka", DE:"de", GH:"en", GR:"el", GD:"en", GT:"es",
  GN:"fr", GW:"pt", GY:"en", HT:"fr", HN:"es", HK:"zh", HU:"hu", IS:"is", IN:"hi", ID:"id",
  IR:"fa", IQ:"ar", IE:"en", IL:"he", IT:"it", JM:"en", JP:"ja", JO:"ar", KZ:"kk", KE:"sw",
  KI:"en", KW:"ar", KG:"ky", LA:"lo", LV:"lv", LB:"ar", LS:"en", LR:"en", LY:"ar", LI:"de",
  LT:"lt", LU:"fr", MG:"fr", MW:"en", MY:"ms", MV:"en", ML:"fr", MT:"en", MH:"en", MR:"ar",
  MU:"en", MX:"es", FM:"en", MD:"ro", MC:"fr", MN:"mn", ME:"sr", MA:"ar", MZ:"pt", MM:"my",
  NA:"en", NR:"en", NP:"ne", NL:"nl", NZ:"en", NI:"es", NE:"fr", NG:"en", KP:"ko", MK:"mk",
  NO:"no", OM:"ar", PK:"ur", PW:"en", PS:"ar", PA:"es", PG:"en", PY:"es", PE:"es", PH:"tl",
  PL:"pl", PT:"pt", QA:"ar", RO:"ro", RU:"ru", RW:"en", KN:"en", LC:"en", VC:"en", WS:"en",
  SM:"it", ST:"pt", SA:"ar", SN:"fr", RS:"sr", SC:"en", SL:"en", SG:"en", SK:"sk", SI:"sl",
  SB:"en", SO:"so", ZA:"en", KR:"ko", SS:"en", LK:"si", SD:"ar", SR:"nl", SE:"sv", CH:"de",
  SY:"ar", TW:"zh", TJ:"tg", TZ:"sw", TH:"th", TL:"pt", TG:"fr", TO:"en", TT:"en", TN:"ar",
  TR:"tr", TM:"tk", TV:"en", UG:"en", UA:"uk", AE:"ar", GB:"en", US:"en", UY:"es", UZ:"uz",
  VU:"en", VE:"es", VN:"vi", YE:"ar", ZM:"en", ZW:"en",
};

const out = [];
const missing = [];
for (const o of base) {
  if (o.iso2 === "ES") continue; // Spain is the destination, not an origin
  const lc = CL[o.iso2];
  if (!lc || !LANG[lc]) { missing.push(o.iso2); continue; }
  const L = LANG[lc];
  out.push({
    slug: o.slug,
    name: o.name,
    iso2: o.iso2,
    region: o.region,
    isEU: EU_EEA_EFTA.has(o.iso2),          // free movement -> no student visa
    natYears: TWO_YEAR.has(o.iso2) ? 2 : 10, // Código Civil art. 22.1 fast-track vs general
    lang: lc,
    langLabel: L.label,
    nativeStudy: L.study,
    nativeExam: L.exam,
  });
}

out.sort((a, b) => a.name.localeCompare(b.name));

if (missing.length) { console.error("MISSING LANG for:", missing.join(",")); process.exit(1); }

fs.writeFileSync("C:/Projects/almi-spanish/src/data/origins.json", JSON.stringify(out) + "\n");

// report
const eu = out.filter(o => o.isEU).length;
const two = out.filter(o => o.natYears === 2).length;
const langs = new Set(out.map(o => o.lang));
console.log("origins written:", out.length);
console.log("EU/EEA/CH (no student visa):", eu, " | non-EU (visado de estudios):", out.length - eu);
console.log("2-year nationality fast-track:", two, " | 10-year general:", out.length - two);
console.log("distinct native languages:", langs.size);
console.log("2yr list:", out.filter(o=>o.natYears===2).map(o=>o.iso2).join(","));
