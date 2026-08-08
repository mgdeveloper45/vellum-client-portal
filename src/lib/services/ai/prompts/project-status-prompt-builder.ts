export interface ProjectStatusPromptParams {
  projectName: string;
  clientName: string;
  currentStatus: string;
  completedWork: string[];
  upcomingWork: string[];
  risks: string[];
}

export function buildProjectStatusPrompt({
  projectName,
  clientName,
  currentStatus,
  completedWork,
  upcomingWork,
  risks,
}: ProjectStatusPromptParams): string {
  return `
You are an experienced project manager.

Write a professional client project update.

Client:
${clientName}

Project:
${projectName}

Current Status:
${currentStatus}

Completed Work

${completedWork.map((item) => `• ${item}`).join("\n")}

Upcoming Work

${upcomingWork.map((item) => `• ${item}`).join("\n")}

Risks

${risks.length === 0 ? "None" : risks.map((r) => `• ${r}`).join("\n")}

Write:

1. Greeting

2. Progress Summary

3. Upcoming Work

4. Risks (if any)

5. Closing

Return only the project update.
`;
}