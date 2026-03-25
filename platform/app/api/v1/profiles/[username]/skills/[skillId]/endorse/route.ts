/**
 * POST /api/v1/profiles/:username/skills/:skillId/endorse
 *   — Any registered user can endorse a skill on another user's profile.
 *     Body: { note?: string }
 *     Returns the created endorsement.
 *
 * DELETE /api/v1/profiles/:username/skills/:skillId/endorse
 *   — Retract an endorsement (by the endorser).
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

interface Params { params: { username: string; skillId: string } }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const endorserUserId = (session.user as { id?: string }).id;
  if (!endorserUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const note: string | undefined = typeof body.note === "string" ? body.note.trim().slice(0, 280) || undefined : undefined;

  try {
    // Resolve endorser profile
    const endorserProfile = await prisma.profile.findUnique({ where: { userId: endorserUserId } });
    if (!endorserProfile) return NextResponse.json({ error: "You need a profile to endorse others" }, { status: 403 });

    // Resolve endorsee profile
    const endorseeProfile = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!endorseeProfile || endorseeProfile.privacy === "private") {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Cannot endorse yourself
    if (endorserProfile.id === endorseeProfile.id) {
      return NextResponse.json({ error: "You cannot endorse yourself" }, { status: 400 });
    }

    // Verify the skill exists on the endorsee's profile
    const skillRecord = await prisma.userSkillRecord.findUnique({
      where: { profileId_skillId: { profileId: endorseeProfile.id, skillId: params.skillId } },
    });
    if (!skillRecord) return NextResponse.json({ error: "Skill not found on this profile" }, { status: 404 });

    // Create or update endorsement (upsert — update note if already endorsed)
    const endorsement = await prisma.skillEndorsement.upsert({
      where: {
        endorserId_endorseeId_skillId: {
          endorserId: endorserProfile.id,
          endorseeId: endorseeProfile.id,
          skillId: params.skillId,
        },
      },
      update: { note: note ?? null },
      create: {
        id: crypto.randomUUID(),
        endorserId: endorserProfile.id,
        endorseeId: endorseeProfile.id,
        skillId: params.skillId,
        note: note ?? null,
      },
      include: {
        Endorser: { select: { username: true, displayName: true, avatarEmoji: true } },
        Skill: { select: { name: true, icon: true } },
      },
    });

    // Create notification for the endorsee (suppress duplicates by referenceId)
    const notifMessage = `${endorserProfile.displayName ?? endorserProfile.username} endorsed your ${endorsement.Skill.name} skill`;
    await prisma.notification.upsert({
      where: {
        // We use a synthetic unique constraint workaround: find existing by profileId + referenceId
        // Since Prisma doesn't support unique on nullable+non-unique combos easily, use create+catch
        id: "~~impossible~~",
      },
      update: {},
      create: {
        profileId: endorseeProfile.id,
        type: "endorsement",
        referenceId: endorsement.id,
        message: notifMessage,
        read: false,
      },
    }).catch(async () => {
      // Upsert by referenceId not supported natively — try findFirst + create
      const existing = await prisma.notification.findFirst({
        where: { profileId: endorseeProfile.id, referenceId: endorsement.id },
      });
      if (!existing) {
        await prisma.notification.create({
          data: {
            id: crypto.randomUUID(),
            profileId: endorseeProfile.id,
            type: "endorsement",
            referenceId: endorsement.id,
            message: notifMessage,
            read: false,
          },
        });
      }
    });

    return NextResponse.json({
      id: endorsement.id,
      skillId: endorsement.skillId,
      note: endorsement.note,
      createdAt: endorsement.createdAt,
      endorser: {
        username: endorsement.endorser.username,
        displayName: endorsement.endorser.displayName ?? endorsement.endorser.username,
        avatarEmoji: endorsement.endorser.avatarEmoji ?? "🧑",
      },
    }, { status: 201 });
  } catch (err) {
    console.error("POST endorse error:", err);
    return NextResponse.json({ error: "Failed to endorse skill" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const endorserUserId = (session.user as { id?: string }).id;
  if (!endorserUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const endorserProfile = await prisma.profile.findUnique({ where: { userId: endorserUserId } });
    if (!endorserProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const endorseeProfile = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!endorseeProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    await prisma.skillEndorsement.deleteMany({
      where: {
        endorserId: endorserProfile.id,
        endorseeId: endorseeProfile.id,
        skillId: params.skillId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE endorse error:", err);
    return NextResponse.json({ error: "Failed to retract endorsement" }, { status: 500 });
  }
}
