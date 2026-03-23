import { GET, PATCH } from "@/app/api/v1/notifications/route";
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

describe("GET /api/v1/notifications", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns notifications for authenticated user", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.notification.findMany.mockResolvedValueOnce([{
      id: "n1",
      profileId: "p1",
      type: "endorsement",
      referenceId: "e1",
      message: "Bob endorsed you",
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }] as never);

    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveLength(1);
  });

  it("returns empty array if no profile", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(null);

    const res = await GET();
    const json = await res.json();
    expect(json).toEqual([]);
  });
});

describe("PATCH /api/v1/notifications", () => {
  it("returns 401 without auth", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const res = await PATCH();
    expect(res.status).toBe(401);
  });

  it("marks all notifications as read", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { id: "u1" } });
    prismaMock.profile.findUnique.mockResolvedValueOnce(mockProfile as never);
    prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 3 } as never);

    const res = await PATCH();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });
});
