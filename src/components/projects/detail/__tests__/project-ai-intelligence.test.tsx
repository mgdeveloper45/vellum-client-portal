// @vitest-environment jsdom

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  generateProjectStatusAction,
  generateProjectSummaryAction,
} from "@/actions/project-ai-actions";

import { ProjectAiIntelligence } from "../project-ai-intelligence";

vi.mock("@/actions/project-ai-actions", () => ({
  generateProjectSummaryAction: vi.fn(),
  generateProjectStatusAction: vi.fn(),
}));

const generateSummaryMock = vi.mocked(
  generateProjectSummaryAction,
);

const generateStatusMock = vi.mocked(
  generateProjectStatusAction,
);

describe("ProjectAiIntelligence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates an executive project summary", async () => {
    generateSummaryMock.mockResolvedValue({
      success: true,
      content:
        "The project is healthy and progressing as expected.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Executive Summary",
      }),
    );

    await waitFor(() => {
      expect(generateSummaryMock).toHaveBeenCalledWith(
        "project-1",
      );
    });

    expect(
      await screen.findByText("Executive Summary"),
    ).toBeTruthy();

    expect(
      screen.getByText(
        "The project is healthy and progressing as expected.",
      ),
    ).toBeTruthy();
  });

  it("generates a project status assessment", async () => {
    generateStatusMock.mockResolvedValue({
      success: true,
      content:
        "Project health is good with no immediate schedule concerns.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check Project Status",
      }),
    );

    await waitFor(() => {
      expect(generateStatusMock).toHaveBeenCalledWith(
        "project-1",
      );
    });

    expect(
      await screen.findByText("Project Status"),
    ).toBeTruthy();

    expect(
      screen.getByText(
        "Project health is good with no immediate schedule concerns.",
      ),
    ).toBeTruthy();
  });

  it("shows an error when summary generation fails", async () => {
    generateSummaryMock.mockResolvedValue({
      success: false,
      error: "Unable to generate project summary.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Executive Summary",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain(
      "Unable to generate project summary.",
    );
  });

  it("shows an error when status generation fails", async () => {
    generateStatusMock.mockResolvedValue({
      success: false,
      error: "Unable to generate project status.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check Project Status",
      }),
    );

    const alert = await screen.findByRole("alert");

    expect(alert.textContent).toContain(
      "Unable to generate project status.",
    );
  });

  it("replaces the summary with the status result", async () => {
    generateSummaryMock.mockResolvedValue({
      success: true,
      content: "Executive summary content.",
    });

    generateStatusMock.mockResolvedValue({
      success: true,
      content: "Project status content.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Executive Summary",
      }),
    );

    expect(
      await screen.findByText(
        "Executive summary content.",
      ),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check Project Status",
      }),
    );

    expect(
      await screen.findByText(
        "Project status content.",
      ),
    ).toBeTruthy();

    expect(
      screen.queryByText(
        "Executive summary content.",
      ),
    ).toBeNull();

    expect(
      screen.getByText("Project Status"),
    ).toBeTruthy();
  });

  it("recovers after a failed request", async () => {
    generateSummaryMock.mockResolvedValue({
      success: false,
      error: "Unable to generate project summary.",
    });

    generateStatusMock.mockResolvedValue({
      success: true,
      content: "Project status recovered successfully.",
    });

    render(
      <ProjectAiIntelligence projectId="project-1" />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate Executive Summary",
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Check Project Status",
      }),
    );

    expect(
      await screen.findByText(
        "Project status recovered successfully.",
      ),
    ).toBeTruthy();

    expect(
      screen.queryByRole("alert"),
    ).toBeNull();
  });
});