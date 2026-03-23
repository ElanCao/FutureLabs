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

  it("returns profile with skills and endorsements", async () => {
    const profileWithSkills = {
      ...mockProfile,
      skills: [
        {
          skillId: "s1",
          currentLevel: 2,
          xp: 150,
          evidence: [],
          skill: {
            name: "TypeScript",
            icon: "⚡",
            maxLevel: 5,
            branch: { name: "Engineering" },
          },
        },
      ],
    };
    prismaMock.profile.findUnique.mockResolvedValueOnce(profileWithSkills as never);
    prismaMock.skillEndorsement.findMany.mockResolvedValueOnce([
      {
        skillId: "s1",
        endorser: { username: "bob", displayName: "Bob", avatarEmoji: "🤖" },
      },
    ] as never);

    const res = await GET(makeGetReq("alice"), { params: { username: "alice" } });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.skills).toHaveLength(1);
    expect(json.skills[0].name).toBe("TypeScript");
    expect(json.skills[0].endorsements.count).toBe(1);
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

  it("returns 404 if profile not found in PATCH", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/v1/profiles/alice", {
      method: "PATCH",
      body: JSON.stringify({ displayName: "Alice B" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { username: "alice" } });
    expect(res.status).toBe(404);
  });

  it("returns 500 on unexpected PATCH error", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce({ ...mockProfile, userId: "u1" } as never);
    prismaMock.profile.update.mockRejectedValueOnce(new Error("DB error"));

    const req = new NextRequest("http://localhost/api/v1/profiles/alice", {
      method: "PATCH",
      body: JSON.stringify({ displayName: "Alice B" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { username: "alice" } });
    expect(res.status).toBe(500);
  });
});
