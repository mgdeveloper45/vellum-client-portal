import {
  BOOKING_CANCELLATION_RATE_CRITICAL,
  BOOKING_CANCELLATION_RATE_HIGH,
  BOOKING_CONFIRMATION_RATE_CRITICAL,
  BOOKING_CONFIRMATION_RATE_TARGET,
  BOOKING_LOW_AVAILABLE_SLOT_COUNT,
  BOOKING_MINIMUM_SAMPLE_SIZE,
  BOOKING_UTILIZATION_HIGH,
  BOOKING_UTILIZATION_LOW,
} from "./booking-thresholds";
import type { SignalProducer } from "./signal-producer";
import type { BusinessSignal } from "./signal-types";

export interface BookingSignalInput {
  /**
   * Historical bookings included in the reporting period.
   */
  totalBookings: number;

  /**
   * Historical bookings currently confirmed.
   */
  confirmedBookings: number;

  /**
   * Historical bookings currently cancelled.
   */
  cancelledBookings: number;

  /**
   * Future bookings currently scheduled.
   */
  upcomingBookings: number;

  /**
   * Future appointment slots that remain available.
   */
  availableSlots: number;
}

function calculatePercentage(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function createBookingSignals({
  totalBookings,
  confirmedBookings,
  cancelledBookings,
  upcomingBookings,
  availableSlots,
}: BookingSignalInput): readonly BusinessSignal[] {
  const signals: BusinessSignal[] = [];

  const hasMeaningfulHistory = totalBookings >= BOOKING_MINIMUM_SAMPLE_SIZE;

  const cancellationRate = calculatePercentage(
    cancelledBookings,
    totalBookings,
  );

  const confirmationRate = calculatePercentage(
    confirmedBookings,
    totalBookings,
  );

  const futureCapacity = upcomingBookings + availableSlots;

  const utilizationRate = calculatePercentage(upcomingBookings, futureCapacity);

  if (
    hasMeaningfulHistory &&
    cancellationRate >= BOOKING_CANCELLATION_RATE_HIGH
  ) {
    signals.push({
      id: "booking-cancellation-rate",
      category: "BOOKINGS",
      severity:
        cancellationRate >= BOOKING_CANCELLATION_RATE_CRITICAL
          ? "CRITICAL"
          : "HIGH",
      title: "Booking cancellation rate is elevated",
      description: `${cancellationRate}% of bookings in the reporting period were cancelled.`,
      recommendation:
        "Review cancellation reasons and strengthen reminders or confirmation policies.",
      impact: Math.min(100, 50 + cancellationRate),
      urgency: cancellationRate >= BOOKING_CANCELLATION_RATE_CRITICAL ? 90 : 75,
      confidence: 90,
      metadata: {
        totalBookings,
        cancelledBookings,
        cancellationRate,
      },
    });
  }

  if (
    hasMeaningfulHistory &&
    confirmationRate < BOOKING_CONFIRMATION_RATE_TARGET
  ) {
    signals.push({
      id: "booking-confirmation-rate",
      category: "BOOKINGS",
      severity:
        confirmationRate < BOOKING_CONFIRMATION_RATE_CRITICAL
          ? "CRITICAL"
          : "HIGH",
      title: "Booking confirmation rate is below target",
      description: `The current booking confirmation rate is ${confirmationRate}%.`,
      recommendation:
        "Follow up on unconfirmed bookings and review the confirmation workflow.",
      impact: Math.min(100, 100 - confirmationRate),
      urgency: confirmationRate < BOOKING_CONFIRMATION_RATE_CRITICAL ? 85 : 70,
      confidence: 90,
      metadata: {
        totalBookings,
        confirmedBookings,
        confirmationRate,
      },
    });
  }

  if (futureCapacity > 0 && utilizationRate < BOOKING_UTILIZATION_LOW) {
    signals.push({
      id: "booking-low-utilization",
      category: "BOOKINGS",
      severity: utilizationRate < 20 ? "HIGH" : "MEDIUM",
      title: "Upcoming booking utilization is low",
      description: `Only ${utilizationRate}% of available future booking capacity is currently filled.`,
      recommendation:
        "Promote available appointment times and follow up with prospective or returning clients.",
      impact: Math.min(100, 100 - utilizationRate),
      urgency: utilizationRate < 20 ? 75 : 55,
      confidence: 85,
      metadata: {
        upcomingBookings,
        availableSlots,
        utilizationRate,
      },
    });
  }

  if (
    futureCapacity > 0 &&
    utilizationRate >= BOOKING_UTILIZATION_HIGH &&
    availableSlots <= BOOKING_LOW_AVAILABLE_SLOT_COUNT
  ) {
    signals.push({
      id: "booking-capacity-pressure",
      category: "BOOKINGS",
      severity: availableSlots === 0 ? "HIGH" : "MEDIUM",
      title: "Booking capacity is nearly full",
      description: `${utilizationRate}% of future booking capacity is filled, with ${availableSlots} slots remaining.`,
      recommendation:
        "Review staffing or scheduling capacity before additional demand is lost.",
      impact: Math.min(100, utilizationRate),
      urgency: availableSlots === 0 ? 85 : 65,
      confidence: 90,
      metadata: {
        upcomingBookings,
        availableSlots,
        utilizationRate,
      },
    });
  }

  if (
    hasMeaningfulHistory &&
    cancellationRate < 10 &&
    confirmationRate >= BOOKING_CONFIRMATION_RATE_TARGET &&
    futureCapacity > 0 &&
    utilizationRate >= BOOKING_UTILIZATION_LOW &&
    utilizationRate < BOOKING_UTILIZATION_HIGH
  ) {
    signals.push({
      id: "booking-healthy-pipeline",
      category: "BOOKINGS",
      severity: "LOW",
      title: "Booking pipeline is healthy",
      description:
        "Booking confirmation, cancellation, and future utilization indicators are within healthy ranges.",
      recommendation:
        "Continue the current booking and client-reminder practices.",
      impact: 20,
      urgency: 10,
      confidence: 90,
      metadata: {
        cancellationRate,
        confirmationRate,
        utilizationRate,
      },
    });
  }

  return Object.freeze(signals);
}

export const bookingSignalProducer: SignalProducer<BookingSignalInput> =
  Object.freeze({
    build: createBookingSignals,
  });

/**
 * Backward-compatible functional API matching the other signal domains.
 */
export function buildBookingSignals(
  input: BookingSignalInput,
): readonly BusinessSignal[] {
  return bookingSignalProducer.build(input);
}
