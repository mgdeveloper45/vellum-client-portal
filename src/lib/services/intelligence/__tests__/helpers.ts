import { expect } from "vitest";
import type { ExecutiveAdvice } from "../executive-advisor/executive-advisor-engine";

export function adviceById(
  advice: ExecutiveAdvice[],
  id: ExecutiveAdvice["id"],
) {
  const result = advice.find((item) => item.id === id);
  expect(result).toBeDefined();
  return result!;
}

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