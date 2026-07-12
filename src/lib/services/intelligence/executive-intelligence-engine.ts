export type ExecutiveInsightPriority = "HIGH" | "MEDIUM" | "LOW";

export type ExecutiveInsightDomain =
  "FINANCE" | "BOOKINGS" | "CLIENTS" | "PROJECTS" | "WORKSPACE";

export type ExecutiveInsight = {
  id: string;
  domain: ExecutiveInsightDomain;
  priority: ExecutiveInsightPriority;
  title: string;
  explanation: string;
  impact: string;
  recommendedAction: string;
  href: string;
};

export type ExecutiveIntelligenceInput = {
  finance: {
    outstandingRevenue: number;
    overdueInvoices: number;
    collectionRate: number;
  };

  bookings: {
    todaysBookings: number;
    nextSevenDaysBookings: number;
    bookingsNeedingAttention: number;
  };

  clients: {
    totalClients: number;
    followUpsDue: number;
  };

  projects: {
    activeProjects: number;
    pendingMilestones: number;
    pendingProposals: number;
  };

  workspace: {
    healthScore: number;
  };
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function buildExecutiveIntelligence(
  input: ExecutiveIntelligenceInput,
): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];

  if (
    input.finance.overdueInvoices > 0 &&
    input.finance.outstandingRevenue > 0
  ) {
    insights.push({
      id: "recover-outstanding-revenue",
      domain: "FINANCE",
      priority: "HIGH",
      title: "Recover outstanding revenue",
      explanation: `${input.finance.overdueInvoices} overdue ${
        input.finance.overdueInvoices === 1
          ? "invoice requires"
          : "invoices require"
      } follow-up.`,
      impact: `${formatCurrency(
        input.finance.outstandingRevenue,
      )} is currently awaiting collection.`,
      recommendedAction:
        "Review overdue invoices and contact the highest-value client first.",
      href: "/invoices",
    });
  }

  if (input.bookings.bookingsNeedingAttention > 0) {
    insights.push({
      id: "review-bookings-needing-attention",
      domain: "BOOKINGS",
      priority: "HIGH",
      title: "Review bookings needing attention",
      explanation: `${input.bookings.bookingsNeedingAttention} ${
        input.bookings.bookingsNeedingAttention === 1
          ? "booking requires"
          : "bookings require"
      } operational review.`,
      impact:
        "Resolving booking issues early protects schedule reliability and client experience.",
      recommendedAction:
        "Open the booking calendar and resolve the most urgent booking first.",
      href: "/bookings",
    });
  }

  if (input.clients.followUpsDue > 0) {
    insights.push({
      id: "complete-client-follow-ups",
      domain: "CLIENTS",
      priority: "MEDIUM",
      title: "Complete client follow-ups",
      explanation: `${input.clients.followUpsDue} client ${
        input.clients.followUpsDue === 1 ? "follow-up is" : "follow-ups are"
      } due.`,
      impact:
        "Timely follow-up can improve retention, repeat bookings, and client satisfaction.",
      recommendedAction:
        "Contact the highest-value or longest-waiting client first.",
      href: "/clients",
    });
  }

  if (input.projects.pendingMilestones > 0) {
    insights.push({
      id: "review-pending-milestones",
      domain: "PROJECTS",
      priority: "MEDIUM",
      title: "Review pending milestones",
      explanation: `${input.projects.pendingMilestones} ${
        input.projects.pendingMilestones === 1
          ? "milestone needs"
          : "milestones need"
      } attention.`,
      impact: "Clearing milestone blockers helps projects remain on schedule.",
      recommendedAction:
        "Review milestone owners, due dates, and blocked work.",
      href: "/projects",
    });
  }

  if (input.projects.pendingProposals > 0) {
    insights.push({
      id: "advance-pending-proposals",
      domain: "PROJECTS",
      priority: "MEDIUM",
      title: "Advance pending proposals",
      explanation: `${input.projects.pendingProposals} ${
        input.projects.pendingProposals === 1 ? "proposal is" : "proposals are"
      } still awaiting a decision.`,
      impact:
        "Faster proposal follow-up can improve conversion and future revenue.",
      recommendedAction:
        "Review the oldest pending proposal and send a follow-up.",
      href: "/proposals",
    });
  }

  if (
    input.bookings.todaysBookings === 0 &&
    input.bookings.nextSevenDaysBookings === 0
  ) {
    insights.push({
      id: "increase-booking-demand",
      domain: "BOOKINGS",
      priority: "MEDIUM",
      title: "Increase booking demand",
      explanation:
        "There are no active bookings today or during the next seven days.",
      impact:
        "Unused availability may reduce short-term revenue and team utilization.",
      recommendedAction:
        "Review availability, client outreach, and service promotion opportunities.",
      href: "/availability",
    });
  }

  if (input.finance.collectionRate < 70) {
    insights.push({
      id: "improve-collection-rate",
      domain: "FINANCE",
      priority: "MEDIUM",
      title: "Improve collection performance",
      explanation: `Your current invoice collection rate is ${input.finance.collectionRate}%.`,
      impact:
        "A low collection rate can weaken cash flow even when sales remain healthy.",
      recommendedAction:
        "Review payment terms and follow up on unpaid invoices.",
      href: "/invoices",
    });
  }

  if (input.workspace.healthScore < 50) {
    insights.push({
      id: "stabilize-workspace-health",
      domain: "WORKSPACE",
      priority: "HIGH",
      title: "Stabilize workspace operations",
      explanation: `Workspace health is currently ${input.workspace.healthScore}%.`,
      impact:
        "Multiple operational issues may be affecting business performance.",
      recommendedAction:
        "Review the highest-priority finance, booking, and project issues first.",
      href: "/dashboard",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "maintain-business-momentum",
      domain: "WORKSPACE",
      priority: "LOW",
      title: "Maintain business momentum",
      explanation:
        "No urgent operational, financial, or booking issues were detected.",
      impact:
        "The workspace is currently positioned for stable daily execution.",
      recommendedAction:
        "Review today’s schedule and focus on delivering excellent client service.",
      href: "/dashboard",
    });
  }

  const priorityOrder: Record<ExecutiveInsightPriority, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  return insights.sort(
    (left, right) =>
      priorityOrder[left.priority] - priorityOrder[right.priority],
  );
}
