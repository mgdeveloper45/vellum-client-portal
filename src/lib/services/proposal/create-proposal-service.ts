import type {
  ProposalMutationRecord,
  ProposalRepository,
} from "./proposal-repository";

export interface CreateProposalServiceInput {
  projectId: string;
  workspaceId: string;
  title?: string;
  content?: string;
}

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

  async execute(
    input: CreateProposalServiceInput,
  ): Promise<CreateProposalServiceResult> {
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
      title: input.title,
      content: input.content,
    });

    return {
      success: true,
      proposal,
    };
  }
}
