/**
 * GET /api/v1/profiles/me — return the current user's profile
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: {
          include: { skill: { include: { branch: true } }, evidence: true },
        },
      },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

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
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
