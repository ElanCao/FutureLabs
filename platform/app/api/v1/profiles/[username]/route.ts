/**
 * GET   /api/v1/profiles/:username — public profile
 * PATCH /api/v1/profiles/:username — update privacy (authenticated owner)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/seed-data";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const { username } = params;

  try {
    // First try to fetch from database
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        UserSkillRecord: {
          include: {
            EvidenceRecord: true,
            Skill: true,
          },
        },
      },
    });

    if (profile) {
      // Check privacy - don't expose private profiles
      if (profile.privacy === "private") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json({
        username: profile.username,
        displayName: profile.displayName ?? profile.username,
        bio: profile.bio ?? "",
        avatarEmoji: profile.avatarEmoji ?? "🧑",
        privacy: profile.privacy.toLowerCase(),
        entityType: profile.entityType.toLowerCase(),
        totalXp: profile.totalXp,
        skills: profile.UserSkillRecord.map((record) => ({
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
        })),
      });
    }

    // Fallback to seed data if not found in DB
    const seedProfile = getProfile(username);
    if (!seedProfile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (seedProfile.privacy === "private") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(seedProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    // Fallback to seed data on error
    const seedProfile = getProfile(username);
    if (!seedProfile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(seedProfile);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { privacy, displayName, bio, avatarEmoji } = body;

    // Find the user and their profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { Profile: true },
    });

    if (!user?.Profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Ensure user can only update their own profile
    if (user.Profile.username !== params.username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the profile
    const updated = await prisma.profile.update({
      where: { id: user.Profile.id },
      data: {
        ...(privacy && { privacy: privacy === "public" ? "public" : "private" }),
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(avatarEmoji !== undefined && { avatarEmoji }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      username: updated.username,
      displayName: updated.displayName,
      bio: updated.bio,
      avatarEmoji: updated.avatarEmoji,
      privacy: updated.privacy,
      entityType: updated.entityType,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
