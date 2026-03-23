import { PUT, DELETE } from "@/app/api/v1/profiles/[username]/skills/[skillId]/route";
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
  userId: "u1",
  displayName: "Alice",
  bio: "",
  avatarEmoji: "🧑",
  entityType: "human" as const,
  privacy: "public" as const,
  totalXp: 0,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSkill = {
  id: "skill1",
  name: "TypeScript",
  description: "",
  icon: "⚡",
  maxLevel: 5,
  tags: [],
  agentCompat: true,
  prerequisites: [],
  parentSkillId: null,
  branchId: "b1",
  levelsJson: [
    { level: 1, xpRequired: 0, title: "Beginner", description: "" },
    { level: 2, xpRequired: 100, title: "Intermediate", description: "" },
    { level: 3, xpRequired: 250, title: "Advanced", description: "" },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makePutReq(body: unknown) {
  return new NextRequest("http://localhost/api/v1/profiles/alice/skills/skill1", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const params = { username: "alice", skillId: "skill1" };

describe("PUT /api/v1/profiles/:username/skills/:skillId", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const res = await PUT(makePutReq({}), { params });
    expect(res.status).toBe(401);
  });

  it("creates a new skill record", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce(null);
    prismaMock.userSkillRecord.upsert.mockResolvedValueOnce({
      id: "r1",
      profileId: "p1",
      skillId: "skill1",
      currentLevel: 1,
      xp: 50,
      unlockedAt: new Date(),
      lastLeveledAt: new Date(),
      evidence: [],
    } as never);
    prismaMock.evidenceRecord.deleteMany.mockResolvedValueOnce({ count: 0 } as never);
    prismaMock.userSkillRecord.aggregate.mockResolvedValueOnce({ _sum: { xp: 50 } } as never);
    prismaMock.profile.update.mockResolvedValueOnce({ ...mockProfile, totalXp: 50 } as never);

    const res = await PUT(makePutReq({ currentLevel: 1, evidence: [] }), { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.skillId).toBe("skill1");
    expect(json.xp).toBe(50);
  });

  it("returns 404 if skill not found", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const res = await PUT(makePutReq({}), { params });
    expect(res.status).toBe(404);
  });

  it("caps level at maxLevel", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce(null);
    prismaMock.userSkillRecord.upsert.mockResolvedValueOnce({
      id: "r1", profileId: "p1", skillId: "skill1", currentLevel: 5, xp: 300,
      unlockedAt: new Date(), lastLeveledAt: new Date(), evidence: [],
    } as never);
    prismaMock.evidenceRecord.deleteMany.mockResolvedValueOnce({ count: 0 } as never);
    prismaMock.userSkillRecord.aggregate.mockResolvedValueOnce({ _sum: { xp: 300 } } as never);
    prismaMock.profile.update.mockResolvedValueOnce({ ...mockProfile, totalXp: 300 } as never);

    // Requesting level 99 should be capped at maxLevel (5)
    const res = await PUT(makePutReq({ currentLevel: 99, evidence: [] }), { params });
    expect(res.status).toBe(200);
    // upsert should have been called with clampedLevel <= 5
    const upsertCall = prismaMock.userSkillRecord.upsert.mock.calls[0][0];
    expect(upsertCall.create.currentLevel).toBeLessThanOrEqual(5);
  });
});

describe("DELETE /api/v1/profiles/:username/skills/:skillId", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/api/v1/profiles/alice/skills/skill1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(401);
  });

  it("deletes skill and recalculates XP", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.userSkillRecord.deleteMany.mockResolvedValueOnce({ count: 1 } as never);
    prismaMock.userSkillRecord.aggregate.mockResolvedValueOnce({ _sum: { xp: 0 } } as never);
    prismaMock.profile.update.mockResolvedValueOnce({ ...mockProfile, totalXp: 0 } as never);

    const req = new NextRequest("http://localhost/api/v1/profiles/alice/skills/skill1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
