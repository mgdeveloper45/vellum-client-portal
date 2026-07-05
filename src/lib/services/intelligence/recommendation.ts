import type { Priority } from "./priority";

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  action: string;
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
