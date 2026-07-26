import { prisma } from "@/lib/prisma";

export async function getPublicBookingPageQuery(slug: string) {
  return prisma.workspace.findUnique({
    where: {
      slug,
    },
    include: {
      services: {
        where: {
          active: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
