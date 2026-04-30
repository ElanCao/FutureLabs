import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Build-time fallback: return a proxy that won't throw on import
    const dummyClient = {
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
      $on: () => {},
      $transaction: () => Promise.resolve([]),
      $queryRaw: () => Promise.resolve([]),
      $executeRaw: () => Promise.resolve(0),
      $extends: () => dummyClient,
      contactMessage: {
        findUnique: () => Promise.resolve(null),
        findFirst: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: () => Promise.resolve(null),
        createMany: () => Promise.resolve({ count: 0 }),
        update: () => Promise.resolve(null),
        updateMany: () => Promise.resolve({ count: 0 }),
        upsert: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
        deleteMany: () => Promise.resolve({ count: 0 }),
        count: () => Promise.resolve(0),
        aggregate: () => Promise.resolve(null),
        groupBy: () => Promise.resolve([]),
      },
    };
    return dummyClient as unknown as PrismaClient;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
