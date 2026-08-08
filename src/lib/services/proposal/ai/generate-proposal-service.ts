import { askWithPrompt } from "@/lib/services/ai/ai-service";

import { buildProposalPrompt } from "./proposal-prompt-builder";

export interface GenerateProposalParams {
  clientName: string;
  businessName: string;
  projectName: string;
  projectDescription: string;
  estimatedPrice: number;
  estimatedTimeline: string;
}

export class GenerateProposalService {
  async generate({
    clientName,
    businessName,
    projectName,
    projectDescription,
    estimatedPrice,
    estimatedTimeline,
  }: GenerateProposalParams): Promise<string> {
    const prompt = buildProposalPrompt({
      clientName,
      businessName,
      projectName,
      projectDescription,
      estimatedPrice,
      estimatedTimeline,
    });

    return askWithPrompt(prompt);
  }
}
