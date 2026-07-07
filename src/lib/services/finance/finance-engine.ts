import { calculateCashFlow } from "./finance-cash-flow";
import { calculateRevenueForecast } from "./finance-forecast";
import { calculateFinanceHealth } from "./finance-health";
import type { FinanceProfile } from "./finance-types";
import { calculateCollections } from "./finance-collections";
import { calculateFinanceOpportunities } from "./finance-opportunities";
import {
  buildRecommendationEngine,
} from "../intelligence/recommendation-engine";

import type {
  Recommendation,
} from "../intelligence/recommendation";

export function buildFinanceEngine(profile: FinanceProfile) {
  const health = calculateFinanceHealth(profile);

  const cashFlow = calculateCashFlow(profile);

  const forecast = calculateRevenueForecast(profile);

  const collections = calculateCollections(profile);

  const opportunities = calculateFinanceOpportunities(profile);

  const recommendations: Recommendation[] =
  opportunities.map((opportunity) => ({
    id: `finance-${opportunity.title}`,
    title: opportunity.title,
    description: opportunity.description,
    priority: opportunity.priority,
    href: "/invoices",
    category: "FINANCE",
  }));

  const executiveInbox =
  buildRecommendationEngine(recommendations);

  return {
    health,
    cashFlow,
    forecast,
    collections,
    opportunities,
    recommendations: executiveInbox,
  };
}
