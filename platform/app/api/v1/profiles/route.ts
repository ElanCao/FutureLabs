/**
 * GET  /api/v1/profiles  — list public profiles (paginated, filterable by branch)
 * POST /api/v1/profiles  — create a profile for the authenticated user
 *
 * NOTE: Full DB-backed implementation lives in FUT-23 (CTO). These stubs return
 * seed data so the frontend works before the backend is deployed.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { SEED_PROFILES } from "@/lib/seed-data";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? String(PAGE_SIZE)));
  void searchParams.get("branch"); // branch filter handled by DB in FUT-23

  // Return seed profiles as fallback (DB implementation replaces this)
  const all = SEED_PROFILES.filter((p) => p.privacy === "public");
  const total = all.length;
  const profiles = all.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ profiles, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username, displayName, bio, avatarEmoji, entityType, privacy } = body;

  if (!username || !/^[a-z0-9_-]{3,32}$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  // Stub: actual persistence happens in DB (FUT-23)
  return NextResponse.json(
    {
      username,
      displayName: displayName ?? username,
      bio: bio ?? "",
      avatarEmoji: avatarEmoji ?? "🧑",
      entityType: entityType ?? "human",
      privacy: privacy ?? "public",
      skills: [],
      totalXp: 0,
    },
    { status: 201 }
  );
}
