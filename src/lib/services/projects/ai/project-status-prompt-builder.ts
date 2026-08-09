export interface ProjectStatusPromptParams {
  projectName: string;
  projectStatus: string;
  completedMilestones: number;
  totalMilestones: number;
  totalInvoiced: number;
  outstandingAmount: number;
  overdueMilestones: string[];
}

export function buildProjectStatusPrompt({
  projectName,
  projectStatus,
  completedMilestones,
  totalMilestones,
  totalInvoiced,
  outstandingAmount,
  overdueMilestones,
}: ProjectStatusPromptParams): string {
  return `
You are an experienced project operations manager evaluating project health.

Project
${projectName}

Current Status
${projectStatus}

Milestone Progress
${completedMilestones} of ${totalMilestones} milestones completed

Total Invoiced
$${totalInvoiced.toLocaleString()}

Outstanding Invoice Amount
$${outstandingAmount.toLocaleString()}

Overdue Milestones
${
  overdueMilestones.length > 0
    ? overdueMilestones.map((milestone) => `• ${milestone}`).join("\n")
    : "None"
}

Evaluate the current project status.

Use these sections:

1. Health Assessment
2. Schedule
3. Financial Status
4. Attention Required
5. Next Step

Base the assessment only on the supplied project information.
Do not invent missing facts.

Keep the response concise and actionable.

Return only the project status assessment.
`.trim();
}
