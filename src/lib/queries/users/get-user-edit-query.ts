import { prisma } from "@/lib/prisma";

export type UserEditRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
};

export async function getUserEditQuery(
  userId: string,
): Promise<UserEditRecord | null> {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
}
