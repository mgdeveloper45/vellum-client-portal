import type { DashboardForecastResult } from "./dashboard-forecast-builder";

export type BusinessHealth = "EXCELLENT" | "GOOD" | "WATCH" | "CRITICAL";

export interface ExecutiveIntelligence {
  health: BusinessHealth;

  headline: string;

  strengths: string[];

  risks: string[];

  recommendations: string[];
}

export function buildExecutiveIntelligence(
  dashboard: DashboardForecastResult,
): ExecutiveIntelligence {
  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  //
  // Revenue
  //

  if (dashboard.revenueForecast.risk === "LOW") {
    strengths.push(dashboard.revenueForecast.summary);
  } else {
    risks.push(dashboard.revenueForecast.summary);

    recommendations.push(
      "Review outstanding invoices and improve collections.",
    );
  }

  //
  // Booking
  //

  if (dashboard.bookingForecast.risk === "LOW") {
    strengths.push(dashboard.bookingForecast.summary);
  } else {
    risks.push(dashboard.bookingForecast.summary);

    recommendations.push(dashboard.bookingForecast.recommendation);
  }

  //
  // Capacity
  //

  if (dashboard.workspaceCapacity.risk === "LOW") {
    strengths.push(dashboard.workspaceCapacity.summary);
  } else {
    risks.push(dashboard.workspaceCapacity.summary);

    recommendations.push(dashboard.workspaceCapacity.recommendation);
  }

  //
  // Defaults
  //

  if (strengths.length === 0) {
    strengths.push("Business activity is stable.");
  }

  if (risks.length === 0) {
    risks.push("No significant operational risks detected.");
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Continue executing scheduled work and maintaining client relationships.",
    );
  }

  //
  // Overall Health
  //

  let health: BusinessHealth = "EXCELLENT";

  const highRiskCount = [
    dashboard.revenueForecast.risk,
    dashboard.bookingForecast.risk,
    dashboard.workspaceCapacity.risk,
  ].filter((risk) => risk === "HIGH").length;

  const mediumRiskCount = [
    dashboard.revenueForecast.risk,
    dashboard.bookingForecast.risk,
    dashboard.workspaceCapacity.risk,
  ].filter((risk) => risk === "MEDIUM").length;

  if (highRiskCount >= 2) {
    health = "CRITICAL";
  } else if (highRiskCount === 1) {
    health = "WATCH";
  } else if (mediumRiskCount > 0) {
    health = "GOOD";
  }

  return {
    health,
    headline: "Executive Business Intelligence",
    strengths,
    risks,
    recommendations,
  };
}
