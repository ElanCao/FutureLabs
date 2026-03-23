import { POST } from "@/app/api/v1/auth/register/route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const prismaMock = prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>;

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/v1/auth/register", () => {
  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ email: "notanemail", password: "password123" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/email/i);
  });

  it("returns 400 for missing email", async () => {
    const res = await POST(makeRequest({ password: "password123" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for short password", async () => {
    const res = await POST(makeRequest({ email: "test@example.com", password: "short" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/8 characters/i);
  });

  it("returns 400 for missing password", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 for already-verified duplicate email", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: "user1",
      email: "test@example.com",
      emailVerified: new Date(),
      name: null,
      image: null,
      password: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const res = await POST(makeRequest({ email: "test@example.com", password: "password123" }));
    expect(res.status).toBe(409);
  });

  it("returns 201 for valid new registration", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValueOnce({
      id: "user1",
      email: "new@example.com",
      emailVerified: null,
      name: null,
      image: null,
      password: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMock.emailOtp.create.mockResolvedValueOnce({
      id: "otp1",
      email: "new@example.com",
      codeHash: "hash",
      expiresAt: new Date(),
      createdAt: new Date(),
    } as ReturnType<typeof prismaMock.emailOtp.create> extends Promise<infer T> ? T : never);

    const res = await POST(makeRequest({ email: "new@example.com", password: "password123", name: "Alice" }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.requiresVerification).toBe(true);
    expect(json.email).toBe("new@example.com");
  });
});
