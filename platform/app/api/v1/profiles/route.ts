/**
 * GET  /api/v1/profiles  — list public profiles (paginated, filterable by branch)
 * POST /api/v1/profiles  — create a profile for the authenticated user
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { SEED_PROFILES } from "@/lib/seed-data";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? String(PAGE_SIZE)));

  try {
    // Query public profiles from database
    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where: { privacy: "public" },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          UserSkillRecord: {
            include: {
              EvidenceRecord: true,
            },
          },
        },
      }),
      prisma.profile.count({ where: { privacy: "public" } }),
    ]);

    // Also include seed profiles for now (until DB is fully populated)
    const seedProfiles = SEED_PROFILES.filter((p) => p.privacy === "public");
    const combinedProfiles = [...profiles.map((p) => ({
      username: p.username,
      displayName: p.displayName ?? p.username,
      bio: p.bio ?? "",
      avatarEmoji: p.avatarEmoji ?? "🧑",
      privacy: p.privacy.toLowerCase(),
      entityType: p.entityType.toLowerCase(),
      totalXp: p.totalXp,
      skills: p.UserSkillRecord.map((r) => ({
        skillId: r.skillId,
        currentLevel: r.currentLevel,
        xp: r.xp,
      })),
    })), ...seedProfiles];

    return NextResponse.json({
      profiles: combinedProfiles.slice(0, limit),
      total: total + seedProfiles.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    // Fallback to seed data if DB is not available
    const all = SEED_PROFILES.filter((p) => p.privacy === "public");
    const total = all.length;
    const profiles = all.slice((page - 1) * limit, page * limit);
    return NextResponse.json({ profiles, total, page, limit });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { username, displayName, bio, avatarEmoji, entityType, privacy } = body;

    if (!username || !/^[a-z0-9_-]{3,32}$/.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Check if user already has a profile
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { Profile: true },
    });

    if (existingUser?.Profile) {
      return NextResponse.json(
        { error: "You already have a profile" },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Create the profile
    const profile = await prisma.profile.create({
      data: {
        id: crypto.randomUUID(),
        username,
        displayName: displayName ?? username,
        bio: bio ?? "",
        avatarEmoji: avatarEmoji ?? "🧑",
        entityType: entityType === "ai_agent" ? "ai_agent" : "human",
        privacy: privacy === "public" ? "public" : "private",
        totalXp: 0,
        updatedAt: new Date(),
        userId: existingUser?.id,
      },
    });

    return NextResponse.json(
      {
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarEmoji: profile.avatarEmoji,
        entityType: profile.entityType,
        privacy: profile.privacy,
        skills: [],
        totalXp: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
