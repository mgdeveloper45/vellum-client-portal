export type BookingHealthInput = {
  status: string;
  hasCalendarEvent: boolean;
  hasProject: boolean;
  hasInvoice: boolean;
  invoicePaid: boolean;
  hasMessages: boolean;
  hasFiles: boolean;
  bookingDate: Date;
};

export type BookingHealthResult = {
  score: number;
  label: "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";
  reasons: string[];
};

export function calculateBookingHealth({
  status,
  hasCalendarEvent,
  hasProject,
  hasInvoice,
  invoicePaid,
  hasMessages,
  hasFiles,
  bookingDate,
}: BookingHealthInput): BookingHealthResult {
  let score = 100;
  const reasons: string[] = [];

  const now = new Date();
  const daysUntilBooking = Math.ceil(
    (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (status === "CANCELLED") {
    return {
      score: 0,
      label: "AT_RISK",
      reasons: ["Booking was cancelled."],
    };
  }

  if (!hasCalendarEvent) {
    score -= 15;
    reasons.push("Calendar event has not been synced.");
  }

  if (!hasProject) {
    score -= 15;
    reasons.push("No project has been created from this booking.");
  }

  if (!hasMessages) {
    score -= 10;
    reasons.push("No client communication has been recorded yet.");
  }

  if (!hasFiles) {
    score -= 10;
    reasons.push("No files have been uploaded for this booking.");
  }

  if (!hasInvoice) {
    score -= 15;
    reasons.push("No invoice has been created yet.");
  }

  if (hasInvoice && !invoicePaid) {
    score -= 15;
    reasons.push("Invoice is still unpaid.");
  }

  if (daysUntilBooking <= 1 && !hasMessages) {
    score -= 10;
    reasons.push(
      "Booking is soon, but there has been no client communication.",
    );
  }

  const normalizedScore = Math.max(0, Math.min(100, score));

  return {
    score: normalizedScore,
    label:
      normalizedScore >= 80
        ? "HEALTHY"
        : normalizedScore >= 50
          ? "NEEDS_ATTENTION"
          : "AT_RISK",
    reasons: reasons.length > 0 ? reasons : ["Booking workflow looks healthy."],
  };
}
