import { toDomainBookingRule } from "@/lib/mappers/booking-rule-mapper";
import { prisma } from "@/lib/prisma";
import type { BookingRule } from "@/lib/services/scheduling/booking-rules";

export class BookingRuleRepository {
  async getWorkspaceRules(
    workspaceId: string,
  ): Promise<BookingRule[]> {
    const records = await prisma.bookingRule.findMany({
      where: {
        workspaceId,
        enabled: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

    return records.map(toDomainBookingRule);
  }
}

export const bookingRuleRepository =
  new BookingRuleRepository();