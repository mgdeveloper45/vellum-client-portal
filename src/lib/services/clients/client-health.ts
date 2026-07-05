import type { ClientHealth, ClientProfile } from "./client-types";

export type ClientHealthResult = {
  status: ClientHealth;
  score: number;
  reasons: string[];
};

export function calculateClientHealth(
  client: ClientProfile,
): ClientHealthResult {
  let score = 100;
  const reasons: string[] = [];

  if (client.totalBookings === 0) {
    score -= 40;
    reasons.push("No completed bookings yet.");
  }

  if (client.totalRevenue < 250) {
    score -= 20;
    reasons.push("Low lifetime value.");
  }

  const status: ClientHealth =
    score >= 90
      ? "EXCELLENT"
      : score >= 75
        ? "GOOD"
        : score >= 50
          ? "ATTENTION"
          : "AT_RISK";

  return {
    status,
    score,
    reasons,
  };
}
