import type {
  DashboardForecastResult,
} from "@/lib/services/dashboard/dashboard-forecast-builder";

export interface MorningBrief {
  headline: string;

  highlights: string[];

  actionItems: string[];
}

export function buildMorningBrief(
  dashboard: DashboardForecastResult,
): MorningBrief {
  const highlights: string[] = [];

  const actionItems: string[] = [];

  highlights.push(
    `Revenue collected: $${dashboard.revenueCollected.toLocaleString()}`,
  );

  highlights.push(
    `${dashboard.workspaceCapacity.today.bookings} bookings today.`,
  );

  if (dashboard.revenueOutstanding > 0) {
    actionItems.push(
      `Collect $${dashboard.revenueOutstanding.toLocaleString()} in outstanding invoices.`,
    );
  }

if (dashboard.bookingForecast.risk === "HIGH") {
  actionItems.push(
    `${dashboard.bookingForecast.recommendation} (${dashboard.bookingForecast.utilizationWeek}% weekly utilization)`,
  );
}

  return {
    headline: "Good morning. Here's what's happening today.",
    highlights,
    actionItems,
  };
}