import { prisma } from "@/lib/prisma";

export async function listServicesQuery(workspaceId: string) {
  return prisma.service.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
