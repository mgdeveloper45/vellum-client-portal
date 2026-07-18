import {
  checkAvailability,
  type AvailabilityResult,
} from "./availability-engine";
import type { BookingRuleContext } from "./booking-rules";
import { calculateDeposit } from "./deposit-engine";
import type { PolicyPipeline } from "./policies/policy-pipeline";
import type { SchedulingContext } from "./scheduling-context";
import {
  createSchedulingDecision,
  type SchedulingDecision,
} from "./scheduling-decision";

export type SchedulingRequest = SchedulingContext;

export interface SchedulingDependencies {
  policyPipeline: PolicyPipeline;
}

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
  dependencies: SchedulingDependencies,
): Promise<SchedulingDecision> {
  const decision = createSchedulingDecision();

  await dependencies.policyPipeline.evaluate(request, decision);

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