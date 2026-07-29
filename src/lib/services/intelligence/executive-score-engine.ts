import type { RevenueForecast } from "./forecasting/revenue-forecast-engine";
import type { BookingForecast } from "./forecasting/booking-forecast-engine";
import type { WorkspaceCapacity } from "./capacity/workspace-capacity-engine";
import type { ExecutiveInsight } from "./executive-intelligence-engine";

export type ExecutiveScoreTrend = "UP" | "STABLE" | "DOWN";

export type ExecutiveScoreGrade = "A+" | "A" | "B" | "C" | "D";

export type ExecutiveScoreContributor = {
  key: "revenue" | "bookings" | "capacity" | "collections" | "clients";

  label: string;

  score: number;

  trend: ExecutiveScoreTrend;

  summary: string;
};

export type ExecutiveScore = {
  score: number;

  grade: ExecutiveScoreGrade;

  status: string;

  trend: ExecutiveScoreTrend;

  contributors: ExecutiveScoreContributor[];
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function grade(score: number): ExecutiveScoreGrade {
  if (score >= 97) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";

  return "D";
}

function revenueHealth(revenue: RevenueForecast) {
  return clamp(revenue.confidence - revenue.revenueAtRisk / 1000);
}

function bookingHealth(bookings: BookingForecast) {
  return clamp(bookings.utilizationWeek * 0.7 + bookings.confidence * 0.3);
}

function capacityHealth(capacity: WorkspaceCapacity) {
  return clamp(
    capacity.weeklyUtilizationRate * 0.8 + (capacity.constrained ? 5 : 15),
  );
}

function clientHealth(insights: ExecutiveInsight[]) {
  const high = insights.filter((i) => i.priority === "HIGH").length;

  return clamp(95 - high * 8);
}

export function buildExecutiveScore({
  revenueForecast,
  bookingForecast,
  workspaceCapacity,
  executiveInsights,
}: {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
}): ExecutiveScore {
  const revenue = revenueHealth(revenueForecast);

  const bookings = bookingHealth(bookingForecast);

  const capacity = capacityHealth(workspaceCapacity);

  const collections = clamp(
    revenueForecast.confidence - revenueForecast.revenueAtRisk / 1500,
  );

  const clients = clientHealth(executiveInsights);

  const contributors: ExecutiveScoreContributor[] = [
    {
      key: "revenue",
      label: "Revenue",
      score: revenue,
      trend: revenueForecast.trend,
      summary: revenueForecast.summary,
    },

    {
      key: "bookings",
      label: "Bookings",
      score: bookings,
      trend: bookingForecast.trend,
      summary: bookingForecast.summary,
    },

    {
      key: "capacity",
      label: "Capacity",
      score: capacity,
      trend: "STABLE",
      summary: workspaceCapacity.summary,
    },

    {
      key: "collections",
      label: "Collections",
      score: collections,
      trend: revenueForecast.trend,
      summary: revenueForecast.summary,
    },

    {
      key: "clients",
      label: "Clients",
      score: clients,
      trend: "STABLE",
      summary: `${executiveInsights.length} active executive insights.`,
    },
  ];

  const score = Math.round(
    revenue * 0.35 +
      bookings * 0.25 +
      capacity * 0.2 +
      collections * 0.1 +
      clients * 0.1,
  );

  return {
    score,

    grade: grade(score),

    status:
      score >= 90
        ? "Excellent"
        : score >= 80
          ? "Healthy"
          : score >= 70
            ? "Needs Attention"
            : "Critical",

    trend: revenueForecast.trend,

    contributors,
  };
}
