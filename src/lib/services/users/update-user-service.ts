import type {
  ManagedUser,
  UserManagementRepository,
} from "@/lib/services/users/user-management-repository";

type UpdateUserParams = {
  managingUserId: string;
  workspaceId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
};

export type UpdateUserResult = {
  previousUser: ManagedUser;
};

export class UpdateUserService {
  constructor(
    private readonly userManagementRepository: UserManagementRepository,
  ) {}

  async execute(input: UpdateUserParams): Promise<UpdateUserResult | null> {
    const existingEmailOwnerId =
      await this.userManagementRepository.findOtherUserIdByEmail(
        input.email,
        input.userId,
      );

    if (existingEmailOwnerId) {
      throw new Error("A user with this email already exists.");
    }

    const targetUser =
      await this.userManagementRepository.findWorkspaceUserById(
        input.userId,
        input.workspaceId,
      );

    if (!targetUser) {
      return null;
    }

    if (targetUser.id === input.managingUserId && !input.isActive) {
      throw new Error("You cannot deactivate your own account.");
    }

    const updated = await this.userManagementRepository.updateWorkspaceUser({
      userId: input.userId,
      workspaceId: input.workspaceId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role,
      isActive: input.isActive,
    });

    if (!updated) {
      return null;
    }

    return {
      previousUser: targetUser,
    };
  }
}
