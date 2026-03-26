/**
 * GET  /api/v1/profiles/:username/endorsements — list endorsements received
 * POST /api/v1/profiles/:username/endorsements — endorse a skill (auth required)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const profile = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const endorsements = await prisma.skillEndorsement.findMany({
      where: { endorseeId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    // Fetch endorser and skill data separately
    const endorserIds = Array.from(new Set(endorsements.map((e) => e.endorserId)));
    const skillIds = Array.from(new Set(endorsements.map((e) => e.skillId)));

    const [endorsers, skills] = await Promise.all([
      prisma.profile.findMany({
        where: { id: { in: endorserIds } },
        select: { id: true, username: true, displayName: true, avatarEmoji: true },
      }),
      prisma.skill.findMany({
        where: { id: { in: skillIds } },
        select: { id: true, name: true, icon: true },
      }),
    ]);

    const endorserMap = new Map(endorsers.map((e) => [e.id, e]));
    const skillMap = new Map(skills.map((s) => [s.id, s]));

    return NextResponse.json(
      endorsements.map((e) => {
        const endorser = endorserMap.get(e.endorserId);
        const skill = skillMap.get(e.skillId);
        return {
          id: e.id,
          skillId: e.skillId,
          skillName: skill?.name ?? "Unknown",
          skillIcon: skill?.icon ?? "⭐",
          endorser: {
            username: endorser?.username ?? "unknown",
            displayName: endorser?.displayName ?? endorser?.username ?? "Unknown",
            avatarEmoji: endorser?.avatarEmoji ?? "🧑",
          },
          note: e.note,
          createdAt: e.createdAt,
        };
      })
    );
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { skillId, note } = body;
  if (!skillId) return NextResponse.json({ error: "skillId required" }, { status: 400 });

  try {
    const endorser = await prisma.profile.findUnique({ where: { userId } });
    if (!endorser) return NextResponse.json({ error: "You need a profile to endorse others" }, { status: 403 });

    const endorsee = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!endorsee) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    if (endorser.id === endorsee.id) {
      return NextResponse.json({ error: "You cannot endorse yourself" }, { status: 400 });
    }

    const skillRecord = await prisma.userSkillRecord.findUnique({
      where: { profileId_skillId: { profileId: endorsee.id, skillId } },
    });
    if (!skillRecord) return NextResponse.json({ error: "User does not have this skill" }, { status: 400 });

    const endorsement = await prisma.skillEndorsement.create({
      data: { id: crypto.randomUUID(), endorserId: endorser.id, endorseeId: endorsee.id, skillId, note: note ?? null },
      include: {
        Skill: { select: { name: true, icon: true } },
        Profile_SkillEndorsement_endorserIdToProfile: { select: { username: true, displayName: true } },
      },
    });

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        profileId: endorsee.id,
        type: "endorsement",
        referenceId: endorsement.id,
        message: `${endorser.displayName ?? endorser.username} endorsed your ${endorsement.Skill.name} skill!`,
      },
    });

    return NextResponse.json(
      {
        id: endorsement.id,
        skillId: endorsement.skillId,
        skillName: endorsement.Skill.name,
        skillIcon: endorsement.Skill.icon,
        endorser: {
          username: endorsement.Profile_SkillEndorsement_endorserIdToProfile.username,
          displayName: endorsement.Profile_SkillEndorsement_endorserIdToProfile.displayName ?? endorsement.Profile_SkillEndorsement_endorserIdToProfile.username,
        },
        note: endorsement.note,
        createdAt: endorsement.createdAt,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return NextResponse.json({ error: "Already endorsed" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create endorsement" }, { status: 500 });
  }
}
