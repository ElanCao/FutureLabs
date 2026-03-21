/**
 * GET  /api/v1/profiles  — list public profiles (paginated, filterable by branch/skill)
 * POST /api/v1/profiles  — create a profile for the authenticated user
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { SEED_PROFILES } from "@/lib/seed-data";

const PAGE_SIZE = 12;

function seedFallback(page: number, limit: number, skill?: string) {
  let all = SEED_PROFILES.filter((p) => p.privacy === "public");
  if (skill) {
    const q = skill.toLowerCase();
    all = all.filter((p) => p.skills.some((s) => s.skillId.toLowerCase().includes(q)));
  }
  const total = all.length;
  const profiles = all.slice((page - 1) * limit, page * limit);
  return NextResponse.json({ profiles, total, page, limit });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? String(PAGE_SIZE)));
  const skill = searchParams.get("skill") ?? undefined;

  try {
    const where: Record<string, unknown> = { privacy: "public" };
    if (skill) {
      where.skills = {
        some: { skill: { name: { contains: skill, mode: "insensitive" } } },
      };
    }

    const [rows, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { totalXp: "desc" },
        include: {
          skills: {
            include: { skill: { include: { branch: true } }, evidence: true },
          },
        },
      }),
      prisma.profile.count({ where }),
    ]);

    const profiles = rows.map((p) => ({
      username: p.username,
      displayName: p.displayName ?? p.username,
      bio: p.bio ?? "",
      avatarEmoji: p.avatarEmoji ?? "🧑",
      entityType: p.entityType,
      privacy: p.privacy,
      totalXp: p.totalXp,
      skills: p.skills.map((s) => ({
        skillId: s.skillId,
        currentLevel: s.currentLevel,
        xp: s.xp,
        evidence: s.evidence.map((e) => ({
          type: e.type, title: e.title, url: e.url, description: e.description,
        })),
      })),
    }));

    return NextResponse.json({ profiles, total, page, limit });
  } catch {
    return seedFallback(page, limit, skill);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { username, displayName, bio, avatarEmoji, entityType, privacy } = body;

  if (!username || !/^[a-z0-9_-]{3,32}$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const userId = (session.user as { id?: string }).id;

  try {
    const existing = await prisma.profile.findUnique({ where: { username } });
    if (existing) return NextResponse.json({ error: "Username already taken" }, { status: 409 });

    const profile = await prisma.profile.create({
      data: {
        username,
        displayName: displayName ?? username,
        bio: bio ?? "",
        avatarEmoji: avatarEmoji ?? "🧑",
        entityType: entityType ?? "human",
        privacy: privacy ?? "public",
        totalXp: 0,
        ...(userId ? { userId } : {}),
      },
    });

    return NextResponse.json(
      {
        username: profile.username,
        displayName: profile.displayName ?? profile.username,
        bio: profile.bio ?? "",
        avatarEmoji: profile.avatarEmoji ?? "🧑",
        entityType: profile.entityType,
        privacy: profile.privacy,
        skills: [],
        totalXp: 0,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
