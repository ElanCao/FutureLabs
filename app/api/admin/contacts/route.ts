/**
 * GET /api/admin/contacts - List contact form submissions (admin only)
 * Query params:
 *   - page: page number (default 1)
 *   - limit: items per page (default 50, max 200)
 *   - search: search in name, email, subject, message
 *   - sortBy: createdAt | updatedAt (default createdAt)
 *   - sortOrder: asc | desc (default desc)
 *   - format: json | csv (default json)
 *
 * Auth: Bearer token matching ADMIN_API_KEY env var
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) return false;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === apiKey;
}

function escapeCsvField(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(200, Math.max(1, Number(searchParams.get("limit") ?? "50")));
    const search = searchParams.get("search")?.trim();
    const sortBy = searchParams.get("sortBy") === "updatedAt" ? "updatedAt" : "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const format = searchParams.get("format") === "csv" ? "csv" : "json";

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        subject?: { contains: string; mode: "insensitive" };
        message?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.contactMessage.count({ where });

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (format === "csv") {
      const headers = ["ID", "Name", "Email", "Subject", "Message", "Status", "Source", "Created At", "Updated At"];
      const rows = messages.map((m) =>
        [
          m.id,
          m.name,
          m.email,
          m.subject ?? "",
          m.message,
          m.status,
          m.source,
          m.createdAt.toISOString(),
          m.updatedAt.toISOString(),
        ]
          .map(escapeCsvField)
          .join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="contacts-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin contacts list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
