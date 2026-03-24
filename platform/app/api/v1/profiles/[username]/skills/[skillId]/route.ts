/**
 * PUT    /api/v1/profiles/:username/skills/:skillId — add/update skill record
 * DELETE /api/v1/profiles/:username/skills/:skillId — remove skill record
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

interface Params { params: { username: string; skillId: string } }

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return session?.user?.email;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const userEmail = await requireAuth();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, skillId } = params;
    const body = await req.json();
    const { currentLevel, xp, evidence } = body;

    // Find the user and verify they own this profile
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { Profile: true },
    });

    if (!user?.Profile || user.Profile.username !== username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Upsert the user skill record
    const userSkillRecord = await prisma.userSkillRecord.upsert({
      where: {
        profileId_skillId: {
          profileId: user.Profile.id,
          skillId: skillId,
        },
      },
      create: {
        id: crypto.randomUUID(),
        profileId: user.Profile.id,
        skillId: skillId,
        currentLevel: currentLevel ?? 1,
        xp: xp ?? 0,
        unlockedAt: new Date(),
        lastLeveledAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        currentLevel: currentLevel ?? 1,
        xp: xp ?? 0,
        lastLeveledAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        EvidenceRecord: true,
      },
    });

    // Handle evidence records if provided
    if (evidence && Array.isArray(evidence)) {
      // Delete existing evidence records
      await prisma.evidenceRecord.deleteMany({
        where: { userSkillRecordId: userSkillRecord.id },
      });

      // Create new evidence records
      if (evidence.length > 0) {
        await prisma.evidenceRecord.createMany({
          data: evidence.map((ev: { type: string; title?: string; url?: string; description?: string }) => ({
            id: crypto.randomUUID(),
            userSkillRecordId: userSkillRecord.id,
            type: ev.type as any,
            title: ev.title ?? null,
            url: ev.url ?? null,
            description: ev.description ?? null,
          })),
        });
      }
    }

    // Recalculate total XP
    const allSkills = await prisma.userSkillRecord.findMany({
      where: { profileId: user.Profile.id },
    });
    const totalXp = allSkills.reduce((sum, s) => sum + s.xp, 0);

    await prisma.profile.update({
      where: { id: user.Profile.id },
      data: { totalXp, updatedAt: new Date() },
    });

    return NextResponse.json({
      skillId,
      currentLevel: userSkillRecord.currentLevel,
      xp: userSkillRecord.xp,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userEmail = await requireAuth();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, skillId } = params;

    // Find the user and verify they own this profile
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { Profile: true },
    });

    if (!user?.Profile || user.Profile.username !== username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the skill record and its evidence
    await prisma.userSkillRecord.delete({
      where: {
        profileId_skillId: {
          profileId: user.Profile.id,
          skillId: skillId,
        },
      },
    });

    // Recalculate total XP
    const allSkills = await prisma.userSkillRecord.findMany({
      where: { profileId: user.Profile.id },
    });
    const totalXp = allSkills.reduce((sum, s) => sum + s.xp, 0);

    await prisma.profile.update({
      where: { id: user.Profile.id },
      data: { totalXp, updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
