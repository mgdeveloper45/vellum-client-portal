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

type SendWorkspaceInvitationEmailParams = {
  email: string;
  workspaceName: string;
  inviteUrl: string;
};

export async function sendWorkspaceInvitationEmail({
  email,
  workspaceName,
  inviteUrl,
}: SendWorkspaceInvitationEmailParams) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `You're invited to join ${workspaceName}`,
    html: `
      <h1>You're invited to Vellum</h1>

      <p>
        You've been invited to join <strong>${workspaceName}</strong>.
      </p>

      <p>
        <a href="${inviteUrl}">
          Accept Invitation
        </a>
      </p>

      <p>
        This invitation expires in 7 days.
      </p>
    `,
  });
}

type SendBookingConfirmationEmailParams = {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
};

export async function sendBookingConfirmationEmail({
  email,
  customerName,
  businessName,
  serviceName,
  bookingDate,
  bookingTime,
}: SendBookingConfirmationEmailParams) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `Your booking with ${businessName} is confirmed`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h1>Booking Confirmed 🎉</h1>

        <p>Hi ${customerName},</p>

        <p>Your appointment has been confirmed.</p>

        <table cellpadding="8">
          <tr>
            <td><strong>Business</strong></td>
            <td>${businessName}</td>
          </tr>

          <tr>
            <td><strong>Service</strong></td>
            <td>${serviceName}</td>
          </tr>

          <tr>
            <td><strong>Date</strong></td>
            <td>${bookingDate}</td>
          </tr>

          <tr>
            <td><strong>Time</strong></td>
            <td>${bookingTime}</td>
          </tr>
        </table>

        <p>We look forward to seeing you!</p>

        <hr>

        <p style="font-size:12px;color:#666">
          Powered by Vellum
        </p>
      </div>
    `,
  });
}
