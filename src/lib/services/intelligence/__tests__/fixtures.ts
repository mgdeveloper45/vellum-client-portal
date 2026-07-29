import type { BookingForecast } from "../forecasting/booking-forecast-engine";
import type { RevenueForecast } from "../forecasting/revenue-forecast-engine";
import type {
  WorkspaceCapacity,
  WorkspaceCapacityDayResult,
} from "../capacity/workspace-capacity-engine";
import type { ExecutiveInsight } from "../executive-intelligence-engine";


export function createRevenueForecast(
  overrides: Partial<RevenueForecast> = {},
): RevenueForecast {
  return {
    projectedRevenue: 100_000,
    expectedCollections: 20_000,
    revenueAtRisk: 0,
    confidence: 95,
    trend: "UP",
    risk: "LOW",
    summary: "Revenue is healthy.",
    ...overrides,
  };
}

export function createBookingForecast(
  overrides: Partial<BookingForecast> = {},
): BookingForecast {
  return {
    utilizationToday: 90,
    utilizationTomorrow: 85,
    utilizationWeek: 90,
    availableCapacityToday: 1,
    availableCapacityTomorrow: 2,
    availableCapacityWeek: 5,
    peakDayLabel: "Friday",
    peakDayUtilization: 100,
    trend: "UP",
    risk: "LOW",
    confidence: 95,
    summary: "Bookings are healthy.",
    recommendation: "Maintain booking momentum.",
    ...overrides,
  };
}

function createDay(
  overrides: Partial<WorkspaceCapacityDayResult> = {},
): WorkspaceCapacityDayResult {
  return {
    label: "Monday",
    capacity: 10,
    bookings: 9,
    openSlots: 1,
    utilizationRate: 90,
    estimatedOpenRevenue: 150,
    ...overrides,
  };
}

export function createWorkspaceCapacity(
  overrides: Partial<WorkspaceCapacity> = {},
): WorkspaceCapacity {
  const today = createDay({
    label: "Today",
  });

  const tomorrow = createDay({
    label: "Tomorrow",
  });

  return {
    today,
    tomorrow,
    weeklyCapacity: 70,
    weeklyBookings: 63,
    weeklyOpenSlots: 7,
    weeklyUtilizationRate: 90,
    estimatedOpenRevenue: 1_050,
    lowestUtilizationDay: tomorrow,
    highestUtilizationDay: today,
    constrained: false,
    risk: "LOW",
    summary: "Workspace utilization is healthy.",
    recommendation: "Maintain schedule.",
    days: [today, tomorrow],
    ...overrides,
  };
}

export function createInsight(
  overrides: Partial<ExecutiveInsight> = {},
): ExecutiveInsight {
  return {
    id: crypto.randomUUID(),
    domain: "FINANCE",
    priority: "HIGH",
    title: "Recover outstanding revenue",
    explanation: "Outstanding invoices require follow-up.",
    impact: "Cash flow may decline.",
    recommendedAction: "Review overdue invoices.",
    href: "/dashboard",
    ...overrides,
  };
}

export function createInsights(
  count: number,
  priority: ExecutiveInsight["priority"] = "HIGH",
): ExecutiveInsight[] {
  return Array.from({ length: count }, (_, index) =>
    createInsight({
      id: `insight-${index}`,
      priority,
    }),
  );
}
import type {
  ExecutiveAdvice,
} from "../executive-advisor/executive-advisor-engine";

export function createAdvice(
  overrides: Partial<ExecutiveAdvice> = {},
): ExecutiveAdvice {
  return {
    id: "fill-open-capacity",
    title: "Fill open booking capacity",
    reason: "Open appointment slots remain available.",
    estimatedImpact: 0,
    confidence: 85,
    effort: "MEDIUM",
    priority: "MEDIUM",
    category: "BOOKINGS",
    recommendedAction: "Increase booking demand.",
    href: "/availability",
    score: 50,
    ...overrides,
  };
}