export interface BookingConfirmationPromptParams {
  clientName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export function buildBookingConfirmationPrompt(
  params: BookingConfirmationPromptParams,
): string {
  return `
You are Vellum AI.

Draft a professional booking confirmation email.

Business:
${params.businessName}

Client:
${params.clientName}

Service:
${params.serviceName}

Appointment Date:
${params.appointmentDate}

Appointment Time:
${params.appointmentTime}

Requirements

- Friendly
- Professional
- Short
- Confirm appointment details
- Thank the client

Return only the email body.
`;
}