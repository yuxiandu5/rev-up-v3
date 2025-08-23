// Email service - stub implementation for now
// In production, replace with actual SMTP service (Resend, SendGrid, etc.)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // TODO: Implement actual email sending
  // For now, just log the email details
  console.log('📧 Email would be sent:');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`HTML: ${options.html}`);
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
}

export function generateVerificationEmail(email: string, token: string): EmailOptions {
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
  
  return {
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2>Verify your email address</h2>
        <p>Thank you for registering! Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p><small>Note: You'll need a frontend page at /verify-email that calls the API endpoint POST /api/auth/verify-email</small></p>
      </div>
    `,
  };
}
