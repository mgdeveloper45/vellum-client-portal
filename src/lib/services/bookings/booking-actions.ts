import type { BookingHealthResult } from "@/lib/services/bookings/booking-health";

type BookingActionPriority = "HIGH" | "MEDIUM" | "LOW";

type BookingRecommendedActionBase = {
  id: string;
  title: string;
  description: string;
  priority: BookingActionPriority;
};

export type BookingRecommendedAction =
  | (BookingRecommendedActionBase & {
      type: "NAVIGATION";
      href: string;
    })
  | (BookingRecommendedActionBase & {
      type: "COMMAND";
      command: "CREATE_PROJECT";
      bookingId: string;
    });

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
      type: "COMMAND",
      command: "CREATE_PROJECT",
      bookingId,
      title: "Create project",
      description: "Turn this booking into a client project.",
      priority: "HIGH",
    });
  }

  if (!hasMessages) {
    actions.push({
      id: "message-client",
      type: "NAVIGATION",
      title: "Message client",
      description: "Send a quick follow-up or preparation note.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (!hasFiles) {
    actions.push({
      id: "request-files",
      type: "NAVIGATION",
      title: "Request files",
      description: "Ask the client to upload any needed materials.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (!hasInvoice) {
    actions.push({
      id: "create-invoice",
      type: "NAVIGATION",
      title: "Create invoice",
      description: "Prepare billing for this booking.",
      href: `/bookings/${bookingId}`,
      priority: "MEDIUM",
    });
  }

  if (hasInvoice && !invoicePaid) {
    actions.push({
      id: "follow-up-payment",
      type: "NAVIGATION",
      title: "Follow up on payment",
      description: "Invoice exists but has not been paid yet.",
      href: "/invoices",
      priority: "HIGH",
    });
  }

  if (health.label === "HEALTHY" && actions.length === 0) {
    actions.push({
      id: "all-clear",
      type: "NAVIGATION",
      title: "Booking is on track",
      description: "No urgent follow-up needed right now.",
      href: `/bookings/${bookingId}`,
      priority: "LOW",
    });
  }

  return actions;
}
