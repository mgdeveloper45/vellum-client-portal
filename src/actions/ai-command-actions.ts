"use server";
import type { AiActionType } from "@/lib/services/ai/actions/action";
import { requireDashboardUser } from "@/lib/dashboard/dashboard-loader";
import { getDashboardQuery } from "@/lib/queries/dashboard/get-dashboard-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { planCopilotAction } from "@/lib/services/ai/actions/copilot-action-planner-service";
import { buildCopilotResponse } from "@/lib/services/copilot/copilot-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";

export type AICommandResult =
  | {
      type: "ANSWER";
      message: string;
    }
  | {
      type: "CONFIRMATION";
      action: AiActionType;
      message: string;
    };

export async function runAICommandAction(
  input: string,
): Promise<AICommandResult> {
  const query = input.trim();

  if (!query) {
    return {
      type: "ANSWER",
      message: "Enter a question or command.",
    };
  }

  const user = await requireDashboardUser();

  if (!user) {
    return {
      type: "ANSWER",
      message: "Please sign in.",
    };
  }

  const workspaceId = await getCurrentUserWorkspaceQuery(user.id);

  if (!workspaceId) {
    return {
      type: "ANSWER",
      message: "Workspace not found.",
    };
  }

  const actionPlan = planCopilotAction(query);

  if (actionPlan.handled) {
    return {
      type: "CONFIRMATION",
      action: actionPlan.action,
      message: actionPlan.message,
    };
  }

  const dashboardData = await getDashboardQuery({
    userId: user.id,
    userRole: user.role,
    workspaceId,
  });

  const dashboard = await buildDashboard({
    data: dashboardData,
  });

  const response = buildCopilotResponse(dashboard, query);

  return {
    type: "ANSWER",
    message: formatCopilotResponse(response),
  };
}

function formatCopilotResponse(
  response: ReturnType<typeof buildCopilotResponse>,
): string {
  const sections = [response.answer];

  if (response.evidence.length > 0) {
    sections.push(
      ["Evidence", ...response.evidence.map((item) => `• ${item}`)].join("\n"),
    );
  }

  if (response.suggestedActions.length > 0) {
    sections.push(
      [
        "Suggested Actions",
        ...response.suggestedActions.map((action) => `• ${action}`),
      ].join("\n"),
    );
  }

  return sections.join("\n\n");
}
