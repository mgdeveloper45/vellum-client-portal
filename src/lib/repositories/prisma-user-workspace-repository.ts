import { prisma } from "@/lib/prisma";

import type {
  UserWorkspaceRepository,
  WorkspaceBusinessContext,
} from "./user-workspace-repository";

export class PrismaUserWorkspaceRepository implements UserWorkspaceRepository {
  async findWorkspaceIdByUserId(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        workspaceId: true,
      },
    });

    return user?.workspaceId ?? null;
  }

  async findWorkspaceBusinessContextByUserId(
    userId: string,
  ): Promise<WorkspaceBusinessContext | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        workspace: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
    });

    return user?.workspace ?? null;
  }
}

export const prismaUserWorkspaceRepository =
  new PrismaUserWorkspaceRepository();
