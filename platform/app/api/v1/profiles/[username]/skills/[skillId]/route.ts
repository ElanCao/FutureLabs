/**
 * PUT    /api/v1/profiles/:username/skills/:skillId — add/update skill record
 * DELETE /api/v1/profiles/:username/skills/:skillId — remove skill record
 *
 * Stubs that return success until FUT-23 DB backend is deployed.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

interface Params { params: { username: string; skillId: string } }

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  return NextResponse.json({ skillId: params.skillId, ...body });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
