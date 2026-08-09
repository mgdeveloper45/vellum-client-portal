import { askWithPrompt } from "@/lib/services/ai/ai-service";

import {
  buildProjectStatusPrompt,
  type ProjectStatusPromptParams,
} from "./project-status-prompt-builder";

export class GenerateProjectStatusService {
  async generate(params: ProjectStatusPromptParams): Promise<string> {
    return askWithPrompt(buildProjectStatusPrompt(params));
  }
}

export const generateProjectStatusService = new GenerateProjectStatusService();
