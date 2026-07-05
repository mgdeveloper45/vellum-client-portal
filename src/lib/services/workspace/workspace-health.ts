import { clampScore } from "@/lib/services/intelligence/score";

export type WorkspaceHealth = {
  score: number;
  label: "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK";
  reasons: string[];
};

type WorkspaceHealthInput = {
  overdueInvoices: number;
  todaysBookings: number;
  bookingsNeedingAttention: number;
};

export function calculateWorkspaceHealth({
  overdueInvoices,
  todaysBookings,
  bookingsNeedingAttention,
}: WorkspaceHealthInput): WorkspaceHealth {
  let score = 100;
  const reasons: string[] = [];

  if (overdueInvoices > 0) {
    score -= overdueInvoices * 10;
    reasons.push(
      `${overdueInvoices} unpaid invoice${overdueInvoices === 1 ? "" : "s"} need follow-up.`,
    );
  }

  if (bookingsNeedingAttention > 0) {
    score -= bookingsNeedingAttention * 15;
    reasons.push(
      `${bookingsNeedingAttention} booking${bookingsNeedingAttention === 1 ? "" : "s"} need attention.`,
    );
  }

  if (todaysBookings === 0) {
    score -= 5;
    reasons.push("No bookings scheduled today.");
  }

  const normalizedScore = clampScore(score);

  return {
    score: normalizedScore,
    label:
      normalizedScore >= 85
        ? "HEALTHY"
        : normalizedScore >= 60
          ? "NEEDS_ATTENTION"
          : "AT_RISK",
    reasons:
      reasons.length > 0
        ? reasons
        : ["Workspace operations look healthy today."],
  };
}
