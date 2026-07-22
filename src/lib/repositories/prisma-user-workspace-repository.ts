import { prisma } from "@/lib/prisma";
import type { UserWorkspaceRepository } from "./user-workspace-repository";

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
}

export const prismaUserWorkspaceRepository =
  new PrismaUserWorkspaceRepository();
