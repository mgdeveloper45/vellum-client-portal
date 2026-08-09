import type { ProjectDetailRecord } from "@/lib/services/projects/project-repository";

export interface ProjectAiContext {
  projectName: string;
  clientName: string;
  projectDescription: string;
  projectStatus: string;

  completedMilestones: string[];
  outstandingMilestones: string[];
  overdueMilestones: string[];

  totalMilestones: number;
  completedMilestoneCount: number;

  totalInvoiced: number;
  totalPaid: number;
  outstandingAmount: number;

  risks: string[];
}

export function buildProjectAiContext(
  project: ProjectDetailRecord,
  now: Date = new Date(),
): ProjectAiContext {
  const completedMilestones = project.milestones
    .filter((milestone) => milestone.status === "COMPLETE")
    .map((milestone) => milestone.title);

  const outstandingMilestones = project.milestones
    .filter((milestone) => milestone.status !== "COMPLETE")
    .map((milestone) => milestone.title);

  const overdueMilestones = project.milestones
    .filter(
      (milestone) =>
        milestone.status !== "COMPLETE" &&
        milestone.dueDate !== null &&
        milestone.dueDate < now,
    )
    .map((milestone) => milestone.title);

  const totalInvoiced = project.invoices.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );

  const totalPaid = project.invoices.reduce(
    (total, invoice) => total + (invoice.paid ? invoice.amount : 0),
    0,
  );

  const outstandingAmount = project.invoices.reduce(
    (total, invoice) => total + (!invoice.paid ? invoice.amount : 0),
    0,
  );

  const risks: string[] = [];

  if (overdueMilestones.length > 0) {
    risks.push(
      `${overdueMilestones.length} overdue milestone${
        overdueMilestones.length === 1 ? "" : "s"
      }.`,
    );
  }

  if (outstandingAmount > 0) {
    risks.push(
      `$${outstandingAmount.toLocaleString()} in outstanding invoices.`,
    );
  }

  return {
    projectName: project.name,
    clientName: `${project.client.firstName} ${project.client.lastName}`.trim(),
    projectDescription: project.description,
    projectStatus: project.status,

    completedMilestones,
    outstandingMilestones,
    overdueMilestones,

    totalMilestones: project.milestones.length,
    completedMilestoneCount: completedMilestones.length,

    totalInvoiced,
    totalPaid,
    outstandingAmount,

    risks,
  };
}
