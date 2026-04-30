import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {};

  // Test 1: Check pg import
  try {
    const pg = require("pg");
    results.pgType = typeof pg;
    results.pgKeys = Object.keys(pg).slice(0, 10);
    results.poolType = typeof pg.Pool;
    results.poolIsFunction = typeof pg.Pool === "function";
  } catch (e: any) {
    results.pgError = e.message;
  }

  // Test 2: Direct pg query
  try {
    const pg = require("pg");
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const res = await pool.query("SELECT 1 as one");
    results.pgQueryOk = true;
    results.pgQueryResult = res.rows[0];
    await pool.end();
  } catch (e: any) {
    results.pgQueryOk = false;
    results.pgQueryError = e.message;
  }

  // Test 3: PrismaPg factory
  try {
    const pg = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const factory = new PrismaPg(pool);
    results.factoryType = typeof factory;
    results.factoryConnectType = typeof factory.connect;
    const connected = await factory.connect();
    results.factoryConnectOk = true;
    results.connectedType = typeof connected;
    results.connectedQueryRawType = typeof connected.queryRaw;
  } catch (e: any) {
    results.factoryConnectOk = false;
    results.factoryError = e.message;
  }

  // Test 4: PrismaClient with factory
  try {
    const pg = require("pg");
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
    const count = await prisma.contactMessage.count();
    results.prismaOk = true;
    results.prismaCount = count;
  } catch (e: any) {
    results.prismaOk = false;
    results.prismaError = e.message;
  }

  return NextResponse.json(results);
}
