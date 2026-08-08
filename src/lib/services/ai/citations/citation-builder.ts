import type { BusinessContext } from "../conversation/business-context";
import type { Citation } from "./citation";

export function buildBusinessCitations(context: BusinessContext): Citation[] {
  const citations: Citation[] = [
    {
      title: "Executive Score",
      value: context.executiveScore.toString(),
    },
    {
      title: "Revenue Risk",
      value: context.revenueRisk,
    },
    {
      title: "Booking Risk",
      value: context.bookingRisk,
    },
    {
      title: "Capacity Risk",
      value: context.capacityRisk,
    },
    {
      title: "Revenue Collected",
      value: `$${context.revenueCollected.toLocaleString()}`,
    },
    {
      title: "Outstanding Revenue",
      value: `$${context.revenueOutstanding.toLocaleString()}`,
    },
    {
      title: "Upcoming Booking Revenue",
      value: `$${context.upcomingBookingRevenue.toLocaleString()}`,
    },
  ];

  if (context.topAdvice) {
    citations.push({
      title: "Top Recommendation",
      value: context.topAdvice,
    });
  }

  return citations;
}
