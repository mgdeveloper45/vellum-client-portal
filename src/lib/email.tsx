import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { BookingRescheduledEmail } from "@/emails/booking-rescheduled-email";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation-email";

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
    react: (
      <BookingConfirmationEmail
        customerName={customerName}
        businessName={businessName}
        serviceName={serviceName}
        bookingDate={bookingDate}
        bookingTime={bookingTime}
      />
    ),
  });
}

type SendBookingRescheduledEmailParams = {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
};

export async function sendBookingRescheduledEmail({
  email,
  customerName,
  businessName,
  serviceName,
  bookingDate,
  bookingTime,
}: SendBookingRescheduledEmailParams) {
  const html = await render(
    <BookingRescheduledEmail
      customerName={customerName}
      businessName={businessName}
      serviceName={serviceName}
      bookingDate={bookingDate}
      bookingTime={bookingTime}
    />,
  );

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Your appointment has been rescheduled",
    html,
  });
}
