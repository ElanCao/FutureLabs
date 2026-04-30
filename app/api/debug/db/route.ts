import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {
    env: {
      databaseUrl: process.env.DATABASE_URL ? "set" : "missing",
    },
  };

  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const factory = new PrismaPg(pool);
    results.factoryName = factory?.constructor?.name;
    results.factoryHasConnect = typeof factory.connect === "function";

    const connectedAdapter = await factory.connect();
    results.adapterName = connectedAdapter?.constructor?.name;
    results.adapterHasQueryRaw = typeof connectedAdapter.queryRaw === "function";

    const prisma = new PrismaClient({ adapter: connectedAdapter });
    const count = await prisma.contactMessage.count();
    results.count = count;
    results.ok = true;
  } catch (error: any) {
    results.ok = false;
    results.error = error.message;
    results.stack = error.stack?.split("\n").slice(0, 5);
  }

  return NextResponse.json(results);
}
