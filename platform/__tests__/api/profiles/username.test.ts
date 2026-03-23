import { GET, PATCH } from "@/app/api/v1/profiles/[username]/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

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
  totalXp: 100,
  userId: "u1",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  skills: [],
};

function makeGetReq(username: string) {
  return new NextRequest(`http://localhost/api/v1/profiles/${username}`);
}

describe("GET /api/v1/profiles/:username", () => {
  it("returns public profile", async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.skillEndorsement.findMany.mockResolvedValueOnce([]);

    const res = await GET(makeGetReq("alice"), { params: { username: "alice" } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.username).toBe("alice");
  });

  it("returns 404 for private profile", async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile, privacy: "private" } as never);

    const res = await GET(makeGetReq("alice"), { params: { username: "alice" } });
    expect(res.status).toBe(404);
  });

  it("returns 404 for unknown username (no seed fallback)", async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    const res = await GET(makeGetReq("nonexistent_xyz_12345"), { params: { username: "nonexistent_xyz_12345" } });
    expect(res.status).toBe(404);
  });

  it("falls back to seed data on DB error", async () => {
    prismaMock.profile.findUnique.mockRejectedValueOnce(new Error("DB down"));

    // If seed has no match, returns 404
    const res = await GET(makeGetReq("unknown_person_xyz"), { params: { username: "unknown_person_xyz" } });
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/v1/profiles/:username", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/v1/profiles/alice", {
      method: "PATCH",
      body: JSON.stringify({ displayName: "Alice B" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { username: "alice" } });
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-owner", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "other_user" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile, userId: "u1" } as never);

    const req = new NextRequest("http://localhost/api/v1/profiles/alice", {
      method: "PATCH",
      body: JSON.stringify({ displayName: "Alice B" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { username: "alice" } });
    expect(res.status).toBe(403);
  });

  it("updates profile as owner", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile, userId: "u1" } as never);
    prismaMock.profile.update.mockResolvedValueOnce({ ...mockProfile, displayName: "Alice B" } as never);

    const req = new NextRequest("http://localhost/api/v1/profiles/alice", {
      method: "PATCH",
      body: JSON.stringify({ displayName: "Alice B" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { username: "alice" } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.displayName).toBe("Alice B");
  });
});
