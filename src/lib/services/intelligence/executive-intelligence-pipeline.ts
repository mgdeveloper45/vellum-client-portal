import {
  buildExecutiveAdvisor,
  type ExecutiveAdvice,
} from "./executive-advisor/executive-advisor-engine";
import type { WorkspaceCapacity } from "./capacity/workspace-capacity-engine";
import type { BookingForecast } from "./forecasting/booking-forecast-engine";
import type { RevenueForecast } from "./forecasting/revenue-forecast-engine";
import type { ExecutiveInsight } from "./executive-intelligence-engine";

export type ExecutiveIntelligencePipelineInput = {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
};

export type ExecutiveIntelligencePipelineResult = {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
  executiveAdvice: ExecutiveAdvice[];

  topAdvice: ExecutiveAdvice | null;

  summary: {
    revenueRisk: RevenueForecast["risk"];
    bookingRisk: BookingForecast["risk"];
    capacityRisk: WorkspaceCapacity["risk"];
    adviceCount: number;
    criticalAdviceCount: number;
    highPriorityAdviceCount: number;
  };
};

export function buildExecutiveIntelligencePipeline({
  revenueForecast,
  bookingForecast,
  workspaceCapacity,
  executiveInsights,
}: ExecutiveIntelligencePipelineInput): ExecutiveIntelligencePipelineResult {
  const executiveAdvice = buildExecutiveAdvisor({
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveInsights,
  });

  const criticalAdviceCount = executiveAdvice.filter(
    (advice) => advice.priority === "CRITICAL",
  ).length;

  const highPriorityAdviceCount = executiveAdvice.filter(
    (advice) => advice.priority === "HIGH",
  ).length;

  return {
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveInsights,
    executiveAdvice,

    topAdvice: executiveAdvice[0] ?? null,

    summary: {
      revenueRisk: revenueForecast.risk,
      bookingRisk: bookingForecast.risk,
      capacityRisk: workspaceCapacity.risk,
      adviceCount: executiveAdvice.length,
      criticalAdviceCount,
      highPriorityAdviceCount,
    },
  };
}
