import type {
  ProposalMutationRecord,
  ProposalRepository,
} from "./proposal-repository";

export type CreateProposalServiceResult =
  | {
      success: true;
      proposal: ProposalMutationRecord;
    }
  | {
      success: false;
      code: "PROJECT_NOT_FOUND";
    };

export class CreateProposalService {
  constructor(private readonly proposalRepository: ProposalRepository) {}

  async execute(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<CreateProposalServiceResult> {
    const projectExists =
      await this.proposalRepository.projectExistsInWorkspace({
        projectId: input.projectId,
        workspaceId: input.workspaceId,
      });

    if (!projectExists) {
      return {
        success: false,
        code: "PROJECT_NOT_FOUND",
      };
    }

    const proposal = await this.proposalRepository.createProposal({
      projectId: input.projectId,
    });

    return {
      success: true,
      proposal,
    };
  }
}
