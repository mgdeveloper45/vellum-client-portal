export interface ProjectStatusPromptParams {
  projectName: string;
  clientName: string;
  currentStatus: string;
  completedTasks: string[];
  upcomingTasks: string[];
  risks: string[];
}

export function buildProjectStatusPrompt({
  projectName,
  clientName,
  currentStatus,
  completedTasks,
  upcomingTasks,
  risks,
}: ProjectStatusPromptParams): string {
  return `
You are preparing a professional client project update.

Client
${clientName}

Project
${projectName}

Current Status
${currentStatus}

Completed Work
${completedTasks.length > 0
    ? completedTasks.map(task => `• ${task}`).join("\n")
    : "None"}

Upcoming Work
${upcomingTasks.length > 0
    ? upcomingTasks.map(task => `• ${task}`).join("\n")
    : "None"}

Risks
${risks.length > 0
    ? risks.map(risk => `• ${risk}`).join("\n")
    : "No known risks"}

Write a friendly, professional client update including:

1. Greeting
2. Progress Summary
3. Completed Work
4. Upcoming Work
5. Risks (only if applicable)
6. Closing

Return only the email.
`;
}