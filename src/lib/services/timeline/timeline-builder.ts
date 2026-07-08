import type { Recommendation } from "../intelligence/recommendation";
import type { TimelineEvent } from "./timeline-types";

export function buildTimelineFromRecommendations(
  recommendations: Recommendation[],
): TimelineEvent[] {
  return recommendations.map((recommendation) => ({
    id: recommendation.id,
    type: "SYSTEM",
    title: recommendation.title,
    description: recommendation.description,
    occurredAt: new Date(),
    priority: recommendation.priority,
    metadata: {
      href: recommendation.href,
      category: recommendation.category,
    },
  }));
}
