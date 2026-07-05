export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

export function percentage(completed: number, total: number): number {
  if (total <= 0) {
    return 100;
  }

  return clampScore(Math.round((completed / total) * 100));
}
