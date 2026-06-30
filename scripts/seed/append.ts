// Aggregate seed runner (idempotent): inserts any seed items not already present,
// matched by (level, skill, title). Safe to run on every deploy. Add new content
// waves by importing their ITEMS arrays here.

import { PrismaClient, Prisma } from "@prisma/client";
import { ITEMS as A1 } from "./a1";
import { ITEMS as A2 } from "./a2";
import { ITEMS as B1 } from "./b1";
import { ITEMS as B2 } from "./b2";
import { ITEMS as C1 } from "./c1";
import { ITEMS as C2 } from "./c2";
import { ITEMS as CCSE } from "./ccse";

const prisma = new PrismaClient();

const ALL: Prisma.SpanishItemCreateManyInput[] = [...A1, ...A2, ...B1, ...B2, ...C1, ...C2, ...CCSE];

async function main() {
  let created = 0;
  for (const item of ALL) {
    const exists = await prisma.spanishItem.findFirst({
      where: { level: item.level, skill: item.skill, title: item.title },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.spanishItem.create({ data: item });
    created += 1;
  }
  console.log(`seed:append — ${created} created, ${ALL.length - created} already present (total ${ALL.length})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
