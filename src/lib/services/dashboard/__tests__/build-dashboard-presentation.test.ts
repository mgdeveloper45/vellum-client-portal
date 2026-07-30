import { describe, expect, it } from "vitest";
import { buildDashboardPresentation } from "../build-dashboard-presentation";
import type { DashboardMetrics } from "@/lib/services/dashboard/dashboard-orchestrator-types";

describe("buildDashboardPresentation", () => {
  const metrics: DashboardMetrics = {
    collectionRate: 92,
    proposalConversionRate: 67,
    projectCompletionRate: 81,
    pendingProposals: 4,
  };

  it("builds hero metrics", () => {
    const result = buildDashboardPresentation({
      todaysBookings: 8,
      activeProjects: 14,
      pendingMilestones: 5,
      openInvoices: 3,
      totalClients: 48,
      revenueCollected: 150000,
      revenueOutstanding: 12000,
      bookingTrendCounts: [],
      nextSevenDayLabels: [],
      metrics,
    });

    expect(result.heroMetrics).toEqual([
      {
        label: "Bookings Today",
        value: 8,
        helper: "Scheduled appointments",
      },
      {
        label: "Active Projects",
        value: 14,
        helper: "Currently in progress",
      },
      {
        label: "Pending Milestones",
        value: 5,
        helper: "Need attention",
      },
      {
        label: "Open Invoices",
        value: 3,
        helper: "Awaiting payment",
      },
      {
        label: "Clients",
        value: 48,
        helper: "Total client accounts",
      },
    ]);
  });

  it("formats professional metrics", () => {
    const result = buildDashboardPresentation({
      todaysBookings: 0,
      activeProjects: 0,
      pendingMilestones: 0,
      openInvoices: 0,
      totalClients: 0,
      revenueCollected: 150000,
      revenueOutstanding: 12000,
      bookingTrendCounts: [],
      nextSevenDayLabels: [],
      metrics,
    });

    expect(result.professionalMetrics).toEqual([
      {
        label: "Revenue Collected",
        value: "$150,000",
        helper: "Paid invoices",
      },
      {
        label: "Outstanding Revenue",
        value: "$12,000",
        helper: "Awaiting payment",
      },
      {
        label: "Collection Rate",
        value: "92%",
        helper: "Invoices paid",
      },
      {
        label: "Proposal Conversion",
        value: "67%",
        helper: "Proposals approved",
      },
      {
        label: "Project Completion",
        value: "81%",
        helper: "Projects completed",
      },
    ]);
  });

  it("builds booking trend data", () => {
    const result = buildDashboardPresentation({
      todaysBookings: 0,
      activeProjects: 0,
      pendingMilestones: 0,
      openInvoices: 0,
      totalClients: 0,
      revenueCollected: 0,
      revenueOutstanding: 0,
      bookingTrendCounts: [5, 2, 8],
      nextSevenDayLabels: ["Mon", "Tue", "Wed"],
      metrics,
    });

    expect(result.bookingTrendData).toEqual([
      {
        label: "Mon",
        count: 5,
      },
      {
        label: "Tue",
        count: 2,
      },
      {
        label: "Wed",
        count: 8,
      },
    ]);
  });

  it("defaults missing booking counts to zero", () => {
    const result = buildDashboardPresentation({
      todaysBookings: 0,
      activeProjects: 0,
      pendingMilestones: 0,
      openInvoices: 0,
      totalClients: 0,
      revenueCollected: 0,
      revenueOutstanding: 0,
      bookingTrendCounts: [3],
      nextSevenDayLabels: ["Mon", "Tue", "Wed"],
      metrics,
    });

    expect(result.bookingTrendData).toEqual([
      {
        label: "Mon",
        count: 3,
      },
      {
        label: "Tue",
        count: 0,
      },
      {
        label: "Wed",
        count: 0,
      },
    ]);
  });

  it("returns empty booking trend data when no labels exist", () => {
    const result = buildDashboardPresentation({
      todaysBookings: 0,
      activeProjects: 0,
      pendingMilestones: 0,
      openInvoices: 0,
      totalClients: 0,
      revenueCollected: 0,
      revenueOutstanding: 0,
      bookingTrendCounts: [],
      nextSevenDayLabels: [],
      metrics,
    });

    expect(result.bookingTrendData).toEqual([]);
  });
});
