import { describe, expect, it } from "vitest";

import { routeCopilotIntent } from "../copilot-intent-router";

describe("routeCopilotIntent", () => {
  it("routes an executive project summary request", () => {
    expect(
      routeCopilotIntent("Give me an executive summary of this project").intent,
    ).toBe("PROJECT_SUMMARY");
  });

  it("routes a project status request", () => {
    expect(
      routeCopilotIntent("What is the status of this project?").intent,
    ).toBe("PROJECT_STATUS");
  });

  it("routes a project health request", () => {
    expect(routeCopilotIntent("Check the project health").intent).toBe(
      "PROJECT_STATUS",
    );
  });

  it("routes a proposal generation request", () => {
    expect(routeCopilotIntent("Create proposal for this project").intent).toBe(
      "PROPOSAL",
    );
  });

  it("routes a proposal drafting request", () => {
    expect(
      routeCopilotIntent("Draft proposal for the website redesign").intent,
    ).toBe("PROPOSAL");
  });

  it("keeps normal project questions as answers", () => {
    expect(routeCopilotIntent("Which projects need attention?").intent).toBe(
      "ANSWER",
    );
  });

  it("keeps revenue questions as answers", () => {
    expect(
      routeCopilotIntent("How is revenue looking this month?").intent,
    ).toBe("ANSWER");
  });

  it("does not confuse a business summary with a project summary", () => {
    expect(routeCopilotIntent("Give me a summary of the business").intent).toBe(
      "ANSWER",
    );
  });
});
