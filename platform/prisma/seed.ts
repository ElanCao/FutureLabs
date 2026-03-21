/**
 * prisma db seed
 *
 * Inserts branches, skills, and the 5 seed profiles
 * (Alex, Maya, Jin, Sam, Aria) so the site looks populated on day 1.
 *
 * Run: npx prisma db seed
 * (configured in package.json "prisma.seed" field)
 */

import { PrismaClient } from "@prisma/client";
import { BRANCHES, SKILLS, SEED_PROFILES } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Branches ──────────────────────────────────────────────────────────────
  for (const b of BRANCHES) {
    await prisma.branch.upsert({
      where: { id: b.id },
      update: { name: b.name, icon: b.icon, color: b.color },
      create: { id: b.id, name: b.name, icon: b.icon, color: b.color },
    });
  }
  console.log(`  ✅ ${BRANCHES.length} branches`);

  // ── Skills ────────────────────────────────────────────────────────────────
  for (const s of SKILLS) {
    const levelsJson = s.levels.map((l) => ({
      level: l.level,
      title: l.title,
      behavioral_description: l.description,
      xp_threshold: l.xpRequired,
    }));

    await prisma.skill.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        branchId: s.branch,
        icon: s.icon,
        maxLevel: s.maxLevel,
        levelsJson,
      },
      create: {
        id: s.id,
        name: s.name,
        branchId: s.branch,
        icon: s.icon,
        maxLevel: s.maxLevel,
        levelsJson,
        prerequisites: [],
        tags: [],
      },
    });
  }
  console.log(`  ✅ ${SKILLS.length} skills`);

  // ── Profiles ──────────────────────────────────────────────────────────────
  for (const p of SEED_PROFILES) {
    const profile = await prisma.profile.upsert({
      where: { username: p.username },
      update: {
        displayName: p.displayName,
        bio: p.bio,
        avatarEmoji: p.avatarEmoji,
        entityType: p.entityType === "ai_agent" ? "ai_agent" : "human",
        privacy: "public",
        totalXp: p.totalXp,
      },
      create: {
        username: p.username,
        displayName: p.displayName,
        bio: p.bio,
        avatarEmoji: p.avatarEmoji,
        entityType: p.entityType === "ai_agent" ? "ai_agent" : "human",
        privacy: "public",
        totalXp: p.totalXp,
        userId: null,
      },
    });

    for (const sr of p.skills) {
      const record = await prisma.userSkillRecord.upsert({
        where: {
          profileId_skillId: { profileId: profile.id, skillId: sr.skillId },
        },
        update: { currentLevel: sr.currentLevel, xp: sr.xp },
        create: {
          profileId: profile.id,
          skillId: sr.skillId,
          currentLevel: sr.currentLevel,
          xp: sr.xp,
          unlockedAt: new Date(),
        },
      });

      if (sr.evidence) {
        // Remove old evidence and re-insert for idempotency
        await prisma.evidenceRecord.deleteMany({ where: { userSkillRecordId: record.id } });
        for (const ev of sr.evidence) {
          await prisma.evidenceRecord.create({
            data: {
              userSkillRecordId: record.id,
              type: ev.type,
              title: ev.title ?? null,
              url: ev.url ?? null,
              description: ev.description ?? null,
            },
          });
        }
      }
    }

    console.log(`  ✅ @${p.username}`);
  }

  console.log("🌳 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
