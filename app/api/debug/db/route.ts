import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {
    env: {
      databaseUrl: process.env.DATABASE_URL ? "set" : "missing",
    },
  };

  // Test 1: Direct pg connection
  try {
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const pgResult = await pool.query("SELECT COUNT(*) as count FROM \"ContactMessage\"");
    results.pgOk = true;
    results.pgCount = parseInt(pgResult.rows[0].count);
    await pool.end();
  } catch (error: any) {
    results.pgOk = false;
    results.pgError = error.message;
  }

  // Test 2: PrismaPg factory connect
  try {
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const factory = new PrismaPg(pool);
    const connected = await factory.connect();
    results.factoryConnectOk = true;
    results.connectedAdapterName = connected?.constructor?.name;
  } catch (error: any) {
    results.factoryConnectOk = false;
    results.factoryConnectError = error.message;
  }

  // Test 3: PrismaClient with factory
  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
    const count = await prisma.contactMessage.count();
    results.prismaOk = true;
    results.prismaCount = count;
  } catch (error: any) {
    results.prismaOk = false;
    results.prismaError = error.message;
  }

  return NextResponse.json(results);
}
