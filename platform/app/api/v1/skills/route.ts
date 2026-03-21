/**
 * GET /api/v1/skills — list all skills (machine-readable, filterable)
 *
 * Query params:
 *   branch   — filter by branch id or name (case-insensitive)
 *   q        — full-text search on skill name / description
 *   agentCompat — "true" to return only agent-compatible skills
 *   page     — 1-based page number (default: 1)
 *   limit    — page size (default: 50, max: 100)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SKILLS } from "@/lib/seed-data";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const agentCompat = searchParams.get("agentCompat");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? String(PAGE_SIZE)));

  try {
    const where: Record<string, unknown> = {};

    if (branch) {
      where.branch = {
        OR: [
          { id: branch },
          { name: { equals: branch, mode: "insensitive" } },
        ],
      };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (agentCompat === "true") {
      where.agentCompat = true;
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ branch: { name: "asc" } }, { name: "asc" }],
        include: {
          branch: { select: { id: true, name: true, icon: true, color: true } },
        },
      }),
      prisma.skill.count({ where }),
    ]);

    return NextResponse.json(
      { skills, total, page, limit },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch {
    // DB unavailable — fall back to seed skills
    let filtered = SKILLS;
    if (branch) {
      filtered = filtered.filter((s) => s.branch === branch);
    }
    if (q) {
      const lq = q.toLowerCase();
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(lq));
    }
    const total = filtered.length;
    const paged = filtered.slice((page - 1) * limit, page * limit);
    return NextResponse.json(
      { skills: paged, total, page, limit },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
