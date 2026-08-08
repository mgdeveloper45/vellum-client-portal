import type { BusinessContext } from "./business-context";

export interface EvidenceItem {
  label: string;
  value: string;
}

export function buildEvidence(context: BusinessContext): EvidenceItem[] {
  return [
    {
      label: "Executive Score",
      value: context.executiveScore.toString(),
    },

    {
      label: "Revenue Risk",
      value: context.revenueRisk,
    },

    {
      label: "Booking Risk",
      value: context.bookingRisk,
    },

    {
      label: "Capacity Risk",
      value: context.capacityRisk,
    },

    {
      label: "Revenue Collected",
      value: `$${context.revenueCollected.toLocaleString()}`,
    },

    {
      label: "Outstanding Revenue",
      value: `$${context.revenueOutstanding.toLocaleString()}`,
    },

    {
      label: "Upcoming Revenue",
      value: `$${context.upcomingBookingRevenue.toLocaleString()}`,
    },

    {
      label: "Top Recommendation",
      value: context.topAdvice ?? "No recommendation available.",
    },
  ];
}
