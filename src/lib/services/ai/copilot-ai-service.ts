import { askCopilot } from "./ai-service";
import { buildBusinessContext } from "./conversation/business-context";

import type { CopilotContext } from "@/lib/services/copilot/copilot-context-builder";

export interface CopilotAiResponse {
  answer: string;
}

export async function buildCopilotAiResponse(
  context: CopilotContext,
  question: string,
): Promise<CopilotAiResponse> {
  const businessContext = buildBusinessContext(context);

  const answer = await askCopilot(businessContext, question);

  return {
    answer,
  };
}
