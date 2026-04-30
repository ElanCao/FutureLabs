import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = { version: 3 };

  const dbUrl = process.env.DATABASE_URL || "";
  results.dbUrlLength = dbUrl.length;
  results.dbUrlPrefix = dbUrl.slice(0, 30);
  results.dbUrlHasPlaceholder = dbUrl.includes("placeholder");

  // Test pg with explicit connection string
  try {
    const pg = require("pg");
    const pool = new pg.Pool({ connectionString: dbUrl });
    const res = await pool.query("SELECT 1 as one");
    results.pgQueryOk = true;
    results.pgQueryResult = res.rows[0];
    await pool.end();
  } catch (e: any) {
    results.pgQueryOk = false;
    results.pgQueryError = e.message;
    results.pgQueryCode = e.code;
  }

  return NextResponse.json(results);
}
