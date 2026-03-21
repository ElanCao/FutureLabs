/**
 * PUT    /api/v1/profiles/:username/skills/:skillId — add/update skill record
 * DELETE /api/v1/profiles/:username/skills/:skillId — remove skill record
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { EvidenceType } from "@prisma/client";

interface Params { params: { username: string; skillId: string } }

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
  const { currentLevel, xp, evidence } = body;

  try {
    // Upsert the skill record
    const record = await prisma.userSkillRecord.upsert({
      where: { profileId_skillId: { profileId: profile.id, skillId: params.skillId } },
      update: {
        currentLevel: currentLevel ?? 1,
        xp: xp ?? 0,
        lastLeveledAt: new Date(),
      },
      create: {
        profileId: profile.id,
        skillId: params.skillId,
        currentLevel: currentLevel ?? 1,
        xp: xp ?? 0,
        unlockedAt: new Date(),
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

    // Recalculate totalXp
    const xpAggregate = await prisma.userSkillRecord.aggregate({
      where: { profileId: profile.id },
      _sum: { xp: true },
    });
    await prisma.profile.update({
      where: { id: profile.id },
      data: { totalXp: xpAggregate._sum.xp ?? 0 },
    });

    return NextResponse.json({ skillId: params.skillId, currentLevel: record.currentLevel, xp: record.xp });
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

    // Recalculate totalXp
    const xpAggregate = await prisma.userSkillRecord.aggregate({
      where: { profileId: profile.id },
      _sum: { xp: true },
    });
    await prisma.profile.update({
      where: { id: profile.id },
      data: { totalXp: xpAggregate._sum.xp ?? 0 },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
