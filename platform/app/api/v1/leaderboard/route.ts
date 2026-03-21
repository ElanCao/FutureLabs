/**
 * GET /api/v1/leaderboard — top profiles by XP, optionally filtered by branch
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_PROFILES, SKILLS, BRANCHES } from "@/lib/seed-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch") ?? undefined;
  const limit = Math.min(50, Number(searchParams.get("limit") ?? "50"));

  try {
    const where: Record<string, unknown> = { privacy: "public" };

    if (branch) {
      where.skills = {
        some: { skill: { branch: { name: { contains: branch, mode: "insensitive" } } } },
      };
    }

    const profiles = await prisma.profile.findMany({
      where,
      orderBy: { totalXp: "desc" },
      take: limit,
      include: {
        skills: {
          include: { skill: { include: { branch: true } } },
          orderBy: { currentLevel: "desc" },
          take: 3,
        },
        _count: { select: { receivedEndorsements: true } },
      },
    });

    return NextResponse.json(
      profiles.map((p, i) => ({
        rank: i + 1,
        username: p.username,
        displayName: p.displayName ?? p.username,
        avatarEmoji: p.avatarEmoji ?? "🧑",
        entityType: p.entityType,
        totalXp: p.totalXp,
        skillCount: p.skills.length,
        endorsementCount: p._count.receivedEndorsements,
        topSkills: p.skills.map((s) => ({
          name: s.skill.name,
          icon: s.skill.icon,
          level: s.currentLevel,
          branch: s.skill.branch.name,
        })),
      }))
    );
  } catch {
    // Seed fallback
    let all = SEED_PROFILES.filter((p) => p.privacy === "public");
    if (branch) {
      all = all.filter((p) =>
        p.skills.some((s) => {
          const skill = SKILLS.find((sk) => sk.id === s.skillId);
          const b = BRANCHES.find((br) => br.id === skill?.branch);
          return b?.name.toLowerCase().includes(branch.toLowerCase());
        })
      );
    }
    all.sort((a, b) => b.totalXp - a.totalXp);
    return NextResponse.json(
      all.slice(0, limit).map((p, i) => ({
        rank: i + 1,
        username: p.username,
        displayName: p.displayName,
        avatarEmoji: p.avatarEmoji,
        entityType: p.entityType,
        totalXp: p.totalXp,
        skillCount: p.skills.length,
        endorsementCount: 0,
        topSkills: [],
      }))
    );
  }
}
