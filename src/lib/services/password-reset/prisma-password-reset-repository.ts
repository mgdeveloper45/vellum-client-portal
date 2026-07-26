import { prisma } from "@/lib/prisma";
import type {
  PasswordResetRepository,
  PasswordResetTokenRecord,
  PasswordResetUser,
} from "./password-reset-repository";

export class PrismaPasswordResetRepository implements PasswordResetRepository {
  async findUserByEmail(email: string): Promise<PasswordResetUser | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async createResetToken({
    token,
    userId,
    expiresAt,
  }: {
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findResetToken(
    token: string,
  ): Promise<PasswordResetTokenRecord | null> {
    return prisma.passwordResetToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async deleteResetToken(id: string) {
    await prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}

export const prismaPasswordResetRepository =
  new PrismaPasswordResetRepository();
