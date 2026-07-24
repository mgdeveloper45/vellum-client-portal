import type {
  ProposalMutationRecord,
  ProposalRepository,
} from "./proposal-repository";

export type DeleteProposalServiceResult =
  | {
      success: true;
      proposal: ProposalMutationRecord;
    }
  | {
      success: false;
      code: "PROPOSAL_NOT_FOUND";
    };

export class DeleteProposalService {
  constructor(private readonly proposalRepository: ProposalRepository) {}

  async execute(input: {
    proposalId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<DeleteProposalServiceResult> {
    const proposal =
      await this.proposalRepository.findProposalForMutation(input);

    if (!proposal) {
      return {
        success: false,
        code: "PROPOSAL_NOT_FOUND",
      };
    }

    await this.proposalRepository.deleteProposal(proposal.id);

    return {
      success: true,
      proposal,
    };
  }
}
