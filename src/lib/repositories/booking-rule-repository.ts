import { prisma } from "@/lib/prisma";
import { BookingRule } from "@/generated/prisma";

export class BookingRuleRepository {
  async getWorkspaceRules(workspaceId: string): Promise<BookingRule[]> {
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
