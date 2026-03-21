export { authOptions } from "@/lib/auth-options";

/**
 * API key authentication for AI agents.
 * Checks x-api-key header (or Authorization: Bearer sk_...) against stored hashes.
 */
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/api-key";

export async function getProfileFromApiKey(req: NextRequest) {
  let raw: string | null = req.headers.get("x-api-key");
  if (!raw) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth.startsWith("Bearer sk_")) raw = auth.slice(7);
  }
  if (!raw?.startsWith("sk_")) return null;

  try {
    const hash = hashApiKey(raw);
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash: hash },
      include: { profile: true },
    });
    if (!apiKey) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

    // Update lastUsedAt asynchronously
    prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => {});

    return apiKey.profile;
  } catch {
    return null;
  }
}
