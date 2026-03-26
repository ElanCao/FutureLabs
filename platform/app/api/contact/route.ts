/**
 * POST /api/contact - Submit contact form
 * Rate limited: 5 submissions per hour per IP
 * Honeypot spam protection included
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Force dynamic to prevent static generation issues
export const dynamic = "force-dynamic";

// Lazy-load Resend to avoid build-time errors
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

// Simple in-memory rate limiter (reset every hour)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5; // 5 requests per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getRateLimitStatus(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // honeypot field
  _gotcha?: string; // alternative honeypot field name
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimit = getRateLimitStatus(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body: ContactFormData = await req.json();
    const { name, email, subject, message, website, _gotcha } = body;

    // Honeypot check - if these fields are filled, it's likely a bot
    if (website || _gotcha) {
      // Silently accept but don't process (don't tell bots they're detected)
      return NextResponse.json(
        { success: true, message: "Message received" },
        {
          status: 200,
          headers: {
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        }
      );
    }

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required (min 2 characters)" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message is required (min 10 characters)" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);
    const sanitizedSubject = subject?.trim().slice(0, 200) ?? null;
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Store in database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        source: "website",
        ipAddress: clientIp,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });

    // Send email notification (fire and forget - don't block response)
    const resend = getResend();
    if (resend && process.env.CONTACT_EMAIL_TO) {
      void resend.emails.send({
        from: process.env.CONTACT_EMAIL_FROM ?? "contact@futurelabs.io",
        to: process.env.CONTACT_EMAIL_TO,
        subject: `New contact form submission: ${sanitizedSubject ?? "No subject"}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${sanitizedName} (${sanitizedEmail})</p>
          <p><strong>Subject:</strong> ${sanitizedSubject ?? "No subject"}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin-left: 0;">
            ${sanitizedMessage.replace(/\n/g, "<br>")}
          </blockquote>
          <hr>
          <p style="color: #666; font-size: 12px;">
            IP: ${clientIp}<br>
            ID: ${contactMessage.id}
          </p>
        `,
        replyTo: sanitizedEmail,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: contactMessage.id,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
