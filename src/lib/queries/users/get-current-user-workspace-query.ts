import { prisma } from "@/lib/prisma";

export async function getCurrentUserWorkspaceQuery(
  userId: string,
): Promise<string | null> {
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
