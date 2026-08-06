import type { CopilotContext } from "@/lib/services/copilot/copilot-context-builder";

export interface BusinessContext {
  executiveScore: number;

  revenueRisk: string;
  bookingRisk: string;
  capacityRisk: string;

  revenueCollected: number;
  revenueOutstanding: number;
  previousPeriodRevenue: number;
  upcomingBookingRevenue: number;

  topAdvice: string | null;

  recommendations: string[];

  morningBrief: string;

  aiNarrative: string;
}

export function buildBusinessContext(context: CopilotContext): BusinessContext {
  return {
    executiveScore: context.executive.summary.executiveScore,

    revenueRisk: context.executive.summary.revenueRisk,

    bookingRisk: context.executive.summary.bookingRisk,

    capacityRisk: context.executive.summary.capacityRisk,

    revenueCollected: context.metrics.revenueCollected,

    revenueOutstanding: context.metrics.revenueOutstanding,

    previousPeriodRevenue: context.metrics.previousPeriodRevenue,

    upcomingBookingRevenue: context.metrics.upcomingBookingRevenue,

    topAdvice: context.executive.topAdvice?.recommendedAction ?? null,

    recommendations: context.executive.advice.map(
      (advice) => advice.recommendedAction,
    ),

    morningBrief: context.morningBrief.executiveSummary,

    aiNarrative: context.aiBrief.narrative,
  };
}
