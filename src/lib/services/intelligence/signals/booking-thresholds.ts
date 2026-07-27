/**
 * Minimum number of historical bookings required before rate-based
 * booking signals are considered statistically meaningful.
 */
export const BOOKING_MINIMUM_SAMPLE_SIZE = 5;

/**
 * Cancellation-rate thresholds expressed as percentages.
 */
export const BOOKING_CANCELLATION_RATE_HIGH = 25;
export const BOOKING_CANCELLATION_RATE_CRITICAL = 40;

/**
 * Confirmation-rate thresholds expressed as percentages.
 */
export const BOOKING_CONFIRMATION_RATE_TARGET = 70;
export const BOOKING_CONFIRMATION_RATE_CRITICAL = 50;

/**
 * Capacity-utilization thresholds expressed as percentages.
 */
export const BOOKING_UTILIZATION_LOW = 40;
export const BOOKING_UTILIZATION_HIGH = 85;

/**
 * A nearly full schedule with this many or fewer remaining slots is
 * considered an immediate capacity opportunity.
 */
export const BOOKING_LOW_AVAILABLE_SLOT_COUNT = 3;
