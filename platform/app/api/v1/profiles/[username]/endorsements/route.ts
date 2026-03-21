/**
 * GET /api/v1/profiles/:username/endorsements
 *   — Returns all endorsements for a profile, grouped by skillId.
 *     Each group includes endorser info and endorsement count.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const profile = await prisma.profile.findUnique({ where: { username: params.username } });
    if (!profile || profile.privacy === "private") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const endorsements = await prisma.skillEndorsement.findMany({
      where: { endorseeId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        endorser: { select: { username: true, displayName: true, avatarEmoji: true } },
        skill: { select: { id: true, name: true, icon: true } },
      },
    });

    // Group by skillId
    const bySkill: Record<string, {
      skillId: string;
      skillName: string;
      skillIcon: string | null;
      count: number;
      endorsers: { username: string; displayName: string; avatarEmoji: string; note: string | null; createdAt: Date }[];
    }> = {};

    for (const e of endorsements) {
      if (!bySkill[e.skillId]) {
        bySkill[e.skillId] = {
          skillId: e.skillId,
          skillName: e.skill.name,
          skillIcon: e.skill.icon,
          count: 0,
          endorsers: [],
        };
      }
      bySkill[e.skillId].count++;
      // Only include first 5 endorsers
      if (bySkill[e.skillId].endorsers.length < 5) {
        bySkill[e.skillId].endorsers.push({
          username: e.endorser.username,
          displayName: e.endorser.displayName ?? e.endorser.username,
          avatarEmoji: e.endorser.avatarEmoji ?? "🧑",
          note: e.note,
          createdAt: e.createdAt,
        });
      }
    }

    return NextResponse.json({ endorsements: Object.values(bySkill) });
  } catch (err) {
    console.error("GET endorsements error:", err);
    return NextResponse.json({ error: "Failed to fetch endorsements" }, { status: 500 });
  }
}
