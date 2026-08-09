import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  generateProjectStatusAction,
  generateProjectSummaryAction,
} from "@/actions/project-ai-actions";

import { runProjectCopilotAction } from "../project-copilot-actions";

vi.mock("@/actions/project-ai-actions", () => ({
  generateProjectSummaryAction: vi.fn(),
  generateProjectStatusAction: vi.fn(),
}));

const generateSummaryMock = vi.mocked(generateProjectSummaryAction);

const generateStatusMock = vi.mocked(generateProjectStatusAction);

describe("runProjectCopilotAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates an executive summary for the selected project", async () => {
    generateSummaryMock.mockResolvedValue({
      success: true,
      content: "Executive project summary.",
    });

    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "Give me an executive summary of this project",
    });

    expect(generateSummaryMock).toHaveBeenCalledWith("project-1");

    expect(result).toEqual({
      success: true,
      content: "Executive project summary.",
    });
  });

  it("generates project status for the selected project", async () => {
    generateStatusMock.mockResolvedValue({
      success: true,
      content: "Project is healthy.",
    });

    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "Check the status of this project",
    });

    expect(generateStatusMock).toHaveBeenCalledWith("project-1");

    expect(result).toEqual({
      success: true,
      content: "Project is healthy.",
    });
  });

  it("does not invent proposal inputs", async () => {
    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "Create proposal for this project",
    });

    expect(result).toEqual({
      success: false,
      error:
        "Use the proposal generator below to provide pricing, timeline, and project details.",
    });

    expect(generateSummaryMock).not.toHaveBeenCalled();

    expect(generateStatusMock).not.toHaveBeenCalled();
  });

  it("rejects an empty query", async () => {
    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "   ",
    });

    expect(result).toEqual({
      success: false,
      error: "Enter a question or command.",
    });
  });

  it("rejects unsupported project questions", async () => {
    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "Hello Vellum",
    });

    expect(result).toEqual({
      success: false,
      error: "Ask for an executive summary, project status, or proposal.",
    });
  });

  it("propagates project summary failures", async () => {
    generateSummaryMock.mockResolvedValue({
      success: false,
      error: "Project not found.",
    });

    const result = await runProjectCopilotAction({
      projectId: "missing-project",
      query: "Give me an executive summary of this project",
    });

    expect(result).toEqual({
      success: false,
      error: "Project not found.",
    });
  });

  it("propagates project status failures", async () => {
    generateStatusMock.mockResolvedValue({
      success: false,
      error: "Unable to generate project status.",
    });

    const result = await runProjectCopilotAction({
      projectId: "project-1",
      query: "Check the status of this project",
    });

    expect(result).toEqual({
      success: false,
      error: "Unable to generate project status.",
    });
  });
});
