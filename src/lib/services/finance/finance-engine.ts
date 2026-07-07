import { calculateCashFlow } from "./finance-cash-flow";
import { calculateRevenueForecast } from "./finance-forecast";
import { calculateFinanceHealth } from "./finance-health";
import type { FinanceProfile } from "./finance-types";
import { calculateCollections } from "./finance-collections";

export function buildFinanceEngine(profile: FinanceProfile) {
  const health = calculateFinanceHealth(profile);

  const cashFlow = calculateCashFlow(profile);

  const forecast = calculateRevenueForecast(profile);

  const collections = calculateCollections(profile);

  return {
    health,
    cashFlow,
    forecast,
    collections,
  };
}
