import { BookingRule, BookingRuleContext } from "./booking-rules";
import { calculateDeposit, DepositCalculationResult } from "./deposit-engine";

export interface SchedulingRequest {
  serviceId: string;
  servicePrice: number;
  bookingDate: Date;
  isNewClient: boolean;
  isVip: boolean;
  existingBookingsToday: number;
  bookingRules: BookingRule[];
}

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
