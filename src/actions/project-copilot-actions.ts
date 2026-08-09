"use server";

import {
  generateProjectStatusAction,
  generateProjectSummaryAction,
} from "@/actions/project-ai-actions";
import { routeCopilotIntent } from "@/lib/services/copilot/copilot-intent-router";

export interface RunProjectCopilotInput {
  projectId: string;
  query: string;
}

export type RunProjectCopilotResult =
  | {
      success: true;
      content: string;
    }
  | {
      success: false;
      error: string;
    };

export async function runProjectCopilotAction({
  projectId,
  query,
}: RunProjectCopilotInput): Promise<RunProjectCopilotResult> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      success: false,
      error: "Enter a question or command.",
    };
  }

  const routedIntent = routeCopilotIntent(normalizedQuery);

  switch (routedIntent.intent) {
    case "PROJECT_SUMMARY": {
      return generateProjectSummaryAction(projectId);
    }

    case "PROJECT_STATUS": {
      return generateProjectStatusAction(projectId);
    }

    case "PROPOSAL": {
      return {
        success: false,
        error:
          "Use the proposal generator below to provide pricing, timeline, and project details.",
      };
    }

    case "ANSWER":
    default:
      return {
        success: false,
        error: "Ask for an executive summary, project status, or proposal.",
      };
  }
}
