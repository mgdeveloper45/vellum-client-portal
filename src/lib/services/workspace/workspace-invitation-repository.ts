export type WorkspaceInvitationRole = "ADMIN" | "CLIENT";

export type CreatedWorkspaceInvitation = {
  id: string;
  email: string;
  token: string;
  workspaceName: string;
};

export type CreateWorkspaceInvitationRepositoryResult =
  | {
      status: "inviter_not_found";
    }
  | {
      status: "workspace_not_found";
    }
  | {
      status: "created";
      invitation: CreatedWorkspaceInvitation;
    };

export type AcceptWorkspaceInvitationRepositoryInput = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  acceptedAt: Date;
};

export type AcceptWorkspaceInvitationRepositoryResult =
  | {
      status: "invitation_not_found";
    }
  | {
      status: "already_accepted";
    }
  | {
      status: "expired";
    }
  | {
      status: "email_mismatch";
    }
  | {
      status: "accepted";
    };

export interface WorkspaceInvitationRepository {
  createInvitation(input: {
    invitedById: string;
    email: string;
    role: WorkspaceInvitationRole;
    token: string;
    expiresAt: Date;
  }): Promise<CreateWorkspaceInvitationRepositoryResult>;

  acceptInvitation(
    input: AcceptWorkspaceInvitationRepositoryInput,
  ): Promise<AcceptWorkspaceInvitationRepositoryResult>;
}
