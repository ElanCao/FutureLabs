/**
 * GET /api/v1/profiles/:username/achievements — List public achievements for a profile
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/seed-data";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const { username } = params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        achievements: {
          orderBy: { unlockedAt: "desc" },
        },
      },
    });

    if (!profile || profile.privacy === "private") {
      // Check seed data as fallback
      const seedProfile = getProfile(username);
      if (!seedProfile || seedProfile.privacy === "private") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      // Return mock achievements for seed profiles
      return NextResponse.json({
        achievements: generateMockAchievements(seedProfile),
      });
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
        shareCount: a.shareCount,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch profile achievements:", error);
    // Fallback to seed data on error
    const seedProfile = getProfile(username);
    if (seedProfile) {
      return NextResponse.json({
        achievements: generateMockAchievements(seedProfile),
      });
    }
    return NextResponse.json({ achievements: [] });
  }
}

function generateMockAchievements(profile: { username: string; totalXp: number; skills: unknown[] }) {
  const hash = profile.username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const achievements = [];

  // Skill count milestone
  const skillCount = profile.skills?.length || 0;
  if (skillCount >= 50) {
    achievements.push({
      id: "skill-50",
      type: "skill_count",
      tier: skillCount >= 100 ? "platinum" : "gold",
      name: skillCount >= 100 ? "100 Skills Mapped" : "50 Skills Mapped",
      description: `Added ${skillCount >= 100 ? "100" : "50"} skills to their personal skill tree`,
      icon: "🌳",
      metadata: { skillCount },
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      shareCount: Math.floor(hash % 20),
    });
  }

  // XP milestone
  if (profile.totalXp >= 5000) {
    achievements.push({
      id: "xp-5000",
      type: "xp_milestone",
      tier: profile.totalXp >= 10000 ? "platinum" : "gold",
      name: profile.totalXp >= 10000 ? "10,000 XP Champion" : "5,000 XP Earned",
      description: `Accumulated ${profile.totalXp.toLocaleString()} experience points`,
      icon: "🚀",
      metadata: { totalXp: profile.totalXp },
      unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      shareCount: Math.floor(hash % 15),
    });
  }

  // First collaboration
  achievements.push({
    id: "collab-first",
    type: "first_collaboration",
    tier: "silver",
    name: "First Collaboration",
    description: "Completed their first AI-agent collaboration",
    icon: "🤝",
    metadata: {},
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    shareCount: Math.floor(hash % 10),
  });

  // Level reached (based on seed data)
  const avgLevel = profile.skills?.length
    ? Math.floor(profile.totalXp / (profile.skills.length * 100)) || 1
    : 1;

  if (avgLevel >= 5) {
    achievements.push({
      id: "level-5",
      type: "level_reached",
      tier: avgLevel >= 10 ? "platinum" : avgLevel >= 7 ? "gold" : "silver",
      name: avgLevel >= 10 ? "Level 10 Master" : `Level ${avgLevel} Achiever`,
      description: `Reached level ${avgLevel >= 10 ? "10" : avgLevel} across skills`,
      icon: "⭐",
      metadata: { level: avgLevel },
      unlockedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      shareCount: Math.floor(hash % 12),
    });
  }

  return achievements.sort((a, b) =>
    new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
  );
}
