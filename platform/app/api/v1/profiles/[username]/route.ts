/**
 * GET   /api/v1/profiles/:username — public profile
 * PATCH /api/v1/profiles/:username — update profile fields (authenticated owner)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/seed-data";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username: params.username },
      include: {
        skills: {
          include: { skill: { include: { branch: true } }, evidence: true },
        },
      },
    });

    if (!profile || profile.privacy === "private") {
      // Fall back to seed data
      const seed = getProfile(params.username);
      if (!seed || seed.privacy === "private") return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(seed);
    }

    return NextResponse.json({
      username: profile.username,
      displayName: profile.displayName ?? profile.username,
      bio: profile.bio ?? "",
      avatarEmoji: profile.avatarEmoji ?? "🧑",
      entityType: profile.entityType,
      privacy: profile.privacy,
      totalXp: profile.totalXp,
      skills: profile.skills.map((s) => ({
        skillId: s.skillId,
        currentLevel: s.currentLevel,
        xp: s.xp,
        evidence: s.evidence.map((e) => ({
          type: e.type, title: e.title, url: e.url, description: e.description,
        })),
      })),
    });
  } catch {
    // DB unavailable — fall back to seed
    const seed = getProfile(params.username);
    if (!seed || seed.privacy === "private") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(seed);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;

  try {
    const profile = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (profile.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { displayName, bio, avatarEmoji, privacy } = body;

    const updated = await prisma.profile.update({
      where: { username: params.username },
      data: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatarEmoji !== undefined ? { avatarEmoji } : {}),
        ...(privacy !== undefined ? { privacy } : {}),
      },
    });

    return NextResponse.json({
      username: updated.username,
      displayName: updated.displayName,
      bio: updated.bio,
      avatarEmoji: updated.avatarEmoji,
      privacy: updated.privacy,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
