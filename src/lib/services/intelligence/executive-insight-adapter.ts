import type {
  ExecutiveInsight,
  ExecutiveInsightDomain,
  ExecutiveInsightPriority,
} from "./executive-intelligence-engine";

import type { Recommendation, RecommendationCategory } from "./recommendation";

function mapPriority(
  priority: ExecutiveInsightPriority,
): Recommendation["priority"] {
  switch (priority) {
    case "HIGH":
      return "HIGH";

    case "MEDIUM":
      return "MEDIUM";

    default:
      return "LOW";
  }
}

function mapCategory(domain: ExecutiveInsightDomain): RecommendationCategory {
  switch (domain) {
    case "FINANCE":
      return "FINANCE";

    case "CLIENTS":
      return "CLIENT";

    case "BOOKINGS":
      return "BOOKING";

    case "PROJECTS":
      return "WORKSPACE";

    case "WORKSPACE":
      return "WORKSPACE";
  }
}

export function adaptExecutiveInsights(
  insights: ExecutiveInsight[],
): Recommendation[] {
  return insights.map((insight) => ({
    id: insight.id,

    title: insight.title,

    description: insight.explanation,

    priority: mapPriority(insight.priority),

    href: insight.href,

    category: mapCategory(insight.domain),
  }));
}
