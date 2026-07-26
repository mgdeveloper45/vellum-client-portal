import { prisma } from "@/lib/prisma";

export async function getSettingsWorkspaceQuery(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      workspace: true,
    },
  });
}
