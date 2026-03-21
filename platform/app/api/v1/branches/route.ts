/**
 * GET /api/v1/branches — list all skill branches (machine-readable)
 * Returns all branches with their skills. Suitable for AI agent onboarding.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BRANCHES } from "@/lib/seed-data";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            maxLevel: true,
            tags: true,
            agentCompat: true,
            prerequisites: true,
            parentSkillId: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (branches.length === 0) {
      // Fall back to seed data if DB has no branches yet
      return NextResponse.json(
        BRANCHES.map((b) => ({ id: b.id, name: b.name, icon: b.icon, color: b.color, skills: [] })),
        { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60", "Access-Control-Allow-Origin": "*" } }
      );
    }

    return NextResponse.json(branches, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    // DB unavailable — fall back to seed branches
    return NextResponse.json(
      BRANCHES.map((b) => ({ id: b.id, name: b.name, icon: b.icon, color: b.color, skills: [] })),
      { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60", "Access-Control-Allow-Origin": "*" } }
    );
  }
}
