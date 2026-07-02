import type { BookingHealthResult } from "@/lib/services/bookings/booking-health";

export type BookingRecommendedAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

type BuildBookingActionsParams = {
  bookingId: string;
  health: BookingHealthResult;
  hasProject: boolean;
  hasInvoice: boolean;
  invoicePaid: boolean;
  hasMessages: boolean;
  hasFiles: boolean;
};

export function buildBookingRecommendedActions({
  bookingId,
  health,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
}: BuildBookingActionsParams): BookingRecommendedAction[] {
  const actions: BookingRecommendedAction[] = [];

  if (!hasProject) {
    actions.push({
      id: "create-project",
      title: "Create project",
      description: "Turn this booking into a client project.",
      href: `/bookings/${bookingId}`,
      priority: "HIGH",
    });
  }

  if (!hasMessages) {
    actions.push({
      id: "message-client",
      title: "Message client",
      description: "Send a quick follow-up or preparation note.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (!hasFiles) {
    actions.push({
      id: "request-files",
      title: "Request files",
      description: "Ask the client to upload any needed materials.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (!hasInvoice) {
    actions.push({
      id: "create-invoice",
      title: "Create invoice",
      description: "Prepare billing for this booking.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (hasInvoice && !invoicePaid) {
    actions.push({
      id: "follow-up-payment",
      title: "Follow up on payment",
      description: "Invoice exists but has not been paid yet.",
      href: "/invoices",
      priority: "HIGH",
    });
  }

  if (health.label === "HEALTHY" && actions.length === 0) {
    actions.push({
      id: "all-clear",
      title: "Booking is on track",
      description: "No urgent follow-up needed right now.",
      href: `/bookings/${bookingId}`,
      priority: "LOW",
    });
  }

  return actions;
}
