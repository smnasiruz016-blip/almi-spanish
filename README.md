# AlmiSpanish

AI-powered **Spanish exam practice** — DELE · SIELE · CCSE — a **separate** product
in the AlmiWorld family, on its own subdomain **almispanish.almiworld.com**.

Forked from AlmiFrench's app chassis (auth, billing, AI cost ledger). The practice
layer is an item-bank: a single `SpanishItem ↔ SpanishAttempt` pair carries every
task type via a typed `payload` Json (`src/lib/spanish`). Four skills at six CEFR
levels (A1–C2): **Comprensión auditiva** (Listening) + **Comprensión de lectura**
(Reading) are auto-marked and free; **Expresión escrita** (Writing) + **Expresión
oral** (Speaking) are AI-graded (Claude Sonnet, plus Whisper for speaking) and Pro.

## Three honest scoring engines — never one exam's scale reused on another

- **DELE** (`engines/dele.ts`) — APTO / NO APTO. Each skill /25 → /100 in two groups
  whose **pairing is level-dependent** (A1/A2 = written R+W / oral L+S; B1–C1 =
  comprehension R+L / expression W+S; C2 has its own integrated structure, flagged).
  Pass needs **≥60% total (60/100), ≥60% per group (30/50), AND ≥25% in every skill
  (6.25/25)** — group and skill floors are the eliminators. Lifetime diploma.
- **SIELE** (`engines/siele.ts`) — a **placement, no pass/fail**. 0–1000 (0–250 per
  skill), maps to CEFR **A1–C1**. Certificate valid **5 years**.
- **CCSE** (`engines/ccse.ts`) — a **civic-knowledge** test, not CEFR. 25 questions
  from the official 300-pool, **pass 15/25**. Paired with DELE A2 for nationality.

## Doctrine

Scores are practice **estimates** on each exam's real scale, shown honestly (DELE's
APTO/NO APTO + group breakdown, SIELE's per-skill /250 + CEFR band, CCSE's
correct/25) — **never a fabricated overall**. All content is original and
**pan-Hispanic** — never copied from Instituto Cervantes / Universidad de Salamanca
/ the Ministry of Justice. CCSE civic facts match the official curriculum exactly.
Admission, registration or naturalisation is not a visa — confirm with the Spanish
consulate, registro civil, or your university. 25% of AlmiWorld income supports the
Shamool Foundation. $12/month + 7-day trial; objective tasks free, AI feedback paid.

## Scripts

`npm run validate:seed` — validate every seed payload. `npm run seed:a1 … seed:c2`,
`npm run seed:ccse`, `npm run seed:append` (idempotent aggregate) — need `DATABASE_URL`.
