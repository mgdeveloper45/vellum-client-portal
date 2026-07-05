import type { Priority } from "./priority";

export type RecommendationCategory =
  "BOOKING" | "WORKSPACE" | "FINANCE" | "CLIENT" | "GROWTH";

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  href: string;
  category: RecommendationCategory;
};

export function sortRecommendations(recommendations: Recommendation[]) {
  const order = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return [...recommendations].sort(
    (a, b) => order[b.priority] - order[a.priority],
  );
}

export function buildRecommendations(recommendations: Recommendation[]) {
  return sortRecommendations(recommendations);
}
