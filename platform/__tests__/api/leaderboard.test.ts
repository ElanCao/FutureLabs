import { GET } from "@/app/api/v1/leaderboard/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

function makeRequest(qs = ""): NextRequest {
  return new NextRequest(`http://localhost/api/v1/leaderboard${qs}`);
}

const mockProfile = {
  id: "p1",
  username: "alice",
  displayName: "Alice",
  avatarEmoji: "🧑",
  entityType: "human" as const,
  totalXp: 500,
  privacy: "public" as const,
  bio: "",
  avatarUrl: null,
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  skills: [],
  _count: { receivedEndorsements: 2 },
};

describe("GET /api/v1/leaderboard", () => {
  it("returns ranked profiles sorted by XP", async () => {
    prismaMock.profile.findMany.mockResolvedValueOnce([mockProfile] as never);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].rank).toBe(1);
    expect(json[0].username).toBe("alice");
    expect(json[0].totalXp).toBe(500);
  });

  it("caps limit at 50", async () => {
    prismaMock.profile.findMany.mockResolvedValueOnce([]);

    const res = await GET(makeRequest("?limit=200"));
    expect(res.status).toBe(200);
    expect(prismaMock.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 })
    );
  });

  it("falls back to seed data on DB error", async () => {
    prismaMock.profile.findMany.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("filters by branch name via DB query", async () => {
    prismaMock.profile.findMany.mockResolvedValueOnce([mockProfile] as never);

    const res = await GET(makeRequest("?branch=Engineering"));
    expect(res.status).toBe(200);
    expect(prismaMock.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          skills: expect.objectContaining({ some: expect.anything() }),
        }),
      })
    );
  });

  it("falls back to seed data with branch filter on DB error", async () => {
    prismaMock.profile.findMany.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET(makeRequest("?branch=Engineering"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("maps topSkills correctly when profiles have skills", async () => {
    const profileWithSkills = {
      ...mockProfile,
      skills: [
        {
          skillId: "s1",
          currentLevel: 3,
          skill: { name: "TypeScript", icon: "⚡", branch: { name: "Engineering" } },
        },
      ],
    };
    prismaMock.profile.findMany.mockResolvedValueOnce([profileWithSkills] as never);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0].topSkills).toHaveLength(1);
    expect(json[0].topSkills[0].name).toBe("TypeScript");
    expect(json[0].topSkills[0].branch).toBe("Engineering");
  });
});
