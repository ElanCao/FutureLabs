import { GET, POST, DELETE } from "@/app/api/v1/profiles/[username]/api-keys/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
const getServerSessionMock = getServerSession as jest.Mock;

const params = { username: "alice" };

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

describe("GET /api/v1/profiles/:username/api-keys", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/");
    const res = await GET(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns key metadata (never raw key)", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.apiKey.findMany.mockResolvedValueOnce([{
      id: "k1",
      name: "My Key",
      keyPrefix: "sk_abc123",
      lastUsedAt: null,
      expiresAt: null,
      createdAt: new Date(),
    }] as never);

    const req = new NextRequest("http://localhost/");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json[0]).not.toHaveProperty("keyHash");
    expect(json[0]).toHaveProperty("keyPrefix");
  });
});

describe("POST /api/v1/profiles/:username/api-keys", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ name: "My Key" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 without key name", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
  });

  it("returns 400 when at 10-key limit", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.apiKey.count.mockResolvedValueOnce(10);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ name: "Key 11" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/10/);
  });

  it("creates key and returns raw key once", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.apiKey.count.mockResolvedValueOnce(0);
    prismaMock.apiKey.create.mockResolvedValueOnce({
      id: "k1",
      name: "My Key",
      keyPrefix: "sk_abc123",
      createdAt: new Date(),
    } as never);

    const req = new NextRequest("http://localhost/", {
      method: "POST",
      body: JSON.stringify({ name: "My Key" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.key).toMatch(/^sk_/);
  });
});

describe("DELETE /api/v1/profiles/:username/api-keys", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const req = new NextRequest("http://localhost/?id=k1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 400 without id param", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);

    const req = new NextRequest("http://localhost/", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(400);
  });

  it("revokes key and returns ok", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.apiKey.deleteMany.mockResolvedValueOnce({ count: 1 } as never);

    const req = new NextRequest("http://localhost/?id=k1", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
