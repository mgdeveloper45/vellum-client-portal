import { buildRecommendations, type Recommendation } from "./recommendation";

export type ExecutiveInboxItem = Recommendation;

export function buildExecutiveInbox(items: ExecutiveInboxItem[]) {
  return buildRecommendations(items);
}
