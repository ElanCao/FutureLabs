/**
 * Email Test Script
 * Run with: npx tsx scripts/test-email.ts
 */

import { sendEmail, verifyEmailConfig } from '../lib/email';
import { waitlistTemplates } from '../templates/waitlist';

async function main() {
  console.log('🧪 Testing Resend email configuration...\n');

  // Step 1: Verify configuration
  console.log('1️⃣ Checking email configuration...');
  const config = await verifyEmailConfig();

  if (!config.valid) {
    console.error('❌ Configuration invalid:', config.error);
    console.log('\n💡 Make sure you have set RESEND_API_KEY in .env.local');
    process.exit(1);
  }

  console.log('✅ Configuration valid');
  console.log('   Domains:', config.domains.map((d: any) => d.name).join(', ') || 'None verified yet');

  // Step 2: Send test email
  console.log('\n2️⃣ Sending test email...');

  const testEmail = process.env.TEST_EMAIL || 'your-email@example.com';

  const result = await sendEmail({
    to: testEmail,
    subject: waitlistTemplates.welcome.subject,
    html: waitlistTemplates.welcome.html({ firstName: 'Test User' }),
    text: waitlistTemplates.welcome.text({ firstName: 'Test User' }),
    tags: [{ name: 'test', value: 'true' }],
  });

  if (result.success) {
    console.log('✅ Test email sent successfully!');
    console.log('   Email ID:', result.id);
    console.log('\n📧 Check your inbox at:', testEmail);
  } else {
    console.error('❌ Failed to send test email:', result.error);
    process.exit(1);
  }

  console.log('\n✨ All tests passed!');
}

main().catch(console.error);
