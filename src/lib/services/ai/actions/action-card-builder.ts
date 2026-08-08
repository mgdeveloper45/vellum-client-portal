import type { AiActionCard } from "./action-card";
import type { AiActionResult } from "./action-result";

export function buildActionCard(
  result: AiActionResult,
): AiActionCard | null {
  if (!result.success || !result.content || !result.title) {
    return null;
  }

  return {
    title: result.title,

    subtitle: result.message,

    content: result.content,

    actions: ["Copy", "Edit"],

    metadata: result.metadata ?? {},
  };
}