import {
  buildExecutiveAdvisor,
  type ExecutiveAdvice,
} from "./executive-advisor/executive-advisor-engine";
import {
  buildRecommendations,
  type ExecutiveRecommendation,
} from "./executive-recommendations-engine";

import type { WorkspaceCapacity } from "./capacity/workspace-capacity-engine";
import type { BookingForecast } from "./forecasting/booking-forecast-engine";
import type { RevenueForecast } from "./forecasting/revenue-forecast-engine";

import {
  buildExecutiveScore,
  type ExecutiveScore,
} from "./executive-score-engine";
import {
  buildExecutiveSignals,
  type ExecutiveSignal,
} from "./executive-signals-engine";
import type { ExecutiveInsight } from "./executive-intelligence-engine";

export type ExecutiveIntelligencePipelineInput = {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
};

export type ExecutiveSummary = {
  revenueRisk: RevenueForecast["risk"];
  bookingRisk: BookingForecast["risk"];
  capacityRisk: WorkspaceCapacity["risk"];
  adviceCount: number;
  criticalAdviceCount: number;
  highPriorityAdviceCount: number;
  executiveScore: number;
  healthySignals: number;
  riskSignals: number;
  opportunitySignals: number;
};

export type ExecutiveIntelligencePipelineResult = {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
  executiveScore: ExecutiveScore;
  executiveAdvice: ExecutiveAdvice[];
  topAdvice: ExecutiveAdvice | null;
  strengths: ExecutiveSignal[];
  risks: ExecutiveSignal[];
  opportunities: ExecutiveSignal[];
  recommendations: ExecutiveRecommendation[];
  summary: ExecutiveSummary;
};
function buildExecutiveSummary(args: {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveAdvice: ExecutiveAdvice[];
  executiveScore: ExecutiveScore;
  strengths: ExecutiveSignal[];
  risks: ExecutiveSignal[];
  opportunities: ExecutiveSignal[];
}): ExecutiveSummary {
  const criticalAdviceCount = args.executiveAdvice.filter(
    ({ priority }) => priority === "CRITICAL",
  ).length;

  const highPriorityAdviceCount = args.executiveAdvice.filter(
    ({ priority }) => priority === "HIGH",
  ).length;

  return {
    revenueRisk: args.revenueForecast.risk,
    bookingRisk: args.bookingForecast.risk,
    capacityRisk: args.workspaceCapacity.risk,
    adviceCount: args.executiveAdvice.length,
    criticalAdviceCount,
    highPriorityAdviceCount,
    executiveScore: args.executiveScore.score,
    healthySignals: args.strengths.length,
    riskSignals: args.risks.length,
    opportunitySignals: args.opportunities.length,
  };
}

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

  const executiveScore = buildExecutiveScore({
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveInsights,
  });

  const topAdvice = executiveAdvice[0] ?? null;
  const signals = buildExecutiveSignals({
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
  });
  const recommendations = buildRecommendations(executiveAdvice);
  const { strengths, risks, opportunities } = signals;

  return {
    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveInsights,
    executiveScore,
    executiveAdvice,
    topAdvice,
    strengths,
    risks,
    opportunities,
    recommendations,
    summary: buildExecutiveSummary({
      revenueForecast,
      bookingForecast,
      workspaceCapacity,
      executiveAdvice,
      executiveScore,
      strengths,
      risks,
      opportunities,
    }),
  };
}
