import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";
import type { ExecutiveSummary } from "@/lib/services/intelligence/executive-intelligence-pipeline";
import type { ExecutiveAdvice } from "@/lib/services/intelligence/executive-advisor/executive-advisor-engine";

export interface CopilotContext {
  executive: {
    summary: ExecutiveSummary;
    advice: ExecutiveAdvice[];
    topAdvice: ExecutiveAdvice | null;
  };

  forecasts: {
    revenue: DashboardViewModel["revenueForecast"];
    bookings: DashboardViewModel["bookingForecast"];
    capacity: DashboardViewModel["workspaceCapacity"];
  };

  morningBrief: DashboardViewModel["morningBrief"];
  aiBrief: DashboardViewModel["aiResult"];

  metrics: {
    revenueCollected: number;
    revenueOutstanding: number;
    previousPeriodRevenue: number;
    upcomingBookingRevenue: number;
  };
}

export function buildCopilotContext(
  dashboard: DashboardViewModel,
): CopilotContext {
  return {
    executive: {
      summary: dashboard.executiveIntelligence.summary,
      advice: dashboard.executiveAdvice,
      topAdvice: dashboard.topAdvice,
    },

    forecasts: {
      revenue: dashboard.revenueForecast,
      bookings: dashboard.bookingForecast,
      capacity: dashboard.workspaceCapacity,
    },

    morningBrief: dashboard.morningBrief,
    aiBrief: dashboard.aiResult,

    metrics: {
      revenueCollected: dashboard.revenueCollected,
      revenueOutstanding: dashboard.revenueOutstanding,
      previousPeriodRevenue: dashboard.previousPeriodRevenue,
      upcomingBookingRevenue: dashboard.upcomingBookingRevenue,
    },
  };
}