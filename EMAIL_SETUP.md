# Email Setup — Resend Integration

This document outlines the Resend email infrastructure for SkillTree.

## Quick Start

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Use your FutureLabs email for the account
3. Start on the **Free tier** (3,000 emails/month)

### 2. Add and Verify Domain

1. In Resend Dashboard → Domains → Add Domain
2. Enter: `mail.futurelabs.ai` (recommended subdomain)
3. Add the DNS records to your domain registrar:
   - Type: `MX`, `TXT` (SPF), `TXT` (DKIM), `CNAME` (DMARC)
4. Wait for verification (usually instant, up to 24 hours)

### 3. Create API Key

1. Resend Dashboard → API Keys → Create API Key
2. Name: `SkillTree Production`
3. Permissions: `Sending access`
4. Copy the key (starts with `re_`)

### 4. Configure Environment Variables

```bash
# Add to .env.local (never commit this file)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_DOMAIN=mail.futurelabs.ai
RESEND_FROM_EMAIL=SkillTree <hello@mail.futurelabs.ai>
```

### 5. Install Dependencies

```bash
cd skill-tree
npm install
```

### 6. Test the Setup

```bash
# Run the test script (create one if needed)
npm run test:email
```

## Email Templates

Located in `templates/waitlist.ts`:

| Template | Purpose | When to Send |
|----------|---------|--------------|
| `welcome` | New waitlist signup | Immediate on signup |
| `launchAnnouncement` | Product Hunt launch | 00:01 PT launch day |
| `finalHoursPush` | Final voting push | 15:00 PT launch day |
| `thankYouNextSteps` | Post-launch thank you | Day 2, 09:00 PT |

## API Usage

### Send Single Email

```typescript
import { sendEmail } from '@/lib/email';
import { waitlistTemplates } from '@/templates/waitlist';

const result = await sendEmail({
  to: 'user@example.com',
  subject: waitlistTemplates.welcome.subject,
  html: waitlistTemplates.welcome.html({ firstName: 'John' }),
  text: waitlistTemplates.welcome.text({ firstName: 'John' }),
});
```

### Send via API Route

```bash
# Single email
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "template": "welcome",
    "data": { "firstName": "John" }
  }'

# Batch emails
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "batch": [
      { "to": "user1@example.com", "template": "welcome", "data": { "firstName": "John" } },
      { "to": "user2@example.com", "template": "welcome", "data": { "firstName": "Jane" } }
    ]
  }'
```

## Free Tier Limits

- **3,000 emails/month** — sufficient for launch
- No credit card required
- Upgrade when approaching limit

## Monitoring

Check Resend Dashboard for:
- Delivery rates
- Bounce rates
- Spam complaints
- Open/click rates (if enabled)

## DNS Records Reference

Once you add a domain in Resend, you'll get specific DNS records. Typical setup:

| Type | Host | Value |
|------|------|-------|
| MX | mail.futurelabs.ai | 10 feedback-smtp.us-east-1.amazonses.com |
| TXT | mail.futurelabs.ai | v=spf1 include:amazonses.com ~all |
| TXT | _dmarc.mail.futurelabs.ai | v=DMARC1; p=quarantine; rua=mailto:dmarc@futurelabs.ai |
| CNAME | [resend-provided] | [resend-provided] |

## Next Steps

- [ ] Create Resend account
- [ ] Add domain and verify DNS
- [ ] Create API key
- [ ] Add env vars to production
- [ ] Test send from staging
- [ ] Import waitlist contacts
- [ ] Schedule launch day emails

## Support

- Resend Docs: https://resend.com/docs
- DNS troubleshooting: Check Resend dashboard for record validation
- Issues: Escalate to engineering
