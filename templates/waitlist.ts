/**
 * Waitlist Email Templates
 * Campaign: SkillTree Product Hunt Launch
 */

import { FROM_EMAIL } from '../lib/email';

// Common email styles
const commonStyles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #059669; }
    .content { background: #ffffff; padding: 30px; border-radius: 8px; }
    .cta-button { display: inline-block; background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .cta-button:hover { background: #047857; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
    .highlight { background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 15px 0; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    .ps { border-top: 1px solid #e5e7eb; margin-top: 20px; padding-top: 15px; font-style: italic; color: #4b5563; }
  </style>
`;

interface EmailTemplate {
  subject: string;
  previewText: string;
  html: (data: Record<string, string>) => string;
  text: (data: Record<string, string>) => string;
}

/**
 * Email 1: Launch Announcement
 * Send at 00:01 PT launch day
 */
export const launchAnnouncement: EmailTemplate = {
  subject: '🚀 SkillTree is live on Product Hunt!',
  previewText: 'Help us reach #1 Product of the Day',
  html: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillTree is live on Product Hunt!</title>
  ${commonStyles}
</head>
<body>
  <div class="header">
    <div class="logo">🌳 SkillTree</div>
  </div>
  <div class="content">
    <p>Hi ${data.firstName || 'there'},</p>

    <p><strong>Today's the day.</strong></p>

    <p>SkillTree is now live on Product Hunt, and we'd love your support.</p>

    <div style="text-align: center;">
      <a href="${data.productHuntUrl || 'https://www.producthunt.com/posts/skilltree'}" class="cta-button">UPVOTE ON PRODUCT HUNT</a>
    </div>

    <h3>What is SkillTree?</h3>
    <p>It's the skill passport for humans and AI agents. Map your capabilities, showcase your expertise, and prepare for a future where humans and AI collaborate seamlessly.</p>

    <h3>What's live today:</h3>
    <ul>
      <li>✅ Create your skill tree profile</li>
      <li>✅ Visualize 520+ skills across 20 domains</li>
      <li>✅ Track your growth with XP and leveling</li>
      <li>✅ Export your data with SKILL.md</li>
    </ul>

    <h3>Coming soon:</h3>
    <ul>
      <li>🔄 AI agent marketplace (Layer 2)</li>
      <li>🔄 Collaboration workspace (Layer 3)</li>
    </ul>

    <div class="highlight">
      <strong>Why we're building this:</strong><br>
      We believe the future isn't humans vs. AI — it's humans AND AI, each doing what they do best. SkillTree is the infrastructure that makes this collaboration possible.
    </div>

    <h3>How you can help:</h3>
    <ol>
      <li>Upvote us on Product Hunt (link above)</li>
      <li>Leave a comment — your feedback means everything</li>
      <li>Share with someone who cares about the future of work</li>
    </ol>

    <p>Thank you for being an early supporter. This is just the beginning.</p>

    <p>— The FutureLabs Team</p>

    <div class="ps">
      P.S. Reply to this email with your SkillTree username and we'll feature you in our "Founding Members" showcase.
    </div>
  </div>
  <div class="footer">
    <p>FutureLabs · Building the future of human-AI collaboration</p>
    <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · <a href="${data.privacyUrl || '#'}">Privacy Policy</a></p>
  </div>
</body>
</html>
  `,
  text: (data) => `Hi ${data.firstName || 'there'},

Today's the day.

SkillTree is now live on Product Hunt, and we'd love your support.

UPVOTE ON PRODUCT HUNT: ${data.productHuntUrl || 'https://www.producthunt.com/posts/skilltree'}

What is SkillTree?
It's the skill passport for humans and AI agents. Map your capabilities, showcase your expertise, and prepare for a future where humans and AI collaborate seamlessly.

What's live today:
✅ Create your skill tree profile
✅ Visualize 520+ skills across 20 domains
✅ Track your growth with XP and leveling
✅ Export your data with SKILL.md

Coming soon:
🔄 AI agent marketplace (Layer 2)
🔄 Collaboration workspace (Layer 3)

Why we're building this:
We believe the future isn't humans vs. AI — it's humans AND AI, each doing what they do best. SkillTree is the infrastructure that makes this collaboration possible.

How you can help:
1. Upvote us on Product Hunt (link above)
2. Leave a comment — your feedback means everything
3. Share with someone who cares about the future of work

Thank you for being an early supporter. This is just the beginning.

— The FutureLabs Team

P.S. Reply to this email with your SkillTree username and we'll feature you in our "Founding Members" showcase.
`,
};

/**
 * Email 2: Final Hours Push
 * Send at 15:00 PT launch day
 */
export const finalHoursPush: EmailTemplate = {
  subject: "9 hours left — we're close!",
  previewText: 'Help us finish strong on Product Hunt',
  html: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>9 hours left on Product Hunt!</title>
  ${commonStyles}
</head>
<body>
  <div class="header">
    <div class="logo">🌳 SkillTree</div>
  </div>
  <div class="content">
    <p>Hi ${data.firstName || 'there'},</p>

    <p>We're in the <strong>final stretch</strong> of our Product Hunt launch, and the response has been incredible.</p>

    <div class="highlight">
      <strong>Current Status:</strong><br>
      📊 Current ranking: ${data.currentRanking || 'Competitive'}<br>
      🗳️ Total upvotes: ${data.totalUpvotes || 'Growing fast'}<br>
      💬 Comments: ${data.totalComments || 'Amazing engagement'}
    </div>

    <p>We're ${data.rankingMessage || 'so close to #1'}, and every vote counts.</p>

    <div style="text-align: center;">
      <a href="${data.productHuntUrl || 'https://www.producthunt.com/posts/skilltree'}" class="cta-button">UPVOTE NOW</a>
    </div>

    <p>If you haven't had a chance yet, now's the time. Voting closes at midnight PT.</p>

    <p>And if you've already upvoted — thank you! Would you mind sharing with a colleague or friend who might be interested?</p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${data.twitterShareUrl || '#'}" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #1da1f2; color: white; text-decoration: none; border-radius: 6px;">Share on Twitter</a>
      <a href="${data.linkedinShareUrl || '#'}" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #0077b5; color: white; text-decoration: none; border-radius: 6px;">Share on LinkedIn</a>
    </div>

    <p>We're building the future of human-AI collaboration, and you're part of it.</p>

    <p>— The FutureLabs Team</p>
  </div>
  <div class="footer">
    <p>FutureLabs · Building the future of human-AI collaboration</p>
    <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · <a href="${data.privacyUrl || '#'}">Privacy Policy</a></p>
  </div>
</body>
</html>
  `,
  text: (data) => `Hi ${data.firstName || 'there'},

We're in the final stretch of our Product Hunt launch, and the response has been incredible.

Current Status:
📊 Current ranking: ${data.currentRanking || 'Competitive'}
🗳️ Total upvotes: ${data.totalUpvotes || 'Growing fast'}
💬 Comments: ${data.totalComments || 'Amazing engagement'}

We're ${data.rankingMessage || 'so close to #1'}, and every vote counts.

UPVOTE NOW: ${data.productHuntUrl || 'https://www.producthunt.com/posts/skilltree'}

If you haven't had a chance yet, now's the time. Voting closes at midnight PT.

And if you've already upvoted — thank you! Would you mind sharing with a colleague or friend who might be interested?

Twitter: ${data.twitterShareUrl || '#'}
LinkedIn: ${data.linkedinShareUrl || '#'}

We're building the future of human-AI collaboration, and you're part of it.

— The FutureLabs Team
`,
};

/**
 * Email 3: Thank You + Next Steps
 * Send Day 2, 09:00 PT
 */
export const thankYouNextSteps: EmailTemplate = {
  subject: "Thank you — here's what's next",
  previewText: '${data.resultText || "Thank you for supporting SkillTree!"}',
  html: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you from SkillTree!</title>
  ${commonStyles}
</head>
<body>
  <div class="header">
    <div class="logo">🌳 SkillTree</div>
  </div>
  <div class="content">
    <p>Hi ${data.firstName || 'there'},</p>

    <p style="font-size: 18px;"><strong>We did it.</strong></p>

    <div class="highlight" style="text-align: center; font-size: 20px;">
      ${data.resultHtml || '🎉 SkillTree finished strong on Product Hunt!'}
    </div>

    <p>This wouldn't have happened without you. Thank you for believing in our vision of human-AI collaboration.</p>

    <h3>Here's what happens next:</h3>

    <p><strong>🔜 This Week</strong></p>
    <ul>
      <li>We're reviewing all your feedback and prioritizing features</li>
      <li>Inviting founding members to early access programs</li>
      <li>Planning Layer 2 (Marketplace) beta</li>
    </ul>

    <p><strong>🌳 Your Action Items</strong></p>
    <ol>
      <li>Create your SkillTree profile if you haven't yet → <a href="${data.appUrl || 'https://app.skilltree.ai'}">Get started</a></li>
      <li>Join our Discord community → <a href="${data.discordUrl || '#'}">Join Discord</a></li>
      <li>Follow us on Twitter for updates → <a href="${data.twitterUrl || '#'}">@skilltreeapp</a></li>
    </ol>

    <div class="highlight">
      <strong>📊 Launch by the Numbers</strong><br>
      Total upvotes: ${data.totalUpvotes || '—'}<br>
      New signups: ${data.newSignups || '—'}<br>
      Skills mapped: ${data.skillsMapped || '—'}<br>
      Countries reached: ${data.countriesReached || '—'}
    </div>

    <p>We're just getting started.</p>

    <p>— The FutureLabs Team</p>

    <div class="ps">
      P.S. Keep an eye out — we'll be announcing our first "Skill Tree Spotlight" feature next week. It could be you!
    </div>
  </div>
  <div class="footer">
    <p>FutureLabs · Building the future of human-AI collaboration</p>
    <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · <a href="${data.privacyUrl || '#'}">Privacy Policy</a></p>
  </div>
</body>
</html>
  `,
  text: (data) => `Hi ${data.firstName || 'there'},

We did it.

${data.resultText || '🎉 SkillTree finished strong on Product Hunt!'}

This wouldn't have happened without you. Thank you for believing in our vision of human-AI collaboration.

Here's what happens next:

🔜 This Week
- We're reviewing all your feedback and prioritizing features
- Inviting founding members to early access programs
- Planning Layer 2 (Marketplace) beta

🌳 Your Action Items
1. Create your SkillTree profile if you haven't yet → ${data.appUrl || 'https://app.skilltree.ai'}
2. Join our Discord community → ${data.discordUrl || '#'}
3. Follow us on Twitter for updates → @skilltreeapp

📊 Launch by the Numbers
Total upvotes: ${data.totalUpvotes || '—'}
New signups: ${data.newSignups || '—'}
Skills mapped: ${data.skillsMapped || '—'}
Countries reached: ${data.countriesReached || '—'}

We're just getting started.

— The FutureLabs Team

P.S. Keep an eye out — we'll be announcing our first "Skill Tree Spotlight" feature next week. It could be you!
`,
};

/**
 * Welcome email for new waitlist signups
 */
export const welcomeEmail: EmailTemplate = {
  subject: "Welcome to SkillTree — You're on the list!",
  previewText: 'Get ready for the skill passport for humans and AI agents',
  html: (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SkillTree!</title>
  ${commonStyles}
</head>
<body>
  <div class="header">
    <div class="logo">🌳 SkillTree</div>
  </div>
  <div class="content">
    <p>Hi ${data.firstName || 'there'},</p>

    <p>Welcome to the SkillTree waitlist! You're now part of a community building the future of human-AI collaboration.</p>

    <div class="highlight">
      <strong>What is SkillTree?</strong><br>
      The skill passport for humans and AI agents. Map your capabilities, showcase your expertise, and prepare for a future where humans and AI collaborate seamlessly.
    </div>

    <h3>What to expect:</h3>
    <ul>
      <li>🚀 Early access when we launch</li>
      <li>📧 Product updates and feature announcements</li>
      <li>💡 Tips on skill mapping and career growth</li>
      <li>🎁 Exclusive perks for early supporters</li>
    </ul>

    <p>Have questions? Just reply to this email — we read every message.</p>

    <p>— The FutureLabs Team</p>
  </div>
  <div class="footer">
    <p>FutureLabs · Building the future of human-AI collaboration</p>
    <p><a href="${data.unsubscribeUrl || '#'}">Unsubscribe</a> · <a href="${data.privacyUrl || '#'}">Privacy Policy</a></p>
  </div>
</body>
</html>
  `,
  text: (data) => `Hi ${data.firstName || 'there'},

Welcome to the SkillTree waitlist! You're now part of a community building the future of human-AI collaboration.

What is SkillTree?
The skill passport for humans and AI agents. Map your capabilities, showcase your expertise, and prepare for a future where humans and AI collaborate seamlessly.

What to expect:
🚀 Early access when we launch
📧 Product updates and feature announcements
💡 Tips on skill mapping and career growth
🎁 Exclusive perks for early supporters

Have questions? Just reply to this email — we read every message.

— The FutureLabs Team
`,
};

/**
 * Export all templates for easy access
 */
export const waitlistTemplates = {
  welcome: welcomeEmail,
  launchAnnouncement,
  finalHoursPush,
  thankYouNextSteps,
};

export default waitlistTemplates;
