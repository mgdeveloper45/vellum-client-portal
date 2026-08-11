"use server";

import type { AiGeneratedDocument } from "@/lib/services/ai/actions/action-types";
import type { AiActionType } from "@/lib/services/ai/actions/action";
import { requireDashboardUser } from "@/lib/dashboard/dashboard-loader";
import { getDashboardQuery } from "@/lib/queries/dashboard/get-dashboard-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { planCopilotAction } from "@/lib/services/ai/actions/copilot-action-planner-service";
import { buildCopilotResponse } from "@/lib/services/copilot/copilot-service";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { executeBookingCommand } from "@/lib/services/ai/actions/execute-booking-command";
import { executeInvoiceReminderAction } from "@/lib/services/ai/actions/execute-invoice-reminder-action";
import { executeProjectStatusUpdateAction } from "@/lib/services/ai/actions/execute-project-status-update-action";

export type AICommandResult =
  | {
      type: "ANSWER";
      message: string;
      document?: AiGeneratedDocument;
      metadata?: AICommandExecutionMetadata;
    }
  | {
      type: "CONFIRMATION";
      action: AiActionType;
      message: string;
      command: string;
    };

export interface AICommandExecutionMetadata {
  bookingId?: string;
  serviceId?: string;
  clientId?: string;
  projectId?: string;
  date?: string;
  startTime?: string;
  status?: string;
}

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
      command: query,
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

export type ConfirmAICommandResult =
  | {
      success: true;
      message: string;
      document?: AiGeneratedDocument;
      metadata?: AICommandExecutionMetadata;
    }
  | {
      success: false;
      message: string;
    };

export async function confirmAICommandAction(
  command: string,
): Promise<ConfirmAICommandResult> {
  const query = command.trim();

  if (!query) {
    return {
      success: false,
      message: "The command could not be confirmed.",
    };
  }

  const user = await requireDashboardUser();

  if (!user) {
    return {
      success: false,
      message: "Please sign in.",
    };
  }

  const workspaceId = await getCurrentUserWorkspaceQuery(user.id);

  if (!workspaceId) {
    return {
      success: false,
      message: "Workspace not found.",
    };
  }

  const actionPlan = planCopilotAction(query);

  if (!actionPlan.handled) {
    return {
      success: false,
      message: "No executable action was found.",
    };
  }

  if (actionPlan.action === "DRAFT_EMAIL") {
    const invoiceReminderResult =
      await executeInvoiceReminderAction(workspaceId);

    if (invoiceReminderResult.success === false) {
      return {
        success: false,
        message: invoiceReminderResult.message,
      };
    }

    return {
      success: true,
      message: "Invoice reminder draft generated.",
      document: invoiceReminderResult.document,
    };
  }

  if (actionPlan.action === "CREATE_BOOKING") {
    const bookingResult = await executeBookingCommand(query, workspaceId);

    if (bookingResult.success === false) {
      return {
        success: false,
        message: bookingResult.message,
      };
    }

    return {
      success: true,
      message: bookingResult.message,
      metadata: bookingResult.metadata,
    };
  }

  if (actionPlan.action === "UPDATE_PROJECT") {
    const projectResult = await executeProjectStatusUpdateAction({
      workspaceId,
      userId: user.id,
      command: query,
    });

    if (projectResult.success === false) {
      return {
        success: false,
        message: projectResult.message,
      };
    }

    return {
      success: true,
      message: projectResult.message,
      metadata: projectResult.metadata,
    };
  }

  return {
    success: false,
    message: `Confirmed ${actionPlan.action}, but execution is not enabled for this action yet.`,
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
