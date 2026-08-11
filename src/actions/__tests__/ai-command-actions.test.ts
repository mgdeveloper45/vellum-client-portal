import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  confirmAICommandAction,
  runAICommandAction,
} from "../ai-command-actions";

import { requireDashboardUser } from "@/lib/dashboard/dashboard-loader";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { planCopilotAction } from "@/lib/services/ai/actions/copilot-action-planner-service";
import { executeBookingCommand } from "@/lib/services/ai/actions/execute-booking-command";
import { executeInvoiceReminderAction } from "@/lib/services/ai/actions/execute-invoice-reminder-action";
import { executeProjectStatusUpdateAction } from "@/lib/services/ai/actions/execute-project-status-update-action";

vi.mock("@/lib/dashboard/dashboard-loader", () => ({
  requireDashboardUser: vi.fn(),
}));

vi.mock("@/lib/queries/users/get-current-user-workspace-query", () => ({
  getCurrentUserWorkspaceQuery: vi.fn(),
}));

vi.mock("@/lib/services/ai/actions/copilot-action-planner-service", () => ({
  planCopilotAction: vi.fn(),
}));

vi.mock("@/lib/services/ai/actions/execute-invoice-reminder-action", () => ({
  executeInvoiceReminderAction: vi.fn(),
}));

vi.mock("@/lib/services/ai/actions/execute-booking-command", () => ({
  executeBookingCommand: vi.fn(),
}));

vi.mock("@/lib/queries/dashboard/get-dashboard-query", () => ({
  getDashboardQuery: vi.fn(),
}));

vi.mock("@/lib/services/dashboard/dashboard-builder", () => ({
  buildDashboard: vi.fn(),
}));

vi.mock("@/lib/services/copilot/copilot-service", () => ({
  buildCopilotResponse: vi.fn(),
}));

vi.mock(
  "@/lib/services/ai/actions/execute-project-status-update-action",
  () => ({
    executeProjectStatusUpdateAction: vi.fn(),
  }),
);

const mockedRequireDashboardUser = vi.mocked(requireDashboardUser);

const mockedGetCurrentUserWorkspaceQuery = vi.mocked(
  getCurrentUserWorkspaceQuery,
);

const mockedPlanCopilotAction = vi.mocked(planCopilotAction);

const mockedExecuteInvoiceReminderAction = vi.mocked(
  executeInvoiceReminderAction,
);

const mockedExecuteProjectStatusUpdateAction = vi.mocked(
  executeProjectStatusUpdateAction,
);

const mockedExecuteBookingCommand = vi.mocked(executeBookingCommand);

