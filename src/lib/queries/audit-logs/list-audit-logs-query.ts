import { prisma } from "@/lib/prisma";

export async function listAuditLogsQuery() {
  return prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
}
