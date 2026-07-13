import {
  getExecutiveBrief,
  saveExecutiveBrief,
} from "@/lib/services/ai/executive-brief-cache";
import { createAiProvider } from "@/lib/services/ai/ai-provider-factory";
import { ExecutiveNarrativeService } from "@/lib/services/ai/executive-narrative-service";
import { loadDashboardData } from "@/lib/services/dashboard/dashboard-data-loader";
import { buildDashboardOrchestrator } from "@/lib/services/dashboard/dashboard-orchestrator";

type BuildDashboardInput = {
  userId: string;
  userName?: string | null;
  userRole: string;
  workspaceId: string;
};

export async function buildDashboard({
  userId,
  userName,
  userRole,
  workspaceId,
}: BuildDashboardInput) {
  const data = await loadDashboardData({
    id: userId,
    role: userRole,
    workspaceId,
  });

  const revenueCollected =
    data.totalRevenue._sum.amount ?? 0;

  const revenueOutstanding =
    data.outstandingRevenue._sum.amount ?? 0;

  const firstName =
    userName?.split(" ")[0] ?? null;

  const dashboard = buildDashboardOrchestrator({
    firstName,

    totalClients: data.totalClients,
    activeProjects: data.activeProjects,
    completedProjects: data.completedProjects,
    totalProjects: data.totalProjects,

    openInvoices: data.openInvoices,
    totalInvoices: data.totalInvoices,
    paidInvoices: data.paidInvoices,

    revenueCollected,
    revenueOutstanding,

    pendingMilestones: data.pendingMilestones,
    approvedProposals: data.approvedProposals,
    totalProposals: data.totalProposals,

    todaysBookings: data.todaysBookings.length,
    upcomingBookings: data.upcomingBookings.length,

    bookingTrendCounts: data.bookingTrendCounts,
    nextSevenDayLabels: data.nextSevenDays.map(
      (day) => day.label,
    ),

    recentActivity: data.recentActivity,
  });

  const cachedBrief =
    await getExecutiveBrief(workspaceId);

  let aiResult: {
    narrative: string;
    provider: string;
    durationMs: number;
    mode: "mock" | "production";
  };

  if (cachedBrief) {
    aiResult = {
      narrative: cachedBrief.narrative,
      provider: cachedBrief.provider,
      durationMs: cachedBrief.durationMs,
      mode: cachedBrief.mode as
        | "mock"
        | "production",
    };
  } else {
    const provider = createAiProvider();

    const narrativeService =
      new ExecutiveNarrativeService(provider);

    aiResult = await narrativeService.generate(
      dashboard.dashboardContext,
    );

    await saveExecutiveBrief(
      workspaceId,
      aiResult,
    );
  }

  return {
    ...dashboard,
    aiResult,
    firstName,
    revenueCollected,
    revenueOutstanding,

    todaysBookings: data.todaysBookings,
    upcomingBookings: data.upcomingBookings,
    recentActivity: data.recentActivity,
    recentNotifications: data.recentNotifications,
  };
}

export type DashboardViewModel =
  Awaited<ReturnType<typeof buildDashboard>>;