import type { BookingHealthResult } from "./booking-health";
import type { BookingMission } from "./booking-mission";
import type { BookingCountdown } from "./booking-countdown";

type BookingAISummaryInput = {
  customerName: string;
  serviceName: string;
  health: BookingHealthResult;
  mission: BookingMission;
  countdown: BookingCountdown;
};

export function buildBookingAISummary({
  customerName,
  serviceName,
  health,
  mission,
  countdown,
}: BookingAISummaryInput) {
  return `
${customerName} has a scheduled ${serviceName}.

Booking Health: ${health.score}% (${health.label.replace("_", " ")})

Time Remaining: ${countdown.label}

Today's Mission:
${mission.title}

Recommendation:
${mission.description}
`.trim();
}
