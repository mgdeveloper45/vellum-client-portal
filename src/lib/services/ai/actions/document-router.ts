import type { AiActionResult } from "./action-types";

import { generateInvoiceReminderAction } from "./invoice-action";

import { generateBookingConfirmationAction } from "./booking-action";

import { generateProposalAction } from "./proposal-action";

export async function tryGenerateDocument(
  query: string,
): Promise<AiActionResult | undefined> {
  const normalized = query.toLowerCase();

  if (normalized.includes("proposal")) {
    return generateProposalAction({
      clientName: "Client",
      businessName: "Business",
      projectName: "New Project",
      projectDescription: "Describe the requested project.",
      estimatedPrice: 0,
      estimatedTimeline: "TBD",
    });
  }

  if (normalized.includes("invoice")) {
    return generateInvoiceReminderAction({
      clientName: "Client",
      businessName: "Business",
      projectName: "Project",
      invoiceId: "INV-0001",
      amount: 0,
    });
  }

  if (normalized.includes("booking") || normalized.includes("appointment")) {
    return generateBookingConfirmationAction({
      clientName: "Client",
      businessName: "Business",
      serviceName: "Service",
      appointmentDate: "TBD",
      appointmentTime: "TBD",
    });
  }

  return undefined;
}
