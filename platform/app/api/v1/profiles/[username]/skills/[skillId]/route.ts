/**
 * PUT    /api/v1/profiles/:username/skills/:skillId — add/update a user skill record
 * DELETE /api/v1/profiles/:username/skills/:skillId — remove a skill record
 * Both require authentication and ownership.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: { username: string; skillId: string } };

async function resolveOwnership(username: string, userId: string) {
  const profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile) return { error: "Profile not found", status: 404, profile: null };
  if (profile.userId !== userId)
    return { error: "Forbidden", status: 403, profile: null };
  return { error: null, status: 200, profile };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error, status, profile } = await resolveOwnership(params.username, session.user.id);
  if (error) return NextResponse.json({ error }, { status });

  // Verify skill exists
  const skill = await prisma.skill.findUnique({ where: { id: params.skillId } });
  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const currentLevel = Math.max(0, Math.min(skill.maxLevel, Number(body.current_level ?? 0)));
  const xp = Math.max(0, Number(body.xp ?? 0));

  const record = await prisma.userSkillRecord.upsert({
    where: { profileId_skillId: { profileId: profile!.id, skillId: params.skillId } },
    create: {
      profileId: profile!.id,
      skillId: params.skillId,
      currentLevel,
      xp,
      unlockedAt: new Date(),
    },
    update: {
      currentLevel,
      xp,
      lastLeveledAt: new Date(),
    },
    include: { evidenceRecords: true, skill: true },
  });

  // Recompute total_xp
  const agg = await prisma.userSkillRecord.aggregate({
    where: { profileId: profile!.id },
    _sum: { xp: true },
  });
  await prisma.profile.update({
    where: { id: profile!.id },
    data: { totalXp: agg._sum.xp ?? 0 },
  });

  return NextResponse.json({
    skill_id: record.skillId,
    current_level: record.currentLevel,
    xp: record.xp,
    unlocked_at: record.unlockedAt?.toISOString(),
    last_leveled_at: record.lastLeveledAt?.toISOString(),
  });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error, status, profile } = await resolveOwnership(params.username, session.user.id);
  if (error) return NextResponse.json({ error }, { status });

  const record = await prisma.userSkillRecord.findUnique({
    where: { profileId_skillId: { profileId: profile!.id, skillId: params.skillId } },
  });
  if (!record) return NextResponse.json({ error: "Skill record not found" }, { status: 404 });

  await prisma.userSkillRecord.delete({
    where: { id: record.id },
  });

  // Recompute total_xp
  const agg = await prisma.userSkillRecord.aggregate({
    where: { profileId: profile!.id },
    _sum: { xp: true },
  });
  await prisma.profile.update({
    where: { id: profile!.id },
    data: { totalXp: agg._sum.xp ?? 0 },
  });

  return new NextResponse(null, { status: 204 });
}
