import { askWithPrompt } from "../ai-service";
import { buildProposalPrompt } from "../prompts/proposal-prompt-builder";

import type { AiActionResult } from "./action-types";

export interface ProposalActionParams {
  clientName: string;
  businessName: string;
  projectName: string;
  projectDescription: string;
  estimatedPrice: number;
  estimatedTimeline: string;
}

export async function generateProposalAction(
  params: ProposalActionParams,
): Promise<AiActionResult> {
  const prompt = buildProposalPrompt(params);

  const content = await askWithPrompt(prompt);

  return {
    type: "PROPOSAL",

    title: `${params.projectName} Proposal`,

    preview:
      content.length > 180
        ? `${content.slice(0, 180)}...`
        : content,

    content,

    metadata: {
      clientName: params.clientName,
      projectName: params.projectName,
      estimatedPrice: params.estimatedPrice,
      estimatedTimeline: params.estimatedTimeline,
    },
  };
}