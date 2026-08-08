import { askWithPrompt } from "@/lib/services/ai/ai-service";

import {
  buildProjectStatusPrompt,
  type ProjectStatusPromptParams,
} from "./project-status-prompt-builder";

export class GenerateProjectStatusService {
  async generate(
    params: ProjectStatusPromptParams,
  ): Promise<string> {
    const prompt = buildProjectStatusPrompt(params);

    return askWithPrompt(prompt);
  }
}