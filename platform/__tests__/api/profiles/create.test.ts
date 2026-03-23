import { POST } from "@/app/api/v1/profiles/route";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;
const getServerSessionMock = getServerSession as jest.Mock;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/v1/profiles", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/v1/profiles", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ username: "alice" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid username format", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1", email: "a@a.com" } });

    const res = await POST(makeRequest({ username: "AB" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/username/i);
  });

  it("returns 400 for too-short username", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1", email: "a@a.com" } });

    const res = await POST(makeRequest({ username: "ab" }));
    expect(res.status).toBe(400);
  });

  it("returns 409 for duplicate username", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1", email: "a@a.com" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce({ id: "p1" } as never);

    const res = await POST(makeRequest({ username: "alice" }));
    expect(res.status).toBe(409);
  });

  it("creates profile and returns 201", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1", email: "a@a.com" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);
    prismaMock.profile.create.mockResolvedValueOnce({
      id: "p1",
      username: "alice",
      displayName: "alice",
      bio: "",
      avatarEmoji: "🧑",
      entityType: "human",
      privacy: "public",
      totalXp: 0,
      userId: "u1",
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const res = await POST(makeRequest({ username: "alice" }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.username).toBe("alice");
    expect(json.skills).toEqual([]);
  });
});
