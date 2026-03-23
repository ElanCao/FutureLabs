import { GET } from "@/app/api/v1/skills/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

function makeRequest(qs = ""): NextRequest {
  return new NextRequest(`http://localhost/api/v1/skills${qs}`);
}

const mockSkill = {
  id: "skill1",
  name: "TypeScript",
  description: "TS lang",
  icon: "⚡",
  maxLevel: 5,
  tags: [],
  agentCompat: true,
  prerequisites: [],
  parentSkillId: null,
  levelsJson: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  branchId: "branch1",
  branch: { id: "branch1", name: "Engineering", icon: "🔧", color: "#000" },
};

describe("GET /api/v1/skills", () => {
  it("returns paginated skills from DB", async () => {
    prismaMock.skill.findMany.mockResolvedValueOnce([mockSkill] as never);
    prismaMock.skill.count.mockResolvedValueOnce(1);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.skills).toHaveLength(1);
    expect(json.total).toBe(1);
    expect(json.page).toBe(1);
  });

  it("falls back to seed data on DB error", async () => {
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.skills)).toBe(true);
  });

  it("respects pagination params", async () => {
    prismaMock.skill.findMany.mockResolvedValueOnce([] as never);
    prismaMock.skill.count.mockResolvedValueOnce(0);

    const res = await GET(makeRequest("?page=2&limit=10"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.page).toBe(2);
    expect(json.limit).toBe(10);
  });

  it("caps limit at 100", async () => {
    prismaMock.skill.findMany.mockResolvedValueOnce([] as never);
    prismaMock.skill.count.mockResolvedValueOnce(0);

    const res = await GET(makeRequest("?limit=500"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.limit).toBe(100);
  });

  it("filters by agentCompat", async () => {
    prismaMock.skill.findMany.mockResolvedValueOnce([mockSkill] as never);
    prismaMock.skill.count.mockResolvedValueOnce(1);

    const res = await GET(makeRequest("?agentCompat=true"));
    expect(res.status).toBe(200);
    // Verify the where clause included agentCompat filter
    expect(prismaMock.skill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ agentCompat: true }) })
    );
  });
});
