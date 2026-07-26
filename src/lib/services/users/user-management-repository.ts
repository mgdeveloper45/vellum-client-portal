export type ManagedUser = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  workspaceId: string | null;
};

export type CreateManagedUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  hashedPassword: string;
  workspaceId: string;
};

export type UpdateManagedUserParams = {
  userId: string;
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
};

export interface UserManagementRepository {
  findUserIdByEmail(email: string): Promise<string | null>;

  findOtherUserIdByEmail(
    email: string,
    excludedUserId: string,
  ): Promise<string | null>;

  findWorkspaceUserById(
    userId: string,
    workspaceId: string,
  ): Promise<ManagedUser | null>;

  createUser(input: CreateManagedUserParams): Promise<ManagedUser>;

  updateWorkspaceUser(input: UpdateManagedUserParams): Promise<boolean>;
}
