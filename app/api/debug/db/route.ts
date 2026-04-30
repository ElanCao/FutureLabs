import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {
    env: {
      databaseUrl: process.env.DATABASE_URL ? "set" : "missing",
      resendKey: process.env.RESEND_API_KEY ? "set" : "missing",
      audienceId: process.env.RESEND_AUDIENCE_ID ? "set" : "missing",
    },
  };

  try {
    const { PrismaClient } = require("@prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const { Pool } = require("pg");

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    results.adapterType = typeof adapter;
    results.adapterName = adapter?.constructor?.name;
    results.clientType = typeof prisma;

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
