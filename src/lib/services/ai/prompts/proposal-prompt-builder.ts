export interface ProposalPromptParams {
  clientName: string;
  businessName: string;
  projectName: string;
  projectDescription: string;
  estimatedPrice: number;
  estimatedTimeline: string;
}

export function buildProposalPrompt({
  clientName,
  businessName,
  projectName,
  projectDescription,
  estimatedPrice,
  estimatedTimeline,
}: ProposalPromptParams): string {
  return `
You are an experienced business consultant.

Write a professional project proposal.

Business:
${businessName}

Client:
${clientName}

Project:
${projectName}

Project Description:
${projectDescription}

Estimated Timeline:
${estimatedTimeline}

Estimated Investment:
$${estimatedPrice.toLocaleString()}

The proposal should contain:

1. Introduction
2. Project Overview
3. Scope of Work
4. Deliverables
5. Timeline
6. Investment
7. Closing Statement

Write in a professional, confident tone.

Return only the proposal.
`;
}