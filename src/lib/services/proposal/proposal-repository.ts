export type ProposalMutationRecord = {
  id: string;
  projectId: string;
  approved: boolean;
};

export type ProposalListRecord = {
  id: string;
  approved: boolean;
  createdAt: Date;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

export interface ProposalRepository {
  projectExistsInWorkspace(input: {
    projectId: string;
    workspaceId: string;
  }): Promise<boolean>;

  createProposal(input: { projectId: string }): Promise<ProposalMutationRecord>;

  findProposalForMutation(input: {
    proposalId: string;
    projectId: string;
    workspaceId: string;
  }): Promise<ProposalMutationRecord | null>;

  updateProposalApproval(input: {
    proposalId: string;
    approved: boolean;
  }): Promise<ProposalMutationRecord>;

  deleteProposal(proposalId: string): Promise<void>;

  findProposals(input: {
    workspaceId: string;
    clientId?: string;
  }): Promise<ProposalListRecord[]>;
}
