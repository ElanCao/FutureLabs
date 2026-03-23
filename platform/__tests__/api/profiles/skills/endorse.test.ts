import { POST, DELETE } from "@/app/api/v1/profiles/[username]/skills/[skillId]/endorse/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
const getServerSessionMock = getServerSession as jest.Mock;

const endorserProfile = {
  id: "endorser-id",
  username: "bob",
  displayName: "Bob",
  userId: "u2",
  avatarEmoji: "🤖",
  entityType: "human" as const,
  privacy: "public" as const,
  totalXp: 0,
  bio: "",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const endorseeProfile = {
  id: "endorsee-id",
  username: "alice",
  displayName: "Alice",
  userId: "u1",
  avatarEmoji: "🧑",
  entityType: "human" as const,
  privacy: "public" as const,
  totalXp: 0,
  bio: "",
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const params = { username: "alice", skillId: "skill1" };

function makePostReq(body = {}) {
  return new NextRequest("http://localhost/api/v1/profiles/alice/skills/skill1/endorse", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/v1/profiles/:username/skills/:skillId/endorse", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const res = await POST(makePostReq(), { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 for self-endorsement", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    // endorser and endorsee have same profile id
    prismaMock.profile.findUnique
      .mockResolvedValueOnce({ ...endorseeProfile, userId: "u1" } as never) // endorser lookup
      .mockResolvedValueOnce({ ...endorseeProfile, userId: "u1" } as never); // endorsee lookup

    const res = await POST(makePostReq(), { params });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/yourself/i);
  });

  it("returns 404 if endorsee skill not found", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce(null);

    const res = await POST(makePostReq(), { params });
    expect(res.status).toBe(404);
  });

  it("creates endorsement and returns 201", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce({ id: "r1" } as never);
    prismaMock.skillEndorsement.upsert.mockResolvedValueOnce({
      id: "e1",
      skillId: "skill1",
      note: null,
      createdAt: new Date(),
      endorser: { username: "bob", displayName: "Bob", avatarEmoji: "🤖" },
      skill: { name: "TypeScript", icon: "⚡" },
    } as never);
    prismaMock.notification.upsert.mockResolvedValueOnce({} as never);

    const res = await POST(makePostReq(), { params });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.skillId).toBe("skill1");
  });
});

describe("DELETE /api/v1/profiles/:username/skills/:skillId/endorse", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(401);
  });

  it("retracts endorsement", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.skillEndorsement.deleteMany.mockResolvedValueOnce({ count: 1 } as never);

    const req = new NextRequest("http://localhost/", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
