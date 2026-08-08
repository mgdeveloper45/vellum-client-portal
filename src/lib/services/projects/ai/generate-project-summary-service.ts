import { askWithPrompt } from "@/lib/services/ai/ai-service";

import {
  buildProjectSummaryPrompt,
  type ProjectSummaryPromptParams, 
} from "./project-summary-prompt-builder";

export class GenerateProjectSummaryService {
  async generate(
    params: ProjectSummaryPromptParams,
  ): Promise<string> {
    const prompt = buildProjectSummaryPrompt(params);

    return askWithPrompt(prompt);
  }
}



