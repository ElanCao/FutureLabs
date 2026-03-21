/**
 * GET    /api/v1/profiles/:username/api-keys — list API keys (no raw key returned)
 * POST   /api/v1/profiles/:username/api-keys — create new API key (returns raw key ONCE)
 * DELETE /api/v1/profiles/:username/api-keys?id=:keyId — revoke a key
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-key";

interface Params { params: { username: string } }

async function requireOwner(username: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id?: string }).id;
  try {
    const profile = await prisma.profile.findUnique({ where: { username } });
    if (!profile || profile.userId !== userId) return null;
    return profile;
  } catch { return null; }
}

export async function GET(_req: NextRequest, { params }: Params) {
  const profile = await requireOwner(params.username);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const keys = await prisma.apiKey.findMany({
      where: { profileId: profile.id },
      select: { id: true, name: true, keyPrefix: true, lastUsedAt: true, expiresAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(keys);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const profile = await requireOwner(params.username);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name } = body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Key name is required" }, { status: 400 });
  }

  // Limit: 10 keys per profile
  const count = await prisma.apiKey.count({ where: { profileId: profile.id } });
  if (count >= 10) {
    return NextResponse.json({ error: "Maximum 10 API keys per profile" }, { status: 400 });
  }

  const { raw, hash, prefix } = generateApiKey();

  const key = await prisma.apiKey.create({
    data: {
      profileId: profile.id,
      name: name.trim(),
      keyHash: hash,
      keyPrefix: prefix,
    },
    select: { id: true, name: true, keyPrefix: true, createdAt: true },
  });

  // Return raw key ONLY on creation — never shown again
  return NextResponse.json({ ...key, key: raw }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const profile = await requireOwner(params.username);
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const keyId = searchParams.get("id");
  if (!keyId) return NextResponse.json({ error: "id is required" }, { status: 400 });

  try {
    await prisma.apiKey.deleteMany({ where: { id: keyId, profileId: profile.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
  }
}
