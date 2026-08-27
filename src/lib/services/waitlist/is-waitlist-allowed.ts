import type { BookingRule } from "@/lib/services/scheduling/booking-rules";

export function isWaitlistAllowed(
  rules: BookingRule[],
  serviceId: string,
): boolean {
  return rules.some(
    (rule) =>
      rule.enabled &&
      rule.type === "ALLOW_WAITLIST" &&
      (!rule.appliesToServiceId ||
        rule.appliesToServiceId === serviceId),
  );
}
