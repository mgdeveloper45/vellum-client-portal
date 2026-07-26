import { prisma } from "@/lib/prisma";

export async function listBusinessHoursQuery(workspaceId: string) {
  return prisma.businessHour.findMany({
    where: {
      workspaceId,
    },
  });
}
