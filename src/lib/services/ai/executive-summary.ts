export type ExecutiveSummary = {
  overallHealth: number;
  revenueHealth: number;
  clientHealth: number;
  workspaceHealth: number;
  bookingHealth: number;
  generatedAt: Date;
};

export function buildExecutiveSummary(
  summary: ExecutiveSummary,
): ExecutiveSummary {
  return summary;
}
