import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function loadDashboardWorkspace(userId: string) {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      workspaceId: true,
      firstName: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return null;
  }

  return {
    workspaceId: currentUser.workspaceId,
    firstName: currentUser.firstName,
  };
}

export async function requireDashboardUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session.user;
}
