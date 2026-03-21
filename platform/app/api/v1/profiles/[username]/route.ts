/**
 * GET   /api/v1/profiles/:username — public profile
 * PATCH /api/v1/profiles/:username — update privacy (authenticated owner)
 *
 * Stub: falls back to seed data until FUT-23 DB backend is deployed.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getProfile } from "@/lib/seed-data";

interface Params { params: { username: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  const profile = getProfile(params.username);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (profile.privacy === "private") return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // Stub — actual update in FUT-23
  return NextResponse.json({ username: params.username, ...body });
}
