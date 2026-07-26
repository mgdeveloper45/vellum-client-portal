import { prisma } from "@/lib/prisma";

export async function listNotificationsQuery(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
