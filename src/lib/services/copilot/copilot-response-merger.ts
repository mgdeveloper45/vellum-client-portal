import type { CopilotResponse } from "./copilot-service";

export interface MergedCopilotResponse {
  answer: string;

  evidence: string[];

  suggestedActions: string[];
}

export function mergeCopilotResponses(
  responses: CopilotResponse[],
): MergedCopilotResponse {
  return {
    answer: responses.map((response) => response.answer).join("\n\n"),

    evidence: Array.from(
      new Set(responses.flatMap((response) => response.evidence)),
    ),

    suggestedActions: Array.from(
      new Set(responses.flatMap((response) => response.suggestedActions)),
    ),
  };
}
