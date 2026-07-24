export interface CreateDefaultWorkspaceInput {
  userId: string;
  workspaceName: string;
  workspaceSlug: string;
}

export interface CreatedDefaultWorkspace {
  id: string;
  name: string;
  slug: string;
  migratedProjectCount: number;
  migratedClientCount: number;
}

export type CreateDefaultWorkspaceRepositoryResult =
  | {
      status: "created";
      workspace: CreatedDefaultWorkspace;
    }
  | {
      status: "user_not_found";
    }
  | {
      status: "already_assigned";
      workspaceId: string;
    }
  | {
      status: "assignment_conflict";
    };

export interface WorkspaceSetupRepository {
  createDefaultWorkspace(
    input: CreateDefaultWorkspaceInput,
  ): Promise<CreateDefaultWorkspaceRepositoryResult>;
}
