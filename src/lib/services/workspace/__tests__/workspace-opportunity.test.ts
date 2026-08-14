import { describe, expect, it } from "vitest";

import { calculateWorkspaceOpportunities } from "../workspace-opportunity";

describe("calculateWorkspaceOpportunities", () => {
  it("routes outstanding revenue to invoices", () => {
    const [opportunity] = calculateWorkspaceOpportunities({
      outstandingRevenue: 2500,
      pendingProposals: 0,
      completedProjects: 0,
    });

    expect(opportunity.href).toBe("/invoices");
  });

  it("routes pending proposals to proposals", () => {
    const [opportunity] = calculateWorkspaceOpportunities({
      outstandingRevenue: 0,
      pendingProposals: 2,
      completedProjects: 0,
    });

    expect(opportunity.href).toBe("/proposals");
  });

  it("routes completed-project opportunities to projects", () => {
    const [opportunity] = calculateWorkspaceOpportunities({
      outstandingRevenue: 0,
      pendingProposals: 0,
      completedProjects: 2,
    });

    expect(opportunity.href).toBe("/projects");
  });

  it("does not make the all-clear state actionable", () => {
    const [opportunity] = calculateWorkspaceOpportunities({
      outstandingRevenue: 0,
      pendingProposals: 0,
      completedProjects: 0,
    });

    expect(opportunity.href).toBeNull();
  });
});
