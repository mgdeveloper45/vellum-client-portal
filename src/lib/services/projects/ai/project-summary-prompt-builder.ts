export interface ProjectSummaryPromptParams {
  projectName: string;
  clientName: string;
  projectDescription: string;
  projectStatus: string;
  completedMilestones: string[];
  outstandingMilestones: string[];
  totalInvoiced: number;
  totalPaid: number;
  outstandingAmount: number;
  risks: string[];
}

export function buildProjectSummaryPrompt({
  projectName,
  clientName,
  projectDescription,
  projectStatus,
  completedMilestones,
  outstandingMilestones,
  totalInvoiced,
  totalPaid,
  outstandingAmount,
  risks,
}: ProjectSummaryPromptParams): string {
  return `
You are an experienced project director preparing a concise executive project summary.

Project
${projectName}

Client
${clientName}

Description
${projectDescription || "No project description provided."}

Current Status
${projectStatus}

Completed Milestones
${
  completedMilestones.length > 0
    ? completedMilestones.map((milestone) => `• ${milestone}`).join("\n")
    : "None"
}

Outstanding Milestones
${
  outstandingMilestones.length > 0
    ? outstandingMilestones.map((milestone) => `• ${milestone}`).join("\n")
    : "None"
}

Total Invoiced
$${totalInvoiced.toLocaleString()}

Total Paid
$${totalPaid.toLocaleString()}

Outstanding Amount
$${outstandingAmount.toLocaleString()}

Known Risks
${
  risks.length > 0
    ? risks.map((risk) => `• ${risk}`).join("\n")
    : "No major risks identified."
}

Create an executive summary using these sections:

1. Overall Health
2. Progress
3. Financial Position
4. Risks
5. Recommendations

Be concise, professional, and factual.
Do not invent project information that is not provided above.

Return only the executive summary.
`.trim();
}
