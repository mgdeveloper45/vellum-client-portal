import { prisma } from "@/lib/prisma";

export async function getWorkspacePageQuery(
  workspaceId: string,
  includeInvitations: boolean,
) {
  const membersPromise = prisma.user.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      firstName: "asc",
    },
  });

  const invitationsPromise = includeInvitations
    ? prisma.workspaceInvitation.findMany({
        where: {
          workspaceId,
          acceptedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : Promise.resolve([]);

  const [members, invitations] = await Promise.all([
    membersPromise,
    invitationsPromise,
  ]);

  return {
    members,
    invitations,
  };
}
