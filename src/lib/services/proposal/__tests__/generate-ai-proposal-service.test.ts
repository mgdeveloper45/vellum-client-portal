import { describe, expect, it } from "vitest";

import { generateAiProposal } from "../generate-ai-proposal-service";

describe("generateAiProposal", () => {
  it("generates proposal content", async () => {
    const proposal = await generateAiProposal({
      clientName: "Acme Construction",
      businessName: "Vellum Studio",
      projectName: "Website Redesign",
      projectDescription: "Modern marketing website",
      estimatedPrice: 8500,
      estimatedTimeline: "6 weeks",
    });

    expect(proposal.length).toBeGreaterThan(0);
  });
});