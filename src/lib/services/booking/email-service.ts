import {
  sendBookingConfirmationEmail,
  sendBookingRescheduledEmail,
} from "@/lib/email";

type BookingEmailParams = {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
};

export async function sendBookingConfirmation(params: BookingEmailParams) {
  await sendBookingConfirmationEmail(params);
}

export async function sendBookingRescheduled(params: BookingEmailParams) {
  await sendBookingRescheduledEmail(params);
}
