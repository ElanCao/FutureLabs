import { GET } from "@/app/api/v1/branches/route";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

const mockBranch = {
  id: "b1",
  name: "Engineering",
  icon: "🔧",
  color: "#3b82f6",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  skills: [],
};

describe("GET /api/v1/branches", () => {
  it("returns branches with skills from DB", async () => {
    prismaMock.branch.findMany.mockResolvedValueOnce([mockBranch] as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0].name).toBe("Engineering");
  });

  it("falls back to seed data when DB returns empty", async () => {
    prismaMock.branch.findMany.mockResolvedValueOnce([]);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });

  it("falls back to seed data on DB error", async () => {
    prismaMock.branch.findMany.mockRejectedValueOnce(new Error("DB down"));

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
  });
});
