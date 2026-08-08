export interface ProjectSummaryPromptParams {
  projectName: string;
  clientName: string;
  completedTasks: string[];
  outstandingTasks: string[];
  budgetUsed: number;
  budgetRemaining: number;
  risks: string[];
}

export function buildProjectSummaryPrompt({
  projectName,
  clientName,
  completedTasks,
  outstandingTasks,
  budgetUsed,
  budgetRemaining,
  risks,
}: ProjectSummaryPromptParams): string {
  return `
You are an experienced project director preparing an executive summary.

Project
${projectName}

Client
${clientName}

Completed Work
${completedTasks.length > 0
    ? completedTasks.map(task => `• ${task}`).join("\n")
    : "None"}

Outstanding Work
${outstandingTasks.length > 0
    ? outstandingTasks.map(task => `• ${task}`).join("\n")
    : "None"}

Budget Used
$${budgetUsed.toLocaleString()}

Budget Remaining
$${budgetRemaining.toLocaleString()}

Risks
${risks.length > 0
    ? risks.map(risk => `• ${risk}`).join("\n")
    : "No major risks"}

Create an executive summary with the following sections:

1. Overall Health
2. Progress
3. Budget
4. Risks
5. Recommendations

Return only the summary.
`;
}