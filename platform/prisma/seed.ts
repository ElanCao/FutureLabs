/**
 * prisma/seed.ts
 *
 * Seeds the database with the full expanded skill taxonomy (500-800 leaf skills
 * across 20 domains). Run via: npx ts-node prisma/seed.ts
 *
 * Uses upsert so it is safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { BRANCHES, SKILLS } from "../lib/seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log(`🌱 Starting seed — ${BRANCHES.length} branches, ${SKILLS.length} skills`);

  // ── Upsert branches ─────────────────────────────────────────────────────────
  for (const branch of BRANCHES) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: { name: branch.name, icon: branch.icon, color: branch.color },
      create: { id: branch.id, name: branch.name, description: null, icon: branch.icon, color: branch.color },
    });
  }
  console.log(`  ✅ Upserted ${BRANCHES.length} branches`);

  // ── Upsert skills ───────────────────────────────────────────────────────────
  let seeded = 0;
  let skipped = 0;

  for (const skill of SKILLS) {
    // Map branch string id to the Branch record
    const branchExists = BRANCHES.find((b) => b.id === skill.branch);
    if (!branchExists) {
      console.warn(`  ⚠️  Skill "${skill.id}" references unknown branch "${skill.branch}" — skipping`);
      skipped++;
      continue;
    }

    const tags: string[] = [];
    if (skill.subDomain) tags.push(skill.subDomain);
    if (skill.tags) tags.push(...skill.tags.filter((t) => !tags.includes(t)));

    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {
        name: skill.name,
        icon: skill.icon,
        branchId: skill.branch,
        maxLevel: skill.maxLevel ?? 10,
        levelsJson: skill.levels as object[],
        tags,
        subDomain: skill.subDomain ?? null,
        workRelevant: skill.workRelevant ?? false,
        lifeSkill: skill.lifeSkill ?? false,
        verifiable: skill.verifiable ?? false,
        trending: skill.trending ?? false,
        localizationTags: skill.localizationTags ?? [],
      },
      create: {
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        branchId: skill.branch,
        maxLevel: skill.maxLevel ?? 10,
        levelsJson: skill.levels as object[],
        prerequisites: [],
        tags,
        agentCompat: true,
        community: false,
        subDomain: skill.subDomain ?? null,
        workRelevant: skill.workRelevant ?? false,
        lifeSkill: skill.lifeSkill ?? false,
        verifiable: skill.verifiable ?? false,
        trending: skill.trending ?? false,
        localizationTags: skill.localizationTags ?? [],
      },
    });
    seeded++;
  }

  console.log(`  ✅ Seeded ${seeded} skills (${skipped} skipped)`);
  console.log(`\n🎉 Seed complete — ${seeded} skills across ${BRANCHES.length} branches`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
