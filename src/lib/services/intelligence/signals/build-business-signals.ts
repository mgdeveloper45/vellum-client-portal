import {
  rankBusinessSignals,
  type RankedBusinessSignal,
} from "./business-signal-engine";
import {
  bookingSignalProducer,
  type BookingSignalInput,
} from "./booking-signals";
import {
  financeSignalProducer,
  type FinanceSignalInput,
} from "./finance-signals";

export interface BusinessSignalInputs {
  finance: FinanceSignalInput;

  /**
   * Optional during the migration period so existing callers remain
   * compatible until booking data is supplied by the intelligence
   * pipeline.
   */
  booking?: BookingSignalInput;
}

/**
 * Single orchestration entry point for deterministic business signals.
 *
 * Domain producers generate signals independently. This orchestrator
 * combines their output and applies cross-domain ranking.
 */
export function buildBusinessSignals({
  finance,
  booking,
}: BusinessSignalInputs): readonly RankedBusinessSignal[] {
  const signals = [
    ...financeSignalProducer.build(finance),
    ...(booking ? bookingSignalProducer.build(booking) : []),
  ];

  return Object.freeze(rankBusinessSignals(signals));
}
