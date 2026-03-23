import { mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

// Mock prisma globally
jest.mock("@/lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

// Mock next-auth session
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

// Mock email service
jest.mock("@/lib/email", () => ({
  sendOtpEmail: jest.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";

beforeEach(() => {
  mockReset(prisma as unknown as ReturnType<typeof mockDeep<PrismaClient>>);
});
