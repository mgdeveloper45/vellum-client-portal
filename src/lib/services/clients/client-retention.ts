import type { ClientProfile, ClientRetentionRisk } from "./client-types";

export type ClientRetentionResult = {
  risk: ClientRetentionRisk;
  daysSinceLastBooking: number | null;
  recommendedAction: string;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function calculateClientRetention(
  client: ClientProfile,
  today: Date = new Date(),
): ClientRetentionResult {
  if (!client.lastBookingAt) {
    return {
      risk: "HIGH",
      daysSinceLastBooking: null,
      recommendedAction: "Complete the client's first booking.",
    };
  }

  const daysSinceLastBooking = Math.floor(
    (today.getTime() - client.lastBookingAt.getTime()) / DAY_IN_MS,
  );

  if (daysSinceLastBooking <= 30) {
    return {
      risk: "LOW",
      daysSinceLastBooking,
      recommendedAction: "Maintain the relationship.",
    };
  }

  if (daysSinceLastBooking <= 90) {
    return {
      risk: "MEDIUM",
      daysSinceLastBooking,
      recommendedAction: "Send a follow-up or rebooking reminder.",
    };
  }

  return {
    risk: "HIGH",
    daysSinceLastBooking,
    recommendedAction: "Launch a win-back campaign.",
  };
}
