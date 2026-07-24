import type {
  ProposalListRecord,
  ProposalRepository,
} from "./proposal-repository";

export class GetProposalsService {
  constructor(private readonly proposalRepository: ProposalRepository) {}

  async execute(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<ProposalListRecord[]> {
    return this.proposalRepository.findProposals(input);
  }
}
