import { buildBookingTimeline } from "@/lib/services/bookings/booking-timeline";

import { calculateBookingHealth } from "@/lib/services/bookings/booking-health";

import { buildBookingRecommendedActions } from "@/lib/services/bookings/booking-actions";

type BuildBookingEngineParams = {
  bookingId: string;

  status: string;

  bookingCreatedAt: Date;

  bookingDate: Date;

  hasGoogleCalendarEvent: boolean;

  hasProject: boolean;

  hasInvoice: boolean;

  invoicePaid: boolean;

  hasMessages: boolean;

  hasFiles: boolean;
};

export function buildBookingEngine({
  bookingId,
  status,
  bookingCreatedAt,
  bookingDate,
  hasGoogleCalendarEvent,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
}: BuildBookingEngineParams) {
  const timeline = buildBookingTimeline({
    bookingCreatedAt,
    hasProject,
    hasInvoice,
    invoicePaid,
    hasMessages,
    hasFiles,
  });

  const health = calculateBookingHealth({
    status,
    bookingDate,
    hasCalendarEvent: hasGoogleCalendarEvent,
    hasProject,
    hasInvoice,
    invoicePaid,
    hasMessages,
    hasFiles,
  });

  const actions = buildBookingRecommendedActions({
    bookingId,
    health,
    hasProject,
    hasInvoice,
    invoicePaid,
    hasMessages,
    hasFiles,
  });

  return {
    timeline,
    health,
    actions,
  };
}
