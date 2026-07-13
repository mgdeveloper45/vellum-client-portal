import type { RevenueForecast } from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import type { BookingForecast } from "@/lib/services/intelligence/forecasting/booking-forecast-engine";
import type { WorkspaceCapacity } from "@/lib/services/intelligence/capacity/workspace-capacity-engine";
import type { ExecutiveInsight } from "@/lib/services/intelligence/executive-intelligence-engine";

export type ExecutiveAdviceEffort = "LOW" | "MEDIUM" | "HIGH";

export type ExecutiveAdvicePriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ExecutiveAdviceCategory =
  "REVENUE" | "BOOKINGS" | "CLIENTS" | "OPERATIONS";

export type ExecutiveAdvice = {
  id: string;
  title: string;
  reason: string;

  estimatedImpact: number;
  confidence: number;

  effort: ExecutiveAdviceEffort;
  priority: ExecutiveAdvicePriority;
  category: ExecutiveAdviceCategory;

  recommendedAction: string;
  href: string;

  score: number;
};

export type ExecutiveAdvisorInput = {
  revenueForecast: RevenueForecast;
  bookingForecast: BookingForecast;
  workspaceCapacity: WorkspaceCapacity;
  executiveInsights: ExecutiveInsight[];
};

type AdviceCandidate = Omit<ExecutiveAdvice, "score">;

const priorityWeight: Record<ExecutiveAdvicePriority, number> = {
  CRITICAL: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25,
};

