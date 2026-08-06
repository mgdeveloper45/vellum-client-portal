export type ConversationIntent =
  | "NEW_QUESTION"
  | "FOLLOW_UP"
  | "CLARIFICATION"
  | "COMPARISON"
  | "EXPANSION"
  | "ACTION";

const FOLLOW_UP = ["why", "why?", "continue"];

const CLARIFICATION = ["explain", "explain that", "clarify"];

const COMPARISON = ["compare", "compared", "versus", "vs"];

const EXPANSION = ["tell me more", "more", "expand", "elaborate"];

const ACTION = ["what should i do", "next step", "recommend", "advice"];

export function classifyConversationIntent(
  question: string,
): ConversationIntent {
  const normalized = question
    .trim()
    .toLowerCase()
    .replace(/[?!.,]+$/g, "");

  if (
    FOLLOW_UP.some(
      (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
    )
  ) {
    return "FOLLOW_UP";
  }

  if (
    CLARIFICATION.some(
      (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
    )
  ) {
    return "CLARIFICATION";
  }

  if (
    COMPARISON.some(
      (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
    )
  ) {
    return "COMPARISON";
  }

  if (
    EXPANSION.some(
      (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
    )
  ) {
    return "EXPANSION";
  }

  if (
    ACTION.some(
      (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
    )
  ) {
    return "ACTION";
  }

  return "NEW_QUESTION";
}
