import { calculateWorkspaceRisks } from "./workspace-risk";
import { calculateWorkspaceHealth } from "./workspace-health";
import { determineWorkspaceMission } from "./workspace-mission";
import { calculateWorkspaceOpportunities } from "./workspace-opportunity";
import { calculateRevenueOpportunity } from "./workspace-revenue-opportunity";
import { generateWorkspaceExecutiveBrief } from "./workspace-executive-brief";
import { buildExecutiveInbox } from "@/lib/services/intelligence/executive-inbox";
import type { Recommendation } from "@/lib/services/intelligence/recommendation";

export type WorkspaceEngineInput = {
  overdueInvoices: number;
  todaysBookings: number;
  bookingsNeedingAttention: number;
  outstandingRevenue: number;
  pendingProposals: number;
  completedProjects: number;
};

export function buildWorkspaceEngine({
  overdueInvoices,
  todaysBookings,
  bookingsNeedingAttention,
  outstandingRevenue,
  pendingProposals,
  completedProjects,
}: WorkspaceEngineInput) {
  const mission = determineWorkspaceMission({
    overdueInvoices,
    todaysBookings,
    bookingsNeedingAttention,
  });
  const health = calculateWorkspaceHealth({
    overdueInvoices,
    todaysBookings,
    bookingsNeedingAttention,
  });
  const executiveBrief = generateWorkspaceExecutiveBrief({
    todaysBookings,
    overdueInvoices,
    outstandingRevenue,
    workspaceHealth: health.score,
  });
  const revenueOpportunity = calculateRevenueOpportunity({
    overdueInvoices,
    outstandingRevenue,
  });
  const risks = calculateWorkspaceRisks({
    overdueInvoices,
    bookingsNeedingAttention,
  });
  const opportunities = calculateWorkspaceOpportunities({
  pendingProposals,
  completedProjects,
  outstandingRevenue,
});
const executiveInboxItems: Recommendation[] = [
  ...risks.map((risk): Recommendation => ({
    id: `risk-${risk.title}`,
    title: risk.title,
    description: risk.description,
    priority:
      risk.severity === "HIGH"
        ? "HIGH"
        : risk.severity === "MEDIUM"
          ? "MEDIUM"
          : "LOW",
    href: "/dashboard",
    category: "WORKSPACE",
  })),

  ...opportunities.map((opportunity): Recommendation => ({
    id: `opportunity-${opportunity.title}`,
    title: opportunity.title,
    description: opportunity.description,
    priority: opportunity.priority,
    href: "/dashboard",
    category: "GROWTH",
  })),
];

const executiveInbox = buildExecutiveInbox(executiveInboxItems);

  return {
    mission,
    health,
    executiveBrief,
    revenueOpportunity,
    risks,
    opportunities,
    executiveInbox,
  };
}
