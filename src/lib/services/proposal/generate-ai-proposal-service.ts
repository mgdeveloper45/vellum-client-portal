import { GenerateProposalService } from "./ai/generate-proposal-service";

export interface GenerateAiProposalParams {
  clientName: string;
  businessName: string;
  projectName: string;
  projectDescription: string;
  estimatedPrice: number;
  estimatedTimeline: string;
}

const generator = new GenerateProposalService();

export async function generateAiProposal(
  params: GenerateAiProposalParams,
): Promise<string> {
  return generator.generate(params);
}
