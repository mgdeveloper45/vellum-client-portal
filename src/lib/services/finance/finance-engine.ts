import { calculateCashFlow } from "./finance-cash-flow";
import { calculateRevenueForecast } from "./finance-forecast";
import { calculateFinanceHealth } from "./finance-health";
import type { FinanceProfile } from "./finance-types";
import { calculateCollections } from "./finance-collections";
import { calculateFinanceOpportunities } from "./finance-opportunities";

export function buildFinanceEngine(profile: FinanceProfile) {
  const health = calculateFinanceHealth(profile);

  const cashFlow = calculateCashFlow(profile);

  const forecast = calculateRevenueForecast(profile);

  const collections = calculateCollections(profile);

  const opportunities = calculateFinanceOpportunities(profile);

  return {
    health,
    cashFlow,
    forecast,
    collections,
    opportunities,
  };
}
