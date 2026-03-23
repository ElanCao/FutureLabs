import { GET, POST } from "@/app/api/v1/profiles/[username]/endorsements/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
const getServerSessionMock = getServerSession as jest.Mock;

const params = { username: "alice" };

const endorserProfile = {
  id: "b-id",
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
  id: "a-id",
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

describe("GET /api/v1/profiles/:username/endorsements", () => {
  it("returns endorsements for user", async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.skillEndorsement.findMany.mockResolvedValueOnce([{
      id: "e1",
      skillId: "skill1",
      note: null,
      createdAt: new Date(),
      endorser: { username: "bob", displayName: "Bob", avatarEmoji: "🤖" },
      skill: { id: "skill1", name: "TypeScript", icon: "⚡" },
    }] as never);

    const req = new NextRequest("http://localhost/api/v1/profiles/alice/endorsements");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveLength(1);
    expect(json[0].skillId).toBe("skill1");
  });

  it("returns 404 for unknown user", async () => {
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/v1/profiles/unknown/endorsements");
    const res = await GET(req, { params: { username: "unknown" } });
    expect(res.status).toBe(404);
  });

  it("returns empty array on DB error", async () => {
    prismaMock.profile.findUnique.mockRejectedValueOnce(new Error("DB down"));

    const req = new NextRequest("http://localhost/api/v1/profiles/alice/endorsements");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });
});

describe("POST /api/v1/profiles/:username/endorsements", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ skillId: "skill1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 for self-endorsement", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce({ ...endorseeProfile, userId: "u1" } as never) // endorser
      .mockResolvedValueOnce({ ...endorseeProfile, userId: "u1" } as never); // endorsee same

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ skillId: "skill1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
  });

  it("returns 400 if user does not have the skill", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ skillId: "skill1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
  });

  it("creates endorsement and notification", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce({ id: "r1" } as never);
    prismaMock.skillEndorsement.create.mockResolvedValueOnce({
      id: "e1",
      skillId: "skill1",
      note: null,
      createdAt: new Date(),
      endorser: { username: "bob", displayName: "Bob" },
      skill: { name: "TypeScript", icon: "⚡" },
    } as never);
    prismaMock.notification.create.mockResolvedValueOnce({} as never);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ skillId: "skill1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(201);
    expect(prismaMock.notification.create).toHaveBeenCalled();
  });

  it("returns 409 for duplicate endorsement", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u2" } });
    prismaMock.profile.findUnique
      .mockResolvedValueOnce(endorserProfile as never)
      .mockResolvedValueOnce(endorseeProfile as never);
    prismaMock.userSkillRecord.findUnique.mockResolvedValueOnce({ id: "r1" } as never);
    const uniqueError = Object.assign(new Error("Unique constraint"), { code: "P2002" });
    prismaMock.skillEndorsement.create.mockRejectedValueOnce(uniqueError);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ skillId: "skill1" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(409);
  });
});
