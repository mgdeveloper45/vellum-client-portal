import { generateEmailAction } from "./email-action";
import { buildBookingConfirmationPrompt } from "../prompts/booking-prompt-builder";

import type { AiActionResult } from "./action-types";

export interface BookingConfirmationActionParams {
  clientName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export async function generateBookingConfirmationAction(
  params: BookingConfirmationActionParams,
): Promise<AiActionResult> {
  const prompt = buildBookingConfirmationPrompt(params);

  return generateEmailAction({
    title: `Booking Confirmation • ${params.clientName}`,
    prompt,
  });
}
