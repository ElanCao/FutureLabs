import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="background:#0a0a0f;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;padding:0 20px;">
    <tr>
      <td>
        <div style="background:#111118;border:1px solid #2d2d3d;border-radius:16px;padding:40px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:32px;">🌳</span>
            <h1 style="color:#a78bfa;font-size:20px;font-weight:700;margin:12px 0 0;">SkillTree</h1>
          </div>

          <h2 style="color:#ffffff;font-size:22px;font-weight:600;text-align:center;margin:0 0 8px;">
            Verify your email
          </h2>
          <p style="color:#9ca3af;font-size:15px;text-align:center;margin:0 0 32px;line-height:1.6;">
            Your AI-era skills passport is almost ready.
          </p>

          <div style="background:#1e1e2e;border:1px solid #3b3b5c;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
            <p style="color:#9ca3af;font-size:13px;margin:0 0 12px;letter-spacing:0.05em;text-transform:uppercase;">Your verification code</p>
            <div style="font-size:40px;font-weight:700;letter-spacing:0.3em;color:#a78bfa;font-family:monospace;">
              ${otp}
            </div>
            <p style="color:#6b7280;font-size:12px;margin:12px 0 0;">Expires in 10 minutes</p>
          </div>

          <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;line-height:1.6;">
            If you didn&apos;t create a SkillTree account, you can safely ignore this email.
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  if (!resend) {
    // Dev fallback: log to console
    console.log(`[OTP EMAIL] To: ${email} | Code: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: "SkillTree <noreply@futurelabs.vip>",
    to: email,
    subject: "Your SkillTree verification code",
    html,
  });
}

export async function sendWelcomeDrip(email: string, name?: string | null): Promise<void> {
  if (!resend) {
    console.log(`[DRIP EMAIL] To: ${email} | Welcome drip triggered`);
    return;
  }

  const displayName = name ? name.split(" ")[0] : "there";

  await resend.emails.send({
    from: "SkillTree <noreply@futurelabs.vip>",
    to: email,
    subject: "Welcome to SkillTree — let's build your skills passport",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0a0a0f;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;padding:0 20px;">
    <tr>
      <td>
        <div style="background:#111118;border:1px solid #2d2d3d;border-radius:16px;padding:40px;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:32px;">🌳</span>
            <h1 style="color:#a78bfa;font-size:20px;font-weight:700;margin:12px 0 0;">SkillTree</h1>
          </div>
          <h2 style="color:#ffffff;font-size:20px;font-weight:600;margin:0 0 16px;">Hey ${displayName} 👋</h2>
          <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Your skills passport is live. SkillTree helps you map, prove, and share the skills that define your AI-era career.
          </p>
          <p style="color:#9ca3af;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Get started by completing your onboarding and claiming your first skill node.
          </p>
          <div style="text-align:center;">
            <a href="https://futurelabs.vip/onboarding" style="background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 32px;border-radius:10px;display:inline-block;font-size:15px;">
              Build my skill tree →
            </a>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
