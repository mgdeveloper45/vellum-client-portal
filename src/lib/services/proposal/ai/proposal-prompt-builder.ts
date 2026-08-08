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

Write a polished project proposal.

Business

${businessName}

Client

${clientName}

Project

${projectName}

Project Description

${projectDescription}

Timeline

${estimatedTimeline}

Investment

$${estimatedPrice.toLocaleString()}

Write:

1. Executive Summary

2. Project Scope

3. Deliverables

4. Timeline

5. Investment

6. Next Steps

Return only the proposal.
`;
}
