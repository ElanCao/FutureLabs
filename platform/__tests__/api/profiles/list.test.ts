import { GET } from "@/app/api/v1/profiles/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

function makeRequest(qs = ""): NextRequest {
  return new NextRequest(`http://localhost/api/v1/profiles${qs}`);
}

const mockProfile = {
  id: "p1",
  username: "alice",
  displayName: "Alice",
  avatarEmoji: "🧑",
  entityType: "human" as const,
  totalXp: 100,
  privacy: "public" as const,
  bio: "",
  avatarUrl: null,
  userId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  skills: [],
};

describe("GET /api/v1/profiles", () => {
  it("returns public profiles", async () => {
    prismaMock.profile.findMany.mockResolvedValueOnce([mockProfile] as never);
    prismaMock.profile.count.mockResolvedValueOnce(1);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.profiles).toHaveLength(1);
    expect(json.total).toBe(1);
  });

  it("falls back to seed data on DB error", async () => {
    prismaMock.profile.findMany.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.profiles)).toBe(true);
  });

  it("respects pagination", async () => {
    prismaMock.profile.findMany.mockResolvedValueOnce([]);
    prismaMock.profile.count.mockResolvedValueOnce(0);

    const res = await GET(makeRequest("?page=2&limit=5"));
    const json = await res.json();
    expect(json.page).toBe(2);
    expect(json.limit).toBe(5);
  });
});