const effortWeight: Record<ExecutiveAdviceEffort, number> = {
  LOW: 20,
  MEDIUM: 10,
  HIGH: 0,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function calculateAdviceScore(advice: AdviceCandidate) {
  const normalizedImpact = Math.min(advice.estimatedImpact / 100, 100);

  return Math.round(
    priorityWeight[advice.priority] +
      normalizedImpact +
      advice.confidence * 0.5 +
      effortWeight[advice.effort],
  );
}

function mapInsightPriority(
  priority: ExecutiveInsight["priority"],
): ExecutiveAdvicePriority {
  switch (priority) {
    case "HIGH":
      return "HIGH";

    case "MEDIUM":
      return "MEDIUM";

    default:
      return "LOW";
  }
}

function mapInsightCategory(
  domain: ExecutiveInsight["domain"],
): ExecutiveAdviceCategory {
  switch (domain) {
    case "FINANCE":
      return "REVENUE";

    case "BOOKINGS":
      return "BOOKINGS";

    case "CLIENTS":
      return "CLIENTS";

    case "PROJECTS":
    case "WORKSPACE":
      return "OPERATIONS";
  }
}

function buildRevenueAdvice(forecast: RevenueForecast): AdviceCandidate | null {
  if (forecast.revenueAtRisk <= 0 && forecast.risk === "LOW") {
    return null;
  }

  const priority: ExecutiveAdvicePriority =
    forecast.risk === "HIGH"
      ? "CRITICAL"
      : forecast.risk === "MEDIUM"
        ? "HIGH"
        : "MEDIUM";

  return {
    id: "protect-revenue-at-risk",
    title: "Protect revenue at risk",
    reason:
      forecast.revenueAtRisk > 0
        ? `${forecast.revenueAtRisk.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })} is currently exposed to collection risk.`
        : forecast.summary,

    estimatedImpact: forecast.revenueAtRisk,

    confidence: forecast.confidence,

    effort: "LOW",
    priority,
    category: "REVENUE",

    recommendedAction:
      "Review outstanding invoices and contact the highest-value unpaid client first.",

    href: "/invoices",
  };
}

function buildCapacityAdvice(
  capacity: WorkspaceCapacity,
): AdviceCandidate | null {
  if (capacity.weeklyOpenSlots <= 0 || capacity.estimatedOpenRevenue <= 0) {
    return null;
  }

  const priority: ExecutiveAdvicePriority =
    capacity.risk === "HIGH"
      ? "HIGH"
      : capacity.risk === "MEDIUM"
        ? "MEDIUM"
        : "LOW";

  const targetDay = capacity.lowestUtilizationDay;

  return {
    id: "fill-open-capacity",
    title: targetDay
      ? `Fill ${targetDay.label} capacity`
      : "Fill open booking capacity",

    reason: targetDay
      ? `${targetDay.openSlots} ${
          targetDay.openSlots === 1
            ? "appointment slot remains"
            : "appointment slots remain"
        } available on ${targetDay.label}.`
      : `${capacity.weeklyOpenSlots} appointment slots remain available this week.`,

    estimatedImpact: capacity.estimatedOpenRevenue,

    confidence: clamp(
      65 + Math.round(capacity.weeklyUtilizationRate / 4),
      60,
      92,
    ),

    effort: "MEDIUM",
    priority,
    category: "BOOKINGS",

    recommendedAction: capacity.recommendation,

    href: "/availability",
  };
}

function buildBookingRiskAdvice(
  forecast: BookingForecast,
): AdviceCandidate | null {
  if (forecast.risk === "LOW" && forecast.trend !== "DOWN") {
    return null;
  }

  const priority: ExecutiveAdvicePriority =
    forecast.risk === "HIGH" ? "HIGH" : "MEDIUM";

  return {
    id: "stabilize-booking-demand",
    title:
      forecast.risk === "HIGH"
        ? "Stabilize booking demand"
        : "Improve booking utilization",

    reason: forecast.summary,

    estimatedImpact: 0,
    confidence: forecast.confidence,

    effort: "MEDIUM",
    priority,
    category: "BOOKINGS",

    recommendedAction: forecast.recommendation,

    href: "/bookings",
  };
}

function buildInsightAdvice(insight: ExecutiveInsight): AdviceCandidate {
  return {
    id: `insight-${insight.id}`,
    title: insight.title,
    reason: `${insight.explanation} ${insight.impact}`,

    estimatedImpact: 0,

    confidence:
      insight.priority === "HIGH"
        ? 90
        : insight.priority === "MEDIUM"
          ? 80
          : 70,

    effort:
      insight.domain === "FINANCE"
        ? "LOW"
        : insight.domain === "BOOKINGS"
          ? "MEDIUM"
          : "MEDIUM",

    priority: mapInsightPriority(insight.priority),

    category: mapInsightCategory(insight.domain),

    recommendedAction: insight.recommendedAction,

    href: insight.href,
  };
}

export function buildExecutiveAdvisor(
  input: ExecutiveAdvisorInput,
): ExecutiveAdvice[] {
  const candidates: AdviceCandidate[] = [];

  const revenueAdvice = buildRevenueAdvice(input.revenueForecast);

  if (revenueAdvice) {
    candidates.push(revenueAdvice);
  }

  const capacityAdvice = buildCapacityAdvice(input.workspaceCapacity);

  if (capacityAdvice) {
    candidates.push(capacityAdvice);
  }

  const bookingAdvice = buildBookingRiskAdvice(input.bookingForecast);

  if (bookingAdvice) {
    candidates.push(bookingAdvice);
  }

  candidates.push(...input.executiveInsights.map(buildInsightAdvice));

  const uniqueCandidates = Array.from(
    new Map(candidates.map((candidate) => [candidate.id, candidate])).values(),
  );

  if (uniqueCandidates.length === 0) {
    uniqueCandidates.push({
      id: "maintain-business-momentum",
      title: "Maintain business momentum",
      reason:
        "No urgent financial, booking, or operational risks were detected.",

      estimatedImpact: 0,
      confidence: 90,

      effort: "LOW",
      priority: "LOW",
      category: "OPERATIONS",

      recommendedAction:
        "Review today’s schedule and focus on delivering an excellent client experience.",

      href: "/dashboard",
    });
  }

  return uniqueCandidates
    .map((candidate) => ({
      ...candidate,
      score: calculateAdviceScore(candidate),
    }))
    .sort((left, right) => right.score - left.score);
}
