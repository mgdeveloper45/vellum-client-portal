import { describe, expect, it } from "vitest";

import { generateProposalAction } from "../proposal-action";

describe("generateProposalAction", () => {
  it("creates a proposal", async () => {
    const result = await generateProposalAction({
      clientName: "Acme Construction",
      businessName: "Vellum Studio",
      projectName: "Website Redesign",
      projectDescription: "Modern marketing website with CMS",
      estimatedPrice: 8500,
      estimatedTimeline: "6 weeks",
    });

    expect(result.type).toBe("PROPOSAL");

    expect(result.title).toContain("Website");

    expect(result.preview.length).toBeGreaterThan(0);

    expect(result.content.length).toBeGreaterThan(0);

    expect(result.metadata).toEqual({
      clientName: "Acme Construction",
      projectName: "Website Redesign",
      estimatedPrice: 8500,
      estimatedTimeline: "6 weeks",
    });
  });
});
