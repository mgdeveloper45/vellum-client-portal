export type WorkspaceOpportunity = {
  title: string;
  description: string;
  valueLabel: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

type Input = {
  pendingProposals: number;
  completedProjects: number;
  outstandingRevenue: number;
};

export function calculateWorkspaceOpportunities({
  pendingProposals,
  completedProjects,
  outstandingRevenue,
}: Input): WorkspaceOpportunity[] {
  const opportunities: WorkspaceOpportunity[] = [];

  if (outstandingRevenue > 0) {
    opportunities.push({
      title: "Recover outstanding revenue",
      description: "Follow up on unpaid invoices that are ready to collect.",
      valueLabel: `$${outstandingRevenue.toLocaleString()}`,
      priority: "HIGH",
    });
  }

  if (pendingProposals > 0) {
    opportunities.push({
      title: "Convert pending proposals",
      description: `${pendingProposals} proposal${
        pendingProposals === 1 ? "" : "s"
      } may be ready for approval follow-up.`,
      valueLabel: `${pendingProposals} proposal${pendingProposals === 1 ? "" : "s"}`,
      priority: "MEDIUM",
    });
  }

  if (completedProjects > 0) {
    opportunities.push({
      title: "Request client reviews",
      description:
        "Completed projects are strong moments to ask for testimonials or referrals.",
      valueLabel: `${completedProjects} completed`,
      priority: "LOW",
    });
  }

  if (opportunities.length === 0) {
    opportunities.push({
      title: "No major growth opportunities detected",
      description:
        "Your workspace looks stable. Continue monitoring bookings, proposals, and invoices.",
      valueLabel: "All clear",
      priority: "LOW",
    });
  }

  return opportunities;
}
