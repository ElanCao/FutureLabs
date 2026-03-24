/**
 * GET    /api/admin/messages/[id] - Get single message details
 * PATCH  /api/admin/messages/[id] - Update message status/notes
 * DELETE /api/admin/messages/[id] - Delete message
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { ContactStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single message
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Admin message get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  }
}

// PATCH - Update message status/notes
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, repliedBy } = body;

    // Validate status if provided
    if (status && !Object.values(ContactStatus).includes(status as ContactStatus)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: {
      status?: ContactStatus;
      notes?: string;
      repliedBy?: string;
      repliedAt?: Date;
    } = {};

    if (status) updateData.status = status as ContactStatus;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (repliedBy !== undefined) updateData.repliedBy = repliedBy?.trim() || null;

    // Set repliedAt if marking as replied
    if (status === ContactStatus.REPLIED) {
      updateData.repliedAt = new Date();
      if (!updateData.repliedBy && session.user.email) {
        updateData.repliedBy = session.user.email;
      }
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Admin message update error:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin message delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
