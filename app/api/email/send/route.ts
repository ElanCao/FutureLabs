import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendBatchEmails } from '@/lib/email';
import { waitlistTemplates } from '@/templates/waitlist';

/**
 * POST /api/email/send
 * Send a single email or batch emails
 *
 * For single email:
 * {
 *   "to": "user@example.com",
 *   "template": "welcome",
 *   "data": { "firstName": "John" }
 * }
 *
 * For batch:
 * {
 *   "batch": [
 *     { "to": "user1@example.com", "template": "welcome", "data": { "firstName": "John" } },
 *     { "to": "user2@example.com", "template": "welcome", "data": { "firstName": "Jane" } }
 *   ]
 * }
 */

export async function POST(request: NextRequest) {
  // Verify API key is configured
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Handle batch sends
    if (body.batch && Array.isArray(body.batch)) {
      const emails = body.batch.map((item: any) => {
        const template = waitlistTemplates[item.template as keyof typeof waitlistTemplates];
        if (!template) {
          throw new Error(`Unknown template: ${item.template}`);
        }
        return {
          to: item.to,
          subject: template.subject,
          html: template.html(item.data || {}),
          text: template.text(item.data || {}),
        };
      });

      const results = await sendBatchEmails(emails);
      return NextResponse.json({ success: true, results });
    }

    // Handle single email
    const { to, template: templateName, data, subject, html, text } = body;

    // If using a template
    if (templateName) {
      const template = waitlistTemplates[templateName as keyof typeof waitlistTemplates];
      if (!template) {
        return NextResponse.json(
          { error: `Unknown template: ${templateName}` },
          { status: 400 }
        );
      }

      const result = await sendEmail({
        to,
        subject: template.subject,
        html: template.html(data || {}),
        text: template.text(data || {}),
      });

      return NextResponse.json(result);
    }

    // If sending custom email
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const result = await sendEmail({ to, subject, html, text });
    return NextResponse.json(result);

  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
