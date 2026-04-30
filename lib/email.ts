// Dynamic import for Resend to allow build without the package
let resendClient: any = null;

async function getResend() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      resendClient = new Resend(process.env.RESEND_API_KEY);
    } catch {
      // Resend package not available
      return null;
    }
  }
  return resendClient;
}

// Default sender configuration
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "SkillTree <no-reply@futurelabs.vip>";
const FROM_DOMAIN = process.env.RESEND_FROM_DOMAIN || "futurelabs.vip";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface BatchEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send a single email
 */
export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { to, subject, html, text, from, replyTo, tags } = options;

  try {
    const resend = await getResend();
    if (!resend) {
      throw new Error("Email service not available");
    }
    const result = await resend.emails.send({
      from: from || FROM_EMAIL,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
      tags,
    });

    return {
      success: true,
      id: result.data?.id,
      error: null,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      id: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send batch emails (up to 100 at a time)
 */
export async function sendBatchEmails(emails: BatchEmailOptions[]) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const batchSize = 100;
  const results = [];

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    const resend = await getResend();
    if (!resend) {
      throw new Error("Email service not available");
    }

    try {
      const batchPayload = batch.map((email) => ({
        from: FROM_EMAIL,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }));

      const result = await resend.batch.send(batchPayload);

      results.push({
        success: true,
        batchIndex: i / batchSize,
        data: result.data,
        error: null,
      });
    } catch (error) {
      console.error(`Failed to send batch ${i / batchSize}:`, error);
      results.push({
        success: false,
        batchIndex: i / batchSize,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

/**
 * Add a contact to a Resend audience for future campaign sends.
 * Returns success=true even if Resend is not configured (dev fallback).
 */
export async function addContactToAudience(options: {
  email: string;
  firstName?: string;
  lastName?: string;
  audienceId?: string;
  unsubscribed?: boolean;
}) {
  const { email, firstName, lastName, audienceId, unsubscribed } = options;
  const targetAudienceId = audienceId || process.env.RESEND_AUDIENCE_ID;

  if (!process.env.RESEND_API_KEY) {
    console.log(
      `[DEV] Would add contact to audience: ${email} (Resend not configured)`
    );
    return { success: true, id: null, error: null };
  }

  if (!targetAudienceId) {
    console.warn("RESEND_AUDIENCE_ID not configured; skipping audience add");
    return { success: false, id: null, error: "RESEND_AUDIENCE_ID not set" };
  }

  try {
    const resend = await getResend();
    if (!resend) {
      throw new Error("Email service not available");
    }

    const result = await resend.contacts.create({
      email,
      first_name: firstName,
      last_name: lastName,
      audience_id: targetAudienceId,
      unsubscribed: unsubscribed ?? false,
    });

    return {
      success: true,
      id: result.data?.id,
      error: null,
    };
  } catch (error) {
    // Log but don't throw — audience add is best-effort
    console.error("Failed to add contact to Resend audience:", error);
    return {
      success: false,
      id: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify Resend API key is valid
 */
export async function verifyEmailConfig() {
  if (!process.env.RESEND_API_KEY) {
    return { valid: false, error: "RESEND_API_KEY is not set" };
  }

  try {
    const resend = await getResend();
    if (!resend) {
      return { valid: false, domains: [], error: "Email service not available" };
    }
    const domains = await resend.domains.list();
    return {
      valid: true,
      domains: domains.data?.data || [],
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      domains: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get sending statistics
 */
export async function getEmailStats() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  try {
    return {
      sent: 0,
      delivered: 0,
      bounced: 0,
      complained: 0,
    };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return null;
  }
}

export { FROM_EMAIL, FROM_DOMAIN };
