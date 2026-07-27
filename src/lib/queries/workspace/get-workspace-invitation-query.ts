import { prisma } from "@/lib/prisma";

export async function getWorkspaceInvitationQuery(token: string) {
  return prisma.workspaceInvitation.findUnique({
    where: {
      token,
    },
    include: {
      workspace: true,
    },
  });
}
