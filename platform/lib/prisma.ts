import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a dummy Prisma client for build-time that won't throw on import
// but will throw if actually used for DB operations
function createDummyClient(): PrismaClient {
  // Return a proxy that looks like a PrismaClient but doesn't actually
  // instantiate one. This allows builds to succeed without DATABASE_URL.
  const dummyClient = {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $on: () => {},
    $transaction: () => Promise.resolve([]),
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve(0),
    $extends: () => dummyClient,
  };

  // Add model proxies
  const models = ['user', 'profile', 'skill', 'contactMessage', 'apiKey', 'session', 'account', 'notification', 'emailOtp', 'skillEndorsement', 'userSkillRecord', 'branch', 'evidenceRecord', 'verificationToken'];
  for (const model of models) {
    (dummyClient as Record<string, unknown>)[model] = {
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
    };
  }

  return dummyClient as unknown as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // During build time without DATABASE_URL, return a dummy client
    return createDummyClient();
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
