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

type SendProjectMessageEmailParams = {
  email: string;
  projectName: string;
  senderName: string;
  message: string;
  projectUrl: string;
};

export async function sendProjectMessageEmail({
  email,
  projectName,
  senderName,
  message,
  projectUrl,
}: SendProjectMessageEmailParams) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `New message on ${projectName}`,
    html: `
      <h1>New project message</h1>

      <p>
        <strong>${senderName}</strong> sent a message on:
      </p>

      <p>
        <strong>${projectName}</strong>
      </p>

      <p>
        ${message}
      </p>

      <p>
        <a href="${projectUrl}">
          View project
        </a>
      </p>
    `,
  });
}