describe("ai-command-actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mockedRequireDashboardUser.mockResolvedValue({
      id: "user-1",
      role: "OWNER",
    } as Awaited<ReturnType<typeof requireDashboardUser>>);

    mockedGetCurrentUserWorkspaceQuery.mockResolvedValue("workspace-1");
  });

  describe("runAICommandAction", () => {
    it("returns an answer for an empty command", async () => {
      const result = await runAICommandAction("   ");

      expect(result).toEqual({
        type: "ANSWER",
        message: "Enter a question or command.",
      });

      expect(mockedRequireDashboardUser).not.toHaveBeenCalled();
    });

    it("returns a confirmation for an executable action", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "DRAFT_EMAIL",
        message:
          'I can perform the action "DRAFT_EMAIL". Would you like me to continue?',
        requiresConfirmation: true,
      });

      const result = await runAICommandAction("Send an invoice reminder.");

      expect(result).toEqual({
        type: "CONFIRMATION",
        action: "DRAFT_EMAIL",
        message:
          'I can perform the action "DRAFT_EMAIL". Would you like me to continue?',
        command: "Send an invoice reminder.",
      });
    });
  });

  describe("confirmAICommandAction", () => {
    it("generates an invoice reminder after confirmation", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "DRAFT_EMAIL",
        message: "Confirmation required.",
        requiresConfirmation: true,
      });

      mockedExecuteInvoiceReminderAction.mockResolvedValue({
        success: true,
        document: {
          type: "EMAIL",
          title: "Invoice Reminder • INV-0001",
          preview: "Hello Client...",
          content: "Hello Client, this is a payment reminder.",
          metadata: {
            invoiceId: "INV-0001",
          },
        },
      });

      const result = await confirmAICommandAction("Send an invoice reminder.");

      expect(mockedExecuteInvoiceReminderAction).toHaveBeenCalledWith(
        "workspace-1",
      );

      expect(result).toEqual({
        success: true,
        message: "Invoice reminder draft generated.",
        document: {
          type: "EMAIL",
          title: "Invoice Reminder • INV-0001",
          preview: "Hello Client...",
          content: "Hello Client, this is a payment reminder.",
          metadata: {
            invoiceId: "INV-0001",
          },
        },
      });
    });

    it("returns the invoice execution failure", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "DRAFT_EMAIL",
        message: "Confirmation required.",
        requiresConfirmation: true,
      });

      mockedExecuteInvoiceReminderAction.mockResolvedValue({
        success: false,
        message: "No unpaid invoices found.",
      });

      const result = await confirmAICommandAction("Send an invoice reminder.");

      expect(result).toEqual({
        success: false,
        message: "No unpaid invoices found.",
      });
    });

    it("returns missing booking information for an incomplete confirmed booking", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "CREATE_BOOKING",
        message: "Confirmation required.",
        requiresConfirmation: true,
      });

      mockedExecuteBookingCommand.mockResolvedValue({
        success: false,
        message:
          "I need more information before creating the booking: service, client, date, time.",
      });

      const result = await confirmAICommandAction("Schedule a booking.");

      expect(mockedExecuteBookingCommand).toHaveBeenCalledWith(
        "Schedule a booking.",
        "workspace-1",
      );

      expect(result).toEqual({
        success: false,
        message:
          "I need more information before creating the booking: service, client, date, time.",
      });
    });

    it("executes a project status update after confirmation", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "UPDATE_PROJECT",
        message: "Confirmation required.",
        requiresConfirmation: true,
      });

      mockedExecuteProjectStatusUpdateAction.mockResolvedValue({
        success: true,
        message: "Kitchen Remodel was updated to COMPLETED.",
      });

      const result = await confirmAICommandAction(
        "Mark Kitchen Remodel as completed.",
      );

      expect(mockedExecuteProjectStatusUpdateAction).toHaveBeenCalledWith({
        workspaceId: "workspace-1",
        userId: "user-1",
        command: "Mark Kitchen Remodel as completed.",
      });

      expect(result).toEqual({
        success: true,
        message: "Kitchen Remodel was updated to COMPLETED.",
      });
    });

    it("returns a project update execution failure", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: true,
        action: "UPDATE_PROJECT",
        message: "Confirmation required.",
        requiresConfirmation: true,
      });

      mockedExecuteProjectStatusUpdateAction.mockResolvedValue({
        success: false,
        message: "I couldn't determine which project you want to update.",
      });

      const result = await confirmAICommandAction(
        "Mark the project as completed.",
      );

      expect(result).toEqual({
        success: false,
        message: "I couldn't determine which project you want to update.",
      });
    });

    it("rejects confirmation when the user is not signed in", async () => {
      mockedRequireDashboardUser.mockResolvedValue(null);

      const result = await confirmAICommandAction("Send an invoice reminder.");

      expect(result).toEqual({
        success: false,
        message: "Please sign in.",
      });

      expect(mockedExecuteInvoiceReminderAction).not.toHaveBeenCalled();

      expect(mockedExecuteBookingCommand).not.toHaveBeenCalled();
    });

    it("rejects confirmation when no workspace exists", async () => {
      mockedGetCurrentUserWorkspaceQuery.mockResolvedValue(null);

      const result = await confirmAICommandAction("Send an invoice reminder.");

      expect(result).toEqual({
        success: false,
        message: "Workspace not found.",
      });

      expect(mockedExecuteInvoiceReminderAction).not.toHaveBeenCalled();

      expect(mockedExecuteBookingCommand).not.toHaveBeenCalled();
    });

    it("rejects a command that no longer resolves to an action", async () => {
      mockedPlanCopilotAction.mockReturnValue({
        handled: false,
        action: "NONE",
        message: "",
        requiresConfirmation: false,
      });

      const result = await confirmAICommandAction("Tell me about revenue.");

      expect(result).toEqual({
        success: false,
        message: "No executable action was found.",
      });

      expect(mockedExecuteInvoiceReminderAction).not.toHaveBeenCalled();

      expect(mockedExecuteBookingCommand).not.toHaveBeenCalled();
    });
  });
});
