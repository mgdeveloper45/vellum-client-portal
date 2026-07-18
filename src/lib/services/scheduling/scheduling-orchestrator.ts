import type { BookingRuleContext } from "./booking-rules";
import { calculateDeposit } from "./deposit-engine";
import {
  createSchedulingDecision,
  type SchedulingDecision,
} from "./scheduling-decision";
import type { SchedulingContext } from "./scheduling-context";

export type SchedulingRequest = SchedulingContext;

export function processScheduling(
  request: SchedulingRequest,
): SchedulingDecision {
  const decision = createSchedulingDecision();

  const bookingRuleContext: BookingRuleContext = {
    serviceId: request.serviceId,
    staffId: request.staffId,
    dayOfWeek: request.bookingDate.getDay(),
    isNewClient: request.isNewClient,
    isVip: request.isVip,
    existingBookingsToday: request.existingBookingsToday,
  };

  decision.deposit = calculateDeposit(
    request.bookingRules,
    bookingRuleContext,
    request.servicePrice,
  );

  return decision;
}
