import type { BusinessHealthScore } from "@/lib/services/intelligence/business-health-score";
import type { ExecutiveIntelligence } from "./executive-intelligence-builder";
import type { MorningBrief } from "./morning-brief-builder";
import type { DashboardForecastResult } from "./dashboard-forecast-builder";

export interface DashboardOverview {
  forecasts: DashboardForecastResult;
  executiveIntelligence: ExecutiveIntelligence;
  businessHealth: BusinessHealthScore;
  morningBrief: MorningBrief;
}

export function buildDashboardOverview({
  forecasts,
  executiveIntelligence,
  businessHealth,
  morningBrief,
}: DashboardOverview): DashboardOverview {
  return {
    forecasts,
    executiveIntelligence,
    businessHealth,
    morningBrief,
  };
}