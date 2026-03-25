/**
 * GET /api/v1/profiles/me — return the current user's profile
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Look up user by email and include their profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Profile: {
          include: {
            UserSkillRecord: {
              include: {
                EvidenceRecord: true,
              },
            },
          },
        },
      },
    });

    if (!user?.Profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Transform to API response format
    const profile = user.Profile;
    const skills = profile.UserSkillRecord.map((record) => ({
      skillId: record.skillId,
      currentLevel: record.currentLevel,
      xp: record.xp,
      evidence: record.EvidenceRecord.map((ev) => ({
        type: ev.type,
        title: ev.title,
        url: ev.url,
        description: ev.description,
        verified: ev.verified,
      })),
    }));

    return NextResponse.json({
      username: profile.username,
      displayName: profile.displayName ?? profile.username,
      bio: profile.bio ?? "",
      avatarEmoji: profile.avatarEmoji ?? "🧑",
      privacy: profile.privacy.toLowerCase(),
      entityType: profile.entityType.toLowerCase(),
      totalXp: profile.totalXp,
      skills,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
