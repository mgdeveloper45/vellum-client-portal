import {
  checkAvailability,
  type AvailabilityResult,
} from "./availability-engine";
import type { BookingRuleContext } from "./booking-rules";
import { calculateDeposit } from "./deposit-engine";
import {
  createSchedulingDecision,
  type SchedulingDecision,
} from "./scheduling-decision";
import type { SchedulingContext } from "./scheduling-context";
import { AdvanceNoticePolicy } from "./policies/advance-notice-policy";
import { PolicyPipeline } from "./policies/policy-pipeline";

export type SchedulingRequest = SchedulingContext;

function applyAvailabilityResult(
  decision: SchedulingDecision,
  availability: AvailabilityResult,
): void {
  decision.availability = availability;

  if (!availability.available) {
    decision.allowed = false;

    if (availability.reason) {
      decision.reasons.push(availability.reason);
    }
  }
}

export async function processScheduling(
  request: SchedulingRequest,
): Promise<SchedulingDecision> {
  const decision = createSchedulingDecision();

  const policyPipeline = new PolicyPipeline([new AdvanceNoticePolicy()]);

  await policyPipeline.evaluate(request, decision);

  if (!decision.allowed) {
    return decision;
  }

  const availability = await checkAvailability({
    workspaceId: request.workspaceId,
    bookingDate: request.bookingDate,
    startTime: request.bookingStartTime,
    endTime: request.bookingEndTime,
    excludeBookingId: request.excludeBookingId,
  });

  applyAvailabilityResult(decision, availability);

  if (!decision.allowed) {
    return decision;
  }

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
