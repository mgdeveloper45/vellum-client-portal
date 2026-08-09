import { describe, expect, it } from "vitest";

import type { ProjectDetailRecord } from "@/lib/services/projects/project-repository";

import { buildProjectAiContext } from "../project-ai-context-builder";

function createProject(
  overrides: Partial<ProjectDetailRecord> = {},
): ProjectDetailRecord {
  return {
    id: "project-1",
    name: "Website Redesign",
    description: "Redesign the client website.",
    status: "ACTIVE",
    ownerId: "owner-1",
    clientId: "client-1",
    workspaceId: "workspace-1",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),

    client: {
      id: "client-1",
      firstName: "Jordan",
      lastName: "Lee",
    },

    milestones: [],
    invoices: [],
    proposals: [],
    files: [],
    messages: [],
    deposits: [],

    ...overrides,
  };
}

describe("buildProjectAiContext", () => {
  it("separates completed and outstanding milestones", () => {
    const project = createProject({
      milestones: [
        {
          id: "milestone-1",
          title: "Discovery",
          status: "COMPLETE",
          dueDate: new Date("2026-07-01"),
          createdAt: new Date("2026-06-01"),
        },
        {
          id: "milestone-2",
          title: "Design",
          status: "IN_PROGRESS",
          dueDate: new Date("2026-08-20"),
          createdAt: new Date("2026-06-01"),
        },
        {
          id: "milestone-3",
          title: "Launch",
          status: "PENDING",
          dueDate: new Date("2026-09-01"),
          createdAt: new Date("2026-06-01"),
        },
      ],
    });

    const context = buildProjectAiContext(project, new Date("2026-08-09"));

    expect(context.completedMilestones).toEqual(["Discovery"]);

    expect(context.outstandingMilestones).toEqual(["Design", "Launch"]);

    expect(context.completedMilestoneCount).toBe(1);
    expect(context.totalMilestones).toBe(3);
  });

  it("identifies overdue incomplete milestones", () => {
    const project = createProject({
      milestones: [
        {
          id: "milestone-1",
          title: "Overdue Design",
          status: "IN_PROGRESS",
          dueDate: new Date("2026-08-01"),
          createdAt: new Date("2026-07-01"),
        },
        {
          id: "milestone-2",
          title: "Completed Work",
          status: "COMPLETE",
          dueDate: new Date("2026-07-01"),
          createdAt: new Date("2026-06-01"),
        },
        {
          id: "milestone-3",
          title: "Future Work",
          status: "PENDING",
          dueDate: new Date("2026-09-01"),
          createdAt: new Date("2026-07-01"),
        },
      ],
    });

    const context = buildProjectAiContext(project, new Date("2026-08-09"));

    expect(context.overdueMilestones).toEqual(["Overdue Design"]);
  });

  it("calculates invoice totals", () => {
    const project = createProject({
      invoices: [
        {
          id: "invoice-1",
          amount: 5000,
          paid: true,
          createdAt: new Date("2026-07-01"),
        },
        {
          id: "invoice-2",
          amount: 3000,
          paid: false,
          createdAt: new Date("2026-08-01"),
        },
      ],
    });

    const context = buildProjectAiContext(project);

    expect(context.totalInvoiced).toBe(8000);
    expect(context.totalPaid).toBe(5000);
    expect(context.outstandingAmount).toBe(3000);
  });

  it("derives project risks", () => {
    const project = createProject({
      milestones: [
        {
          id: "milestone-1",
          title: "Design Approval",
          status: "IN_PROGRESS",
          dueDate: new Date("2026-08-01"),
          createdAt: new Date("2026-07-01"),
        },
      ],

      invoices: [
        {
          id: "invoice-1",
          amount: 2500,
          paid: false,
          createdAt: new Date("2026-08-01"),
        },
      ],
    });

    const context = buildProjectAiContext(project, new Date("2026-08-09"));

    expect(context.risks).toEqual([
      "1 overdue milestone.",
      "$2,500 in outstanding invoices.",
    ]);
  });

  it("returns no derived risks for a healthy project", () => {
    const project = createProject({
      milestones: [
        {
          id: "milestone-1",
          title: "Discovery",
          status: "COMPLETE",
          dueDate: new Date("2026-08-01"),
          createdAt: new Date("2026-07-01"),
        },
      ],

      invoices: [
        {
          id: "invoice-1",
          amount: 5000,
          paid: true,
          createdAt: new Date("2026-08-01"),
        },
      ],
    });

    const context = buildProjectAiContext(project, new Date("2026-08-09"));

    expect(context.risks).toEqual([]);
    expect(context.outstandingAmount).toBe(0);
  });
});
