import type { BookingRuleModel } from "@/lib/generated/prisma/models/BookingRule";
import type {
  BookingRule,
  BookingRuleType,
} from "@/lib/services/scheduling/booking-rules";

const BOOKING_RULE_TYPES: ReadonlySet<BookingRuleType> = new Set([
  "REQUIRE_DEPOSIT",
  "REQUIRE_CARD",
  "BLOCK_SAME_DAY",
  "LIMIT_DAILY_BOOKINGS",
  "ALLOW_WAITLIST",
  "VIP_PRIORITY",
  "NEW_CLIENT_ONLY",
  "RETURNING_CLIENT",
]);

function isBookingRuleType(value: string): value is BookingRuleType {
  return BOOKING_RULE_TYPES.has(value as BookingRuleType);
}

export function toDomainBookingRule(
  rule: BookingRuleModel,
): BookingRule {
  if (!isBookingRuleType(rule.type)) {
    throw new Error(`Unsupported booking rule type: ${rule.type}`);
  }

  return {
    id: rule.id,
    name: rule.name,
    type: rule.type,
    enabled: rule.enabled,
    priority: rule.priority,
    value: rule.value ?? undefined,
    appliesToServiceId: rule.appliesToServiceId ?? undefined,
    appliesToStaffId: rule.appliesToStaffId ?? undefined,
    appliesToDayOfWeek: rule.dayOfWeek ?? undefined,
    startDate: rule.startDate ?? undefined,
    endDate: rule.endDate ?? undefined,
  };
}