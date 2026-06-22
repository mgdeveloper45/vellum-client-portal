import { resend } from "@/lib/resend";

type SendPasswordResetEmailParams = {
  email: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: SendPasswordResetEmailParams) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Reset your Vellum password",
    html: `
      <h1>Reset your password</h1>

      <p>You requested a password reset for your Vellum account.</p>

      <p>
        <a href="${resetUrl}">
          Reset Password
        </a>
      </p>

      <p>This link expires in 1 hour.</p>

      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
