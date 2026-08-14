import { describe, expect, it } from "vitest";

import { calculateWorkspaceRisks } from "../workspace-risk";

describe("calculateWorkspaceRisks", () => {
  it("routes outstanding payments to invoices", () => {
    const [risk] = calculateWorkspaceRisks({
      overdueInvoices: 2,
      bookingsNeedingAttention: 0,
    });

    expect(risk.href).toBe("/invoices");
  });

  it("routes booking risks to bookings", () => {
    const [risk] = calculateWorkspaceRisks({
      overdueInvoices: 0,
      bookingsNeedingAttention: 3,
    });

    expect(risk.href).toBe("/bookings");
  });

  it("does not make the all-clear state actionable", () => {
    const [risk] = calculateWorkspaceRisks({
      overdueInvoices: 0,
      bookingsNeedingAttention: 0,
    });

    expect(risk.href).toBeNull();
  });
});
