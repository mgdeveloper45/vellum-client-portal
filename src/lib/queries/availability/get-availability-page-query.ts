import { prisma } from "@/lib/prisma";

export async function getAvailabilityPageQuery(workspaceId: string) {
  const [services, businessHours] = await Promise.all([
    prisma.service.findMany({
      where: {
        workspaceId,
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.businessHour.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        dayOfWeek: "asc",
      },
    }),
  ]);

  return {
    services,
    businessHours,
  };
}
