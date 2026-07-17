import { SchedulingContext } from "./scheduling-context";
import { BookingRuleContext } from "./booking-rules";
import { calculateDeposit, DepositCalculationResult } from "./deposit-engine";

export type SchedulingRequest = SchedulingContext;

export interface SchedulingResult {
  deposit: DepositCalculationResult;
}

export function processScheduling(
  request: SchedulingRequest,
): SchedulingResult {
  const context: BookingRuleContext = {
    serviceId: request.serviceId,
    dayOfWeek: request.bookingDate.getDay(),
    isNewClient: request.isNewClient,
    isVip: request.isVip,
    existingBookingsToday: request.existingBookingsToday,
  };

  const deposit = calculateDeposit(
    request.bookingRules,
    context,
    request.servicePrice,
  );

  return {
    deposit,
  };
}
