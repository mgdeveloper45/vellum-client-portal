"use server";

import { requireDashboardUser } from "@/lib/dashboard/dashboard-loader";
import { getDashboardQuery } from "@/lib/queries/dashboard/get-dashboard-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { buildCopilotResponse } from "@/lib/services/copilot/copilot-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";

export async function runAICommandAction(input: string): Promise<string> {
  const query = input.trim();

  if (!query) {
    return "Enter a question or command.";
  }

  const user = await requireDashboardUser();

  if (!user) {
    return "Please sign in.";
  }

  const workspaceId = await getCurrentUserWorkspaceQuery(user.id);

  if (!workspaceId) {
    return "Workspace not found.";
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

  return formatCopilotResponse(response);
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
