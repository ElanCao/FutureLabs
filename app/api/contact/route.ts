import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const CONTACT_TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL || "hello@futurelabs.vip";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website, utm } = body;

    // Honeypot check - if website field is filled, it's likely spam
    if (website && website.length > 0) {
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    // Extract UTM params
    const utmSource = utm?.source || "direct";
    const utmMedium = utm?.medium || "";
    const utmCampaign = utm?.campaign || "";
    const utmContent = utm?.content || "";

    const utmLines = [
      utmSource && `utm_source: ${utmSource}`,
      utmMedium && `utm_medium: ${utmMedium}`,
      utmCampaign && `utm_campaign: ${utmCampaign}`,
      utmContent && `utm_content: ${utmContent}`,
    ].filter(Boolean);

    const utmHtml = utmLines.length > 0
      ? `<p><strong>UTM:</strong></p><p>${utmLines.map(l => escapeHtml(l)).join("<br/>")}</p>`
      : "";

    const utmText = utmLines.length > 0
      ? `\nUTM Attribution:\n${utmLines.join("\n")}`
      : "";

    // Send internal notification email
    const emailResult = await sendEmail({
      to: CONTACT_TO_EMAIL,
      subject: subject
        ? `[SkillTree Contact] ${subject} — from ${name}`
        : `[SkillTree Contact] Message from ${name}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(subject || "Not specified")}</p>
<hr/>
<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
${utmHtml}
<p><em>Submitted at ${new Date().toISOString()}</em></p>`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "Not specified"}\n\n${message}${utmText}\n\nSubmitted at ${new Date().toISOString()}`,
      replyTo: email,
      tags: [
        { name: "source", value: "contact_form" },
        { name: "utm_source", value: utmSource },
        { name: "utm_medium", value: utmMedium },
        { name: "utm_campaign", value: utmCampaign },
      ],
    });

    if (!emailResult.success) {
      console.error("Contact form email failed:", emailResult.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // If early access request, send welcome email to user
    if (subject === "Early access request") {
      try {
        await sendEmail({
          to: email,
          subject: "You're on the SkillTree early access list",
          html: `<p>Hi ${escapeHtml(name)},</p>
<p>Thanks for your interest in SkillTree! You're on our early access list and we'll reach out as soon as spots open up.</p>
<p>In the meantime, you can create your profile at <a href="https://platform.futurelabs.vip">platform.futurelabs.vip</a>.</p>
<p>— The FutureLabs Team</p>`,
          text: `Hi ${name},\n\nThanks for your interest in SkillTree! You're on our early access list and we'll reach out as soon as spots open up.\n\nIn the meantime, you can create your profile at https://platform.futurelabs.vip.\n\n— The FutureLabs Team`,
          tags: [
            { name: "email_type", value: "welcome" },
            { name: "utm_source", value: utmSource },
          ],
        });
      } catch (welcomeError) {
        // Don't fail the submission if welcome email fails
        console.error("Failed to send welcome email:", welcomeError);
      }
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully! We'll get back to you soon." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
