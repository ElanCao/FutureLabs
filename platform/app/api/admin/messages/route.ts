/**
 * GET /api/admin/messages - List contact messages (admin only)
 * Query params:
 *   - status: filter by status (UNREAD, READ, REPLIED, ARCHIVED, SPAM)
 *   - search: search in name, email, subject, message
 *   - page: page number (default 1)
 *   - limit: items per page (default 20, max 100)
 *   - sortBy: createdAt | updatedAt (default createdAt)
 *   - sortOrder: asc | desc (default desc)
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Check admin auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Parse query params
    const status = searchParams.get("status") as ContactStatus | null;
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20")));
    const sortBy = searchParams.get("sortBy") === "updatedAt" ? "updatedAt" : "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Build where clause
    const where: {
      status?: ContactStatus;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        subject?: { contains: string; mode: "insensitive" };
        message?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (status && Object.values(ContactStatus).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.contactMessage.count({ where });

    // Get messages
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        status: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        repliedAt: true,
        repliedBy: true,
        notes: true,
        // Exclude ipAddress and userAgent from list view for privacy
      },
    });

    // Get counts by status
    const statusCounts = await prisma.contactMessage.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const counts = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        ...counts,
        total,
      },
    });
  } catch (error) {
    console.error("Admin messages list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
