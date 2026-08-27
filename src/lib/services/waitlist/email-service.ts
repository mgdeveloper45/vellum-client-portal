import { sendWaitlistOpeningEmail } from "@/lib/email";

export interface WaitlistOpeningEmailParams {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  bookingDate: string;
  availableTime: string;
  bookingUrl: string;
  expiresAt: string;
}

export async function sendWaitlistOpening(params: WaitlistOpeningEmailParams) {
  await sendWaitlistOpeningEmail(params);
}
