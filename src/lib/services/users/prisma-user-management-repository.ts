import { prisma } from "@/lib/prisma";
import type {
  CreateManagedUserParams,
  ManagedUser,
  UpdateManagedUserParams,
  UserManagementRepository,
} from "@/lib/services/users/user-management-repository";

export class PrismaUserManagementRepository implements UserManagementRepository {
  async findUserIdByEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return user?.id ?? null;
  }

  async findOtherUserIdByEmail(
    email: string,
    excludedUserId: string,
  ): Promise<string | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: excludedUserId,
        },
      },
      select: {
        id: true,
      },
    });

    return user?.id ?? null;
  }

  async findWorkspaceUserById(
    userId: string,
    workspaceId: string,
  ): Promise<ManagedUser | null> {
    return prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        workspaceId: true,
      },
    });
  }

  async createUser(input: CreateManagedUserParams): Promise<ManagedUser> {
    return prisma.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: input.role as never,
        password: input.hashedPassword,
        isActive: true,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        workspaceId: true,
      },
    });
  }

  async updateWorkspaceUser(input: UpdateManagedUserParams): Promise<boolean> {
    const result = await prisma.user.updateMany({
      where: {
        id: input.userId,
        workspaceId: input.workspaceId,
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: input.role as never,
        isActive: input.isActive,
      },
    });

    return result.count > 0;
  }
}

export const prismaUserManagementRepository =
  new PrismaUserManagementRepository();
