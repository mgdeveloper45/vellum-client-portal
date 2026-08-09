export interface WorkspaceBusinessContext {
  id: string;
  name: string;
  companyName: string | null;
}

export interface UserWorkspaceRepository {
  findWorkspaceIdByUserId(
    userId: string,
  ): Promise<string | null>;

  findWorkspaceBusinessContextByUserId(
    userId: string,
  ): Promise<WorkspaceBusinessContext | null>;
}