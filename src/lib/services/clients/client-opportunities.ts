import type { ClientOpportunity, ClientProfile } from "./client-types";
import { calculateClientRetention } from "./client-retention";

export type ClientOpportunityResult = {
  type: ClientOpportunity;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

export function calculateClientOpportunities(
  client: ClientProfile,
): ClientOpportunityResult[] {
  const opportunities: ClientOpportunityResult[] = [];

  const retention = calculateClientRetention(client);

  if (retention.risk === "HIGH") {
    opportunities.push({
      type: "REBOOK",
      title: "Win Back Client",
      description: "The client has not booked recently.",
      priority: "HIGH",
    });
  }

  if (client.totalBookings >= 5) {
    opportunities.push({
      type: "REFERRAL",
      title: "Request Referral",
      description: "Loyal clients are great referral sources.",
      priority: "MEDIUM",
    });
  }

  if (client.totalRevenue >= 1000) {
    opportunities.push({
      type: "UPSELL",
      title: "Offer Premium Service",
      description: "This client has strong lifetime value.",
      priority: "MEDIUM",
    });
  }

  if (client.totalBookings >= 3) {
    opportunities.push({
      type: "REVIEW",
      title: "Request Review",
      description: "Ask the client to leave a review.",
      priority: "LOW",
    });
  }

  return opportunities;
}
