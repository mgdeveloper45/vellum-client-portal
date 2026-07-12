export type RevenueForecastTrend = "UP" | "STABLE" | "DOWN";

export type RevenueForecastRisk = "LOW" | "MEDIUM" | "HIGH";

export type RevenueForecast = {
  projectedRevenue: number;
  expectedCollections: number;
  revenueAtRisk: number;
  confidence: number;
  trend: RevenueForecastTrend;
  risk: RevenueForecastRisk;
  summary: string;
};

export type RevenueForecastInput = {
  revenueCollected: number;
  outstandingRevenue: number;
  overdueRevenue: number;
  paidInvoices: number;
  totalInvoices: number;
  upcomingBookingRevenue: number;
  previousPeriodRevenue: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function calculateCollectionRate({
  paidInvoices,
  totalInvoices,
}: Pick<RevenueForecastInput, "paidInvoices" | "totalInvoices">) {
  if (totalInvoices === 0) {
    return 1;
  }

  return clamp(paidInvoices / totalInvoices, 0, 1);
}

function calculateTrend(
  projectedRevenue: number,
  previousPeriodRevenue: number,
): RevenueForecastTrend {
  if (previousPeriodRevenue <= 0) {
    return projectedRevenue > 0 ? "UP" : "STABLE";
  }

  const change =
    (projectedRevenue - previousPeriodRevenue) / previousPeriodRevenue;

  if (change >= 0.05) {
    return "UP";
  }

  if (change <= -0.05) {
    return "DOWN";
  }

  return "STABLE";
}

function calculateRisk({
  revenueAtRisk,
  outstandingRevenue,
  collectionRate,
}: {
  revenueAtRisk: number;
  outstandingRevenue: number;
  collectionRate: number;
}): RevenueForecastRisk {
  if (
    collectionRate < 0.6 ||
    (outstandingRevenue > 0 && revenueAtRisk / outstandingRevenue >= 0.5)
  ) {
    return "HIGH";
  }

  if (collectionRate < 0.8 || revenueAtRisk > 0) {
    return "MEDIUM";
  }

  return "LOW";
}

function calculateConfidence({
  collectionRate,
  totalInvoices,
  upcomingBookingRevenue,
}: {
  collectionRate: number;
  totalInvoices: number;
  upcomingBookingRevenue: number;
}) {
  const invoiceHistoryScore = Math.min(totalInvoices, 20) * 1.5;

  const bookingPipelineScore = upcomingBookingRevenue > 0 ? 10 : 0;

  return Math.round(
    clamp(
      55 + collectionRate * 20 + invoiceHistoryScore + bookingPipelineScore,
      55,
      95,
    ),
  );
}

export function buildRevenueForecast(
  input: RevenueForecastInput,
): RevenueForecast {
  const collectionRate = calculateCollectionRate(input);

  const collectableOutstandingRevenue = Math.max(
    0,
    input.outstandingRevenue - input.overdueRevenue,
  );

  const expectedOutstandingCollections =
    collectableOutstandingRevenue * collectionRate;

  const expectedOverdueCollections =
    input.overdueRevenue * collectionRate * 0.5;

  const expectedCollections = Math.round(
    expectedOutstandingCollections + expectedOverdueCollections,
  );

  const revenueAtRisk = Math.round(
    Math.max(0, input.outstandingRevenue - expectedCollections),
  );

  const projectedRevenue = Math.round(
    input.revenueCollected + expectedCollections + input.upcomingBookingRevenue,
  );

  const trend = calculateTrend(projectedRevenue, input.previousPeriodRevenue);

  const risk = calculateRisk({
    revenueAtRisk,
    outstandingRevenue: input.outstandingRevenue,
    collectionRate,
  });

  const confidence = calculateConfidence({
    collectionRate,
    totalInvoices: input.totalInvoices,
    upcomingBookingRevenue: input.upcomingBookingRevenue,
  });

  const summary =
    risk === "HIGH"
      ? "Revenue performance is exposed to collection risk. Prioritize overdue invoices and protect upcoming booking revenue."
      : trend === "UP"
        ? "Revenue is projected to improve, supported by expected collections and upcoming bookings."
        : trend === "DOWN"
          ? "Revenue is projected below the previous period. Review collections, availability, and booking demand."
          : "Revenue is projected to remain stable based on current collections and booking activity.";

  return {
    projectedRevenue,
    expectedCollections,
    revenueAtRisk,
    confidence,
    trend,
    risk,
    summary,
  };
}
