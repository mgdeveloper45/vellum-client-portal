import type { WorkspaceCapacity } from "./capacity/workspace-capacity-engine";
import type { BookingForecast } from "./forecasting/booking-forecast-engine";
import type { RevenueForecast } from "./forecasting/revenue-forecast-engine";

export type ExecutiveSignalSeverity =
  "excellent" | "good" | "warning" | "critical";

export type ExecutiveSignalTrend = "up" | "down" | "stable";

export type ExecutiveSignal = {
  id: string;
  title: string;
  summary: string;
  score: number;
  severity: ExecutiveSignalSeverity;
  trend: ExecutiveSignalTrend;
};

export type ExecutiveSignals = {
  strengths: ExecutiveSignal[];
  risks: ExecutiveSignal[];
  opportunities: ExecutiveSignal[];
};

function severityToScore(severity: ExecutiveSignalSeverity): number {
  switch (severity) {
    case "excellent":
      return 96;

    case "good":
      return 88;

    case "warning":
      return 65;

    case "critical":
      return 35;
  }
}

function toSignalTrend(trend: "UP" | "DOWN" | "STABLE"): ExecutiveSignalTrend {
  switch (trend) {
    case "UP":
      return "up";

    case "DOWN":
      return "down";

    default:
      return "stable";
  }
}

function buildRevenueSignal(revenueForecast: RevenueForecast): ExecutiveSignal {
  const healthy = revenueForecast.risk === "LOW";

  return {
    id: "revenue",
    title: healthy ? "Healthy Revenue" : "Revenue Risk",
    summary: revenueForecast.summary,
    score: severityToScore(
      healthy
        ? "excellent"
        : revenueForecast.risk === "HIGH"
          ? "critical"
          : "warning",
    ),
    severity: healthy
      ? "excellent"
      : revenueForecast.risk === "HIGH"
        ? "critical"
        : "warning",
    trend: toSignalTrend(revenueForecast.trend),
  };
}

function buildBookingSignal(bookingForecast: BookingForecast): ExecutiveSignal {
  const healthy = bookingForecast.risk === "LOW";

  return {
    id: "bookings",
    title: healthy ? "Strong Booking Pipeline" : "Booking Opportunity",
    summary: bookingForecast.summary,
    score: severityToScore(healthy ? "good" : "warning"),
    severity: healthy ? "good" : "warning",
    trend: toSignalTrend(bookingForecast.trend),
  };
}

function buildCapacitySignal(
  workspaceCapacity: WorkspaceCapacity,
): ExecutiveSignal {
  const healthy = workspaceCapacity.risk === "LOW";

  return {
    id: "capacity",
    title: healthy ? "Healthy Capacity" : "Optimize Capacity",
    summary: workspaceCapacity.summary,
    score: severityToScore(healthy ? "good" : "warning"),
    severity: healthy ? "good" : "warning",
    trend: "stable",
  };
}

function categorizeSignal(
  signal: ExecutiveSignal,
  category: "strength" | "risk" | "opportunity",
  strengths: ExecutiveSignal[],
  risks: ExecutiveSignal[],
  opportunities: ExecutiveSignal[],
): void {
  switch (category) {
    case "strength":
      strengths.push(signal);
      break;

    case "risk":
      risks.push(signal);
      break;

    case "opportunity":
      opportunities.push(signal);
      break;
  }
}

export function buildExecutiveSignals({
  revenueForecast,
  bookingForecast,
  workspaceCapacity,
}: {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
}): ExecutiveSignals {
  const strengths: ExecutiveSignal[] = [];
  const risks: ExecutiveSignal[] = [];
  const opportunities: ExecutiveSignal[] = [];

  const signals = [
    {
      signal: buildRevenueSignal(revenueForecast),
      category: revenueForecast.risk === "LOW" ? "strength" : "risk",
    },
    {
      signal: buildBookingSignal(bookingForecast),
      category: bookingForecast.risk === "LOW" ? "strength" : "opportunity",
    },
    {
      signal: buildCapacitySignal(workspaceCapacity),
      category: workspaceCapacity.risk === "LOW" ? "strength" : "opportunity",
    },
  ] as const;

  signals.forEach(({ signal, category }) =>
    categorizeSignal(signal, category, strengths, risks, opportunities),
  );

  return {
    strengths,
    risks,
    opportunities,
  };
}
