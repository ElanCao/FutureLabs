/**
 * GET  /api/v1/notifications  — Get notifications for the authenticated user's profile.
 *   Query params: ?unread=true to filter to unread only, ?limit=20
 *
 * PATCH /api/v1/notifications  — Mark notifications as read.
 *   Body: { ids: string[] } or { all: true }
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const limit = Math.min(50, Number(searchParams.get("limit") ?? "20"));

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return NextResponse.json({ notifications: [], unreadCount: 0 });

    const where = {
      profileId: profile.id,
      ...(unreadOnly ? { read: false } : {}),
    };

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { profileId: profile.id, read: false } }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error("GET notifications error:", err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await req.json();

    if (body.all === true) {
      await prisma.notification.updateMany({
        where: { profileId: profile.id, read: false },
        data: { read: true },
      });
    } else if (Array.isArray(body.ids) && body.ids.length > 0) {
      await prisma.notification.updateMany({
        where: { profileId: profile.id, id: { in: body.ids } },
        data: { read: true },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH notifications error:", err);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
