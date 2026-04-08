/**
 * GET /api/v1/achievements — List current user's achievements
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        achievements: {
          orderBy: { unlockedAt: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ achievements: [] });
    }

    return NextResponse.json({
      achievements: profile.achievements.map((a) => ({
        id: a.id,
        type: a.type,
        tier: a.tier,
        name: a.name,
        description: a.description,
        icon: a.icon,
        metadata: a.metadata,
        unlockedAt: a.unlockedAt,
        sharedAt: a.sharedAt,
        shareCount: a.shareCount,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    // Return empty array on error to not break the UI
    return NextResponse.json({ achievements: [] });
  }
}
