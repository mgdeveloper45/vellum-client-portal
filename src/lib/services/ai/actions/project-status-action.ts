import { askWithPrompt } from "../ai-service";
import { buildProjectStatusPrompt } from "../prompts/project-status-prompt-builder";

import type { AiActionResult } from "./action-types";

export interface ProjectStatusActionParams {
  projectName: string;
  clientName: string;
  currentStatus: string;
  completedWork: string[];
  upcomingWork: string[];
  risks: string[];
}

export async function generateProjectStatusAction(
  params: ProjectStatusActionParams,
): Promise<AiActionResult> {
  const prompt = buildProjectStatusPrompt(params);

  const content = await askWithPrompt(prompt);

  return {
    type: "EMAIL",
    title: `${params.projectName} Project Update`,
    preview: content.length > 180 ? `${content.slice(0, 180)}...` : content,
    content,
    metadata: {
      clientName: params.clientName,
      projectName: params.projectName,
      status: params.currentStatus,
    },
  };
}
