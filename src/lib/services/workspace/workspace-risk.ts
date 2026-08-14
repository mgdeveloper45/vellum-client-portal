export type WorkspaceRisk = {
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  href: string | null;
};

type Input = {
  overdueInvoices: number;
  bookingsNeedingAttention: number;
};

export function calculateWorkspaceRisks({
  overdueInvoices,
  bookingsNeedingAttention,
}: Input): WorkspaceRisk[] {
  const risks: WorkspaceRisk[] = [];

  if (overdueInvoices > 0) {
    risks.push({
      title: "Outstanding payments",
      description: `${overdueInvoices} invoice${
        overdueInvoices === 1 ? "" : "s"
      } need follow-up.`,
      severity: "HIGH",
      href: "/invoices",
    });
  }

  if (bookingsNeedingAttention > 0) {
    risks.push({
      title: "Bookings need attention",
      description: `${bookingsNeedingAttention} booking${
        bookingsNeedingAttention === 1 ? "" : "s"
      } may require preparation.`,
      severity: "MEDIUM",
      href: "/bookings",
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: "No major risks detected",
      description: "Your workspace looks stable right now.",
      severity: "LOW",
      href: null,
    });
  }

  return risks;
}
