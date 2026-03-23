/**
 * POST /api/v1/auth/resend-otp — resend OTP, enforces 60s cooldown
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";

const COOLDOWN_MS = 60 * 1000;

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { email } = body as { email?: string };
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) return NextResponse.json({ error: "No account found for this email" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: "Email is already verified" }, { status: 409 });

  const existing = await prisma.emailOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const elapsed = Date.now() - existing.lastSentAt.getTime();
    if (elapsed < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      return NextResponse.json({ error: `Please wait ${waitSec}s before requesting a new code.`, waitSec }, { status: 429 });
    }
    await prisma.emailOtp.delete({ where: { id: existing.id } });
  }

  const otp = generateOtp();
  const codeHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.emailOtp.create({ data: { email: normalizedEmail, codeHash, expiresAt } });
  await sendOtpEmail(normalizedEmail, otp);

  return NextResponse.json({ success: true }, { status: 200 });
}
