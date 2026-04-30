import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  return NextResponse.json({
    dbUrlLength: dbUrl.length,
    dbUrlPrefix: dbUrl.slice(0, 30),
    dbUrlHasPlaceholder: dbUrl.includes("placeholder"),
  });
}
