/**
 * GET /api/v1/profiles/:username — public profile as JSON (schema-compliant)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProfile } from "@/lib/profile-serializer";

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: { skillRecords: { include: { evidenceRecords: true, skill: true } } },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Respect privacy — only public profiles are accessible without auth
  // (extend with session check for friends/private later)
  if (profile.privacy !== "public") {
    return NextResponse.json({ error: "Profile is private" }, { status: 403 });
  }

  return NextResponse.json(serializeProfile(profile));
}
