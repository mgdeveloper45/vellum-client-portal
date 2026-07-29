import { expect } from "vitest";

import type {
  ExecutiveScore,
  ExecutiveScoreContributor,
} from "../executive-score-engine";

import type {
  ExecutiveSignal,
} from "../executive-signals-engine";

export function contributor(
  score: ExecutiveScore,
  key: ExecutiveScoreContributor["key"],
) {
  const result = score.contributors.find((c) => c.key === key);
  expect(result).toBeDefined();
  return result!;
}

export function signalById(
  signals: ExecutiveSignal[],
  id: ExecutiveSignal["id"],
) {
  const signal = signals.find((s) => s.id === id);
  expect(signal).toBeDefined();
  return signal!;
}