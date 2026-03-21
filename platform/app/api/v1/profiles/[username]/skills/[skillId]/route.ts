/**
 * PUT    /api/v1/profiles/:username/skills/:skillId — add/update skill + XP calculation
 * DELETE /api/v1/profiles/:username/skills/:skillId — remove skill record
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { EvidenceType } from "@prisma/client";

interface Params { params: { username: string; skillId: string } }

interface LevelData { level: number; xpRequired: number; title: string; description: string }

// XP awards per evidence type
const EVIDENCE_XP: Record<string, number> = {
  certificate: 150,
  project: 100,
  contribution: 100,
  publication: 120,
  peer_review: 80,
  self_assessment: 40,
};

function computeLevelFromXp(xp: number, levels: LevelData[]): number {
  const sorted = [...levels].sort((a, b) => b.xpRequired - a.xpRequired);
  for (const l of sorted) {
    if (xp >= l.xpRequired) return l.level;
  }
  return 1;
}

async function requireOwner(username: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id?: string }).id;
  try {
    const profile = await prisma.profile.findUnique({ where: { username } });
    if (!profile || profile.userId !== userId) return null;
    return profile;
  } catch {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const profile = await requireOwner(params.username);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { currentLevel: clientLevel, evidence } = body;

  try {
    // Fetch skill for XP calculation
    const skill = await prisma.skill.findUnique({ where: { id: params.skillId } });
    if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

    const levels = skill.levelsJson as unknown as LevelData[];

    // Fetch existing record
    const existing = await prisma.userSkillRecord.findUnique({
      where: { profileId_skillId: { profileId: profile.id, skillId: params.skillId } },
      include: { evidence: true },
    });

    const isNew = !existing;
    let xp = existing?.xp ?? 0;

    // XP for adding the skill fresh
    if (isNew) {
      const baseLevel = levels.find((l) => l.level === (clientLevel ?? 1));
      xp = (baseLevel?.xpRequired ?? 0) + 50; // 50 base bonus for adding
    }

    // XP delta from evidence records
    if (Array.isArray(evidence) && evidence.length > 0) {
      const prevCount = existing?.evidence.length ?? 0;
      if (evidence.length > prevCount) {
        const newEvidenceItems = evidence.slice(prevCount);
        for (const ev of newEvidenceItems) {
          xp += EVIDENCE_XP[ev.type] ?? 50;
        }
      }
    }

    // Determine level from XP (server-authoritative), or use client level if manually adjusted
    const autoLevel = computeLevelFromXp(xp, levels);
    // Allow client to manually set a higher level (e.g. import from external source)
    const finalLevel = Math.max(autoLevel, clientLevel ?? 1);
    // But cap at skill's maxLevel
    const clampedLevel = Math.min(finalLevel, skill.maxLevel);

    // Upsert the skill record
    const record = await prisma.userSkillRecord.upsert({
      where: { profileId_skillId: { profileId: profile.id, skillId: params.skillId } },
      update: {
        currentLevel: clampedLevel,
        xp,
        lastLeveledAt: new Date(),
      },
      create: {
        profileId: profile.id,
        skillId: params.skillId,
        currentLevel: clampedLevel,
        xp,
        unlockedAt: new Date(),
        lastLeveledAt: new Date(),
      },
    });

    // Replace evidence records if provided
    if (Array.isArray(evidence)) {
      await prisma.evidenceRecord.deleteMany({ where: { userSkillRecordId: record.id } });
      if (evidence.length > 0) {
        await prisma.evidenceRecord.createMany({
          data: evidence.map((e: { type: string; title?: string; url?: string; description?: string }) => ({
            userSkillRecordId: record.id,
            type: e.type as EvidenceType,
            title: e.title ?? null,
            url: e.url ?? null,
            description: e.description ?? null,
          })),
        });
      }
    }

    // Recalculate profile totalXp
    const xpAgg = await prisma.userSkillRecord.aggregate({
      where: { profileId: profile.id },
      _sum: { xp: true },
    });
    await prisma.profile.update({
      where: { id: profile.id },
      data: { totalXp: xpAgg._sum.xp ?? 0 },
    });

    // Create level-up notification if level increased
    if (existing && clampedLevel > existing.currentLevel) {
      await prisma.notification.create({
        data: {
          profileId: profile.id,
          type: "level_up",
          referenceId: params.skillId,
          message: `You leveled up ${skill.name} to Level ${clampedLevel}!`,
        },
      });
    }

    return NextResponse.json({
      skillId: params.skillId,
      currentLevel: record.currentLevel,
      xp: record.xp,
      leveledUp: existing ? clampedLevel > existing.currentLevel : false,
    });
  } catch (err) {
    console.error("PUT skill error:", err);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const profile = await requireOwner(params.username);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.userSkillRecord.deleteMany({
      where: { profileId: profile.id, skillId: params.skillId },
    });

    const xpAgg = await prisma.userSkillRecord.aggregate({
      where: { profileId: profile.id },
      _sum: { xp: true },
    });
    await prisma.profile.update({
      where: { id: profile.id },
      data: { totalXp: xpAgg._sum.xp ?? 0 },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
