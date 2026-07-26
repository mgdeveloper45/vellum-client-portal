import bcrypt from "bcryptjs";

import type {
  ManagedUser,
  UserManagementRepository,
} from "@/lib/services/users/user-management-repository";

type CreateUserParams = {
  workspaceId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
};

export class CreateUserService {
  constructor(
    private readonly userManagementRepository: UserManagementRepository,
  ) {}

  async execute(input: CreateUserParams): Promise<ManagedUser> {
    const existingUserId =
      await this.userManagementRepository.findUserIdByEmail(input.email);

    if (existingUserId) {
      throw new Error("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    return this.userManagementRepository.createUser({
      workspaceId: input.workspaceId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role,
      hashedPassword,
    });
  }
}
