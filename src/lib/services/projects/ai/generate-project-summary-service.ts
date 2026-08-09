import { askWithPrompt } from "@/lib/services/ai/ai-service";

import {
  buildProjectSummaryPrompt,
  type ProjectSummaryPromptParams,
} from "./project-summary-prompt-builder";

export class GenerateProjectSummaryService {
  async generate(params: ProjectSummaryPromptParams): Promise<string> {
    return askWithPrompt(buildProjectSummaryPrompt(params));
  }
}

export const generateProjectSummaryService =
  new GenerateProjectSummaryService();
