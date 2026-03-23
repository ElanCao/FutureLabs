import { GET } from "@/app/api/v1/profiles/me/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { hashApiKey } from "@/lib/api-key";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
const getServerSessionMock = getServerSession as jest.Mock;

const mockProfile = {
  id: "p1",
  username: "alice",
  displayName: "Alice",
  bio: "",
  avatarEmoji: "🧑",
  entityType: "human" as const,
  privacy: "public" as const,
  totalXp: 0,
  userId: "u1",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  skills: [],
};

describe("GET /api/v1/profiles/me", () => {
  it("returns 401 without any auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    // Simulate no API key
    const req = new NextRequest("http://localhost/api/v1/profiles/me");
    prismaMock.apiKey.findUnique.mockResolvedValueOnce(null);

    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns profile for session auth", async () => {
    const req = new NextRequest("http://localhost/api/v1/profiles/me");
    // No API key header → falls through to session
    prismaMock.apiKey.findUnique.mockResolvedValueOnce(null);
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1", email: "a@a.com" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile } as never);

    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.username).toBe("alice");
  });

  it("returns profile for API key auth", async () => {
    const rawKey = "sk_abc123def456789012345678901234567890123456789012345678901234";
    const req = new NextRequest("http://localhost/api/v1/profiles/me", {
      headers: { "x-api-key": rawKey },
    });

    prismaMock.apiKey.findUnique.mockResolvedValueOnce({
      id: "k1",
      profileId: "p1",
      keyHash: hashApiKey(rawKey),
      keyPrefix: rawKey.slice(0, 10),
      name: "Test Key",
      expiresAt: null,
      lastUsedAt: null,
      createdAt: new Date(),
      profile: mockProfile,
    } as never);
    prismaMock.apiKey.update.mockResolvedValueOnce({} as never);
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile } as never);

    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it("returns 404 if no profile linked to session user", async () => {
    const req = new NextRequest("http://localhost/api/v1/profiles/me");
    prismaMock.apiKey.findUnique.mockResolvedValueOnce(null);
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2", email: "b@b.com" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    const res = await GET(req);
    expect(res.status).toBe(404);
  });
});
