/**
 * GET /api/v1/profiles/me — return the current user's profile
 *
 * Stub: returns 404 until FUT-23 DB backend is deployed.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // DB lookup happens in FUT-23 implementation
  return NextResponse.json({ error: "Profile not found" }, { status: 404 });
}
