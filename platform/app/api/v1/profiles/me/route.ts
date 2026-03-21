/**
 * GET /api/v1/profiles/me — return the current user's profile
 * Supports both session auth (browser) and API key auth (AI agents)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getProfileFromApiKey } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function serializeProfile(profile: Awaited<ReturnType<typeof prisma.profile.findUnique>> & {
  skills: { skillId: string; currentLevel: number; xp: number; evidence: { type: string; title: string | null; url: string | null; description: string | null }[] }[]
} | null) {
  if (!profile) return null;
  return {
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
  };
}

export async function GET(req: NextRequest) {
  // Try API key auth first (for AI agents)
  const agentProfile = await getProfileFromApiKey(req);
  if (agentProfile) {
    const full = await prisma.profile.findUnique({
      where: { id: agentProfile.id },
      include: { skills: { include: { evidence: true } } },
    });
    return NextResponse.json(serializeProfile(full));
  }

  // Fall back to session auth
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { skills: { include: { evidence: true } } },
    });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    return NextResponse.json(serializeProfile(profile));
  } catch {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
