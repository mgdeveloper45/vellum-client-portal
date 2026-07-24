import type {
  ProposalMutationRecord,
  ProposalRepository,
} from "./proposal-repository";

export type ToggleProposalApprovalServiceResult =
  | {
      success: true;
      proposal: ProposalMutationRecord;
    }
  | {
      success: false;
      code: "PROPOSAL_NOT_FOUND";
    };

export class ToggleProposalApprovalService {
  constructor(private readonly proposalRepository: ProposalRepository) {}

  async execute(input: {
    proposalId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<ToggleProposalApprovalServiceResult> {
    const proposal =
      await this.proposalRepository.findProposalForMutation(input);

    if (!proposal) {
      return {
        success: false,
        code: "PROPOSAL_NOT_FOUND",
      };
    }

    const updatedProposal =
      await this.proposalRepository.updateProposalApproval({
        proposalId: proposal.id,
        approved: !proposal.approved,
      });

    return {
      success: true,
      proposal: updatedProposal,
    };
  }
}
