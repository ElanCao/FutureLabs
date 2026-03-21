/**
 * POST /api/v1/profiles — create/claim a profile (authenticated)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeProfile } from "@/lib/profile-serializer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const { username, displayName, bio, avatarUrl, avatarEmoji, entityType, privacy } = body;

  // Username validation
  if (!/^[a-zA-Z0-9_-]{2,30}$/.test(username)) {
    return NextResponse.json(
      { error: "username must be 2-30 alphanumeric/underscore/hyphen chars" },
      { status: 400 }
    );
  }

  // Check if user already has a profile
  const existing = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  if (existing) {
    return NextResponse.json({ error: "User already has a profile" }, { status: 409 });
  }

  // Check username taken
  const taken = await prisma.profile.findUnique({ where: { username } });
  if (taken) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const profile = await prisma.profile.create({
    data: {
      username,
      displayName: displayName ?? null,
      bio: bio ?? null,
      avatarUrl: avatarUrl ?? null,
      avatarEmoji: avatarEmoji ?? null,
      entityType: entityType === "ai_agent" ? "ai_agent" : "human",
      privacy: ["public", "friends", "private"].includes(privacy) ? privacy : "private",
      userId: session.user.id,
    },
    include: { skillRecords: { include: { evidenceRecords: true, skill: true } } },
  });

  return NextResponse.json(serializeProfile(profile), { status: 201 });
}
