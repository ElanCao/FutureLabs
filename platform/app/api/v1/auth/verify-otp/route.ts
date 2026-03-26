/**
 * POST /api/v1/auth/verify-otp — verify email OTP, activate account
 * Max 3 attempts before cooldown. On success, triggers onboarding drip within 30 min.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeDrip } from "@/lib/email";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 3;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { email, code } = body as { email?: string; code?: string };
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();

  const record = await prisma.emailOtp.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return NextResponse.json({ error: "No verification code found. Please register again." }, { status: 404 });
  }

  if (record.expiresAt < new Date()) {
    await prisma.emailOtp.delete({ where: { id: record.id } });
    return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 410 });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please request a new verification code.", cooldown: true },
      { status: 429 }
    );
  }

  const valid = await bcrypt.compare(cleanCode, record.codeHash);

  if (!valid) {
    const remaining = MAX_ATTEMPTS - record.attempts - 1;
    await prisma.emailOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json(
      { error: `Invalid code. ${remaining > 0 ? `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "No attempts remaining. Please request a new code."}` },
      { status: 400 }
    );
  }

  // Valid — activate account
  await prisma.user.update({
    where: { email: normalizedEmail },
    data: { emailVerified: new Date() },
  });

  await prisma.emailOtp.delete({ where: { id: record.id } });

  // Trigger onboarding drip async (fire-and-forget, schedule 30 min delay via setTimeout best-effort)
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  setTimeout(() => {
    sendWelcomeDrip(normalizedEmail, user?.name).catch(() => {});
  }, 30 * 60 * 1000);

  return NextResponse.json({ success: true }, { status: 200 });
}
