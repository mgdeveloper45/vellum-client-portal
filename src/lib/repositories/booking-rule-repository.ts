import { prisma } from "@/lib/prisma";

export class BookingRuleRepository {
  async getWorkspaceRules(workspaceId: string) {
    return prisma.bookingRule.findMany({
      where: {
        workspaceId,
        enabled: true,
      },
      orderBy: {
        priority: "asc",
      },
    });
  }
}

export const bookingRuleRepository = new BookingRuleRepository();