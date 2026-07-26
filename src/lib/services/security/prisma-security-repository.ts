import { prisma } from "@/lib/prisma";
import type {
  SecurityRepository,
  SecurityUser,
} from "@/lib/services/security/security-repository";

export class PrismaSecurityRepository implements SecurityRepository {
  async findUserById(userId: string): Promise<SecurityUser | null> {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }
}

export const prismaSecurityRepository = new PrismaSecurityRepository();
