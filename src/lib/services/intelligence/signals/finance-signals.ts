import {
  COLLECTION_RATE_CRITICAL,
  COLLECTION_RATE_TARGET,
  OUTSTANDING_REVENUE_CRITICAL,
  OUTSTANDING_REVENUE_HIGH,
} from "./finance-thresholds";
import type { SignalProducer } from "./signal-producer";
import type { BusinessSignal } from "./signal-types";

export interface FinanceSignalInput {
  totalRevenue: number;
  outstandingRevenue: number;
  paidInvoices: number;
  totalInvoices: number;
  overdueInvoices: number;
}

function createFinanceSignals({
  totalRevenue,
  outstandingRevenue,
  paidInvoices,
  totalInvoices,
  overdueInvoices,
}: FinanceSignalInput): readonly BusinessSignal[] {
  const signals: BusinessSignal[] = [];

  const collectionRate =
    totalInvoices === 0
      ? 100
      : Math.round((paidInvoices / totalInvoices) * 100);

  if (outstandingRevenue >= OUTSTANDING_REVENUE_HIGH) {
    signals.push({
      id: "finance-outstanding-revenue",
      category: "FINANCE",
      severity:
        outstandingRevenue >= OUTSTANDING_REVENUE_CRITICAL
          ? "CRITICAL"
          : "HIGH",
      title: "Outstanding revenue exceeds target",
      description: `$${outstandingRevenue.toLocaleString(
        "en-US",
      )} remains unpaid.`,
      recommendation:
        "Prioritize collection of the highest-value unpaid invoices.",
      impact: Math.min(100, Math.round(outstandingRevenue / 500)),
      urgency: overdueInvoices >= 10 ? 90 : 70,
      confidence: 95,
      metadata: {
        outstandingRevenue,
        overdueInvoices,
      },
    });
  }

  if (collectionRate < COLLECTION_RATE_TARGET) {
    signals.push({
      id: "finance-collection-rate",
      category: "FINANCE",
      severity: collectionRate < COLLECTION_RATE_CRITICAL ? "CRITICAL" : "HIGH",
      title: "Collection rate below target",
      description: `Current collection rate is ${collectionRate}%.`,
      recommendation: "Review payment follow-up and outstanding receivables.",
      impact: 80,
      urgency: 75,
      confidence: 90,
      metadata: {
        collectionRate,
      },
    });
  }

  if (totalRevenue > 0 && outstandingRevenue === 0) {
    signals.push({
      id: "finance-healthy-cash-flow",
      category: "FINANCE",
      severity: "LOW",
      title: "Healthy cash flow",
      description: "All recorded revenue has been collected.",
      recommendation: "Continue current invoicing and collection practices.",
      impact: 20,
      urgency: 10,
      confidence: 95,
    });
  }

  return Object.freeze(signals);
}

/**
 * Standard producer implementation used by the business-signal
 * orchestration layer.
 */
export const financeSignalProducer: SignalProducer<FinanceSignalInput> =
  Object.freeze({
    build: createFinanceSignals,
  });

/**
 * Backward-compatible functional API.
 *
 * Existing consumers and tests may continue using this function while
 * orchestration code uses financeSignalProducer directly.
 */
export function buildFinanceSignals(
  input: FinanceSignalInput,
): readonly BusinessSignal[] {
  return financeSignalProducer.build(input);
}
