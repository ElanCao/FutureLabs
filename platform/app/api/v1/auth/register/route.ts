/**
 * POST /api/v1/auth/register — create a new user account, send OTP for email verification
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { email, password, name } = body as { email?: string; password?: string; name?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      if (existing.emailVerified) {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
      }
      // Account exists but unverified — resend OTP
      const otp = generateOtp();
      const codeHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.emailOtp.deleteMany({ where: { email: normalizedEmail } });
      await prisma.emailOtp.create({ data: { id: crypto.randomUUID(), email: normalizedEmail, codeHash, expiresAt } });
      await sendOtpEmail(normalizedEmail, otp);

      return NextResponse.json({ requiresVerification: true, email: normalizedEmail }, { status: 200 });
    }

    const hash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        name: name?.trim() || null,
        password: hash,
        updatedAt: new Date(),
        // emailVerified intentionally null until OTP confirmed
      },
    });

    const otp = generateOtp();
    const codeHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailOtp.create({ data: { id: crypto.randomUUID(), email: normalizedEmail, codeHash, expiresAt } });
    await sendOtpEmail(normalizedEmail, otp);

    return NextResponse.json({ requiresVerification: true, email: normalizedEmail }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
