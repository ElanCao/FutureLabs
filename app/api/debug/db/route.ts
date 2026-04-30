import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.contactMessage.count();
    return NextResponse.json({ ok: true, count, dbUrl: process.env.DATABASE_URL ? "set" : "missing" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message, stack: error.stack?.split("\n").slice(0,3) }, { status: 500 });
  }
}
