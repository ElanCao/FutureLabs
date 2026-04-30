import { NextRequest, NextResponse } from "next/server";
import { sendEmail, addContactToAudience } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { welcomeEmail } from "@/templates/waitlist";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, website, utm, page } = body;

    // Honeypot check
    if (website && website.length > 0) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase().slice(0, 255);
    const utmSource = utm?.source || "direct";
    const utmMedium = utm?.medium || "";
    const utmCampaign = utm?.campaign || "";
    const utmContent = utm?.content || "";

    // Persist to database
    let contactMessage;
    try {
      contactMessage = await prisma.contactMessage.create({
        data: {
          name: "Waitlist",
          email: cleanEmail,
          subject: "Waitlist signup",
          message: `Joined the SkillTree waitlist via ${page || "homepage"}`,
          source: "waitlist",
          ipAddress:
            request.headers
              .get("x-forwarded-for")
              ?.split(",")[0]
              ?.trim() ||
            request.headers.get("x-real-ip") ||
            null,
          userAgent:
            request.headers.get("user-agent")?.slice(0, 500) || null,
        },
      });
    } catch (dbError) {
      console.error("Failed to persist waitlist signup:", dbError);
    }

    // Add to Resend audience (best-effort)
    void addContactToAudience({
      email: cleanEmail,
      firstName: "Waitlist",
    }).catch((err) => {
      console.error("Resend audience add failed:", err);
    });

    // Send welcome email
    try {
      await sendEmail({
        to: cleanEmail,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html({ firstName: "there" }),
        text: welcomeEmail.text({ firstName: "there" }),
        tags: [
          { name: "email_type", value: "welcome" },
          { name: "source", value: "waitlist" },
          { name: "utm_source", value: utmSource },
          { name: "utm_medium", value: utmMedium },
          { name: "utm_campaign", value: utmCampaign },
        ],
      });
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "You're on the list! Check your inbox for a welcome email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
