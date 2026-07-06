import type { Recommendation } from "@/lib/services/intelligence/recommendation";
import type { ClientProfile } from "./client-types";
import {
  calculateAverageBookingValue,
  calculateLifetimeValue,
} from "./client-lifetime-value";
import { calculateClientHealth } from "./client-health";
import { calculateClientOpportunities } from "./client-opportunities";
import { calculateClientRetention } from "./client-retention";

export function buildClientEngine(client: ClientProfile) {
  const lifetimeValue = calculateLifetimeValue(client);
  const averageBookingValue = calculateAverageBookingValue(client);
  const health = calculateClientHealth(client);
  const retention = calculateClientRetention(client);
  const opportunities = calculateClientOpportunities(client);

  const recommendations: Recommendation[] = opportunities.map(
    (opportunity) => ({
      id: `client-${client.id}-${opportunity.type}`,
      title: opportunity.title,
      description: `${client.name}: ${opportunity.description}`,
      priority: opportunity.priority,
      href: `/clients/${client.id}`,
      category: "CLIENT",
    }),
  );

  return {
    lifetimeValue,
    averageBookingValue,
    health,
    retention,
    opportunities,
    recommendations,
    summary:
      health.status === "EXCELLENT"
        ? "Excellent long-term client with strong engagement and revenue."
        : health.status === "GOOD"
          ? "Healthy client relationship with growth opportunities."
          : health.status === "ATTENTION"
            ? "Client relationship needs attention to prevent churn."
            : "High retention risk. Immediate outreach is recommended.",
  };
}
