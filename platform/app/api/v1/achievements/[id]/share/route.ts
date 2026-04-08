/**
 * POST /api/v1/achievements/:id/share — Track an achievement share event
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

interface Params { params: { id: string } }

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;

  try {
    // Verify the achievement belongs to the current user
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        achievements: {
          where: { id: params.id },
        },
      },
    });

    if (!profile || profile.achievements.length === 0) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    // Update share count and sharedAt timestamp
    const achievement = await prisma.achievement.update({
      where: { id: params.id },
      data: {
        shareCount: { increment: 1 },
        sharedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      achievement: {
        id: achievement.id,
        shareCount: achievement.shareCount,
        sharedAt: achievement.sharedAt,
      },
    });
  } catch (error) {
    console.error("Failed to track achievement share:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}
