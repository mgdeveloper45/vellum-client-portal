import { BusinessSignal } from "./signal-types";


/**
 * Contract implemented by deterministic business-signal producers.
 *
 * Producers:
 * - accept domain-specific input;
 * - contain no persistence or UI logic;
 * - return immutable business signals;
 * - do not rank their own output.
 */
export interface SignalProducer<TInput> {
  build(input: TInput): readonly BusinessSignal[];
}
