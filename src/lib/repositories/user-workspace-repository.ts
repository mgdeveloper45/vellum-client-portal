export interface UserWorkspaceRepository {
  findWorkspaceIdByUserId(userId: string): Promise<string | null>;
}
