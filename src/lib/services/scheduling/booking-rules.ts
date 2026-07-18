export type BookingRuleType =
  | "REQUIRE_DEPOSIT"
  | "REQUIRE_CARD"
  | "BLOCK_SAME_DAY"
  | "LIMIT_DAILY_BOOKINGS"
  | "ALLOW_WAITLIST"
  | "VIP_PRIORITY"
  | "NEW_CLIENT_ONLY"
  | "RETURNING_CLIENT";

export interface BookingRule {
  id: string;
  name: string;
  type: BookingRuleType;
  enabled: boolean;
  priority: number;

  value?: number | string | boolean;

  appliesToServiceId?: string;
  appliesToStaffId?: string;
  appliesToDayOfWeek?: number;

  startDate?: Date;
  endDate?: Date;
}

export interface BookingRuleContext {
  serviceId: string;

  staffId?: string;

  isNewClient: boolean;

  isVip: boolean;

  dayOfWeek: number;

  existingBookingsToday: number;
}

export function evaluateBookingRules(
  rules: BookingRule[],
  context: BookingRuleContext,
) {
  const activeRules = rules.filter((rule) => {
    if (!rule.enabled) {
      return false;
    }

    if (
      rule.appliesToServiceId &&
      rule.appliesToServiceId !== context.serviceId
    ) {
      return false;
    }

    if (rule.appliesToStaffId && rule.appliesToStaffId !== context.staffId) {
      return false;
    }

    if (
      rule.appliesToDayOfWeek !== undefined &&
      rule.appliesToDayOfWeek !== context.dayOfWeek
    ) {
      return false;
    }

    return true;
  });

  return activeRules;
}
