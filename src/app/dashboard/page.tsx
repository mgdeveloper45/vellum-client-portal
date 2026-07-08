import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasProfessionalPlan } from "@/lib/subscription";
import { AICommandCenter } from "@/components/ai/command-center";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { DashboardScheduleSection } from "@/components/dashboard/dashboard-schedule-section";
import { DashboardRecentActivitySection } from "@/components/dashboard/dashboard-recent-activity-section";
import { buildFinanceEngine } from "@/lib/services/finance/finance-engine";
import { WorkspaceAICard } from "@/components/dashboard/workspace-ai-card";
import { BookingsTrendChart } from "@/components/dashboard/bookings-trend-chart";
import { ProfessionalMetrics } from "@/components/dashboard/professional-metrics";
import { RevenueSummaryChart } from "@/components/dashboard/revenue-summary-chart";
import { ExecutiveInboxCard } from "@/components/dashboard/executive-inbox-card";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { WorkspaceActionsCard } from "@/components/dashboard/workspace-actions-card";
import { WorkspaceMissionCard } from "@/components/dashboard/workspace-mission-card";
import { WorkspaceRiskCard } from "@/components/dashboard/workspace-risk-card";
import { WorkspaceHealthCard } from "@/components/dashboard/workspace-health-card";
import { WorkspaceCommandCenter } from "@/components/dashboard/workspace-command-center";
import { WorkspaceOpportunityCard } from "@/components/dashboard/workspace-opportunity-card";
import { buildTimelineFromRecommendations } from "@/lib/services/timeline/timeline-builder";
import { buildRecommendationEngine } from "@/lib/services/intelligence/recommendation-engine";
import { WorkspaceQuickActionsDock } from "@/components/dashboard/workspace-quick-actions-dock";
import { WorkspaceExecutiveBriefCard } from "@/components/dashboard/workspace-executive-brief-card";
import { WorkspaceRevenueOpportunityCard } from "@/components/dashboard/workspace-revenue-opportunity-card";
import { buildWorkspaceEngine } from "@/lib/services/workspace/workspace-engine";
import { buildExecutiveContext } from "@/lib/services/ai/executive-engine";
import { buildExecutiveBrief } from "@/lib/services/ai/executive-brief";
import { buildDashboardContext } from "@/lib/services/dashboard/dashboard-engine";
import { ExecutiveDashboardCard } from "@/components/dashboard/executive-dashboard-card";
import { ExecutiveTimelineCard } from "@/components/dashboard/executive-timeline-card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const isProfessional = await hasProfessionalPlan(session.user.id);

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
      firstName: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return null;
  }

  const workspaceId = currentUser.workspaceId;

  const workspaceProjectFilter =
    session.user.role === "ADMIN"
      ? { workspaceId }
      : { workspaceId, clientId: session.user.id };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayStart.getDate() + 1);

  const nextSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(todayStart);
    date.setDate(todayStart.getDate() + index);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    return {
      date,
      nextDate,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
    };
  });

  const [
    totalClients,
    activeProjects,
    completedProjects,
    totalProjects,
    openInvoices,
    totalInvoices,
    paidInvoices,
    totalRevenue,
    outstandingRevenue,
    pendingMilestones,
    approvedProposals,
    totalProposals,
    todaysBookings,
    upcomingBookings,
    bookingTrendCounts,
    recentActivity,
    recentNotifications,
  ] = await Promise.all([
    session.user.role === "ADMIN"
      ? prisma.user.count({
        where: {
          role: "CLIENT",
          workspaceId,
        },
      })
      : Promise.resolve(1),

    prisma.project.count({
      where: {
        ...workspaceProjectFilter,
        status: "ACTIVE",
      },
    }),

    prisma.project.count({
      where: {
        ...workspaceProjectFilter,
        status: "COMPLETED",
      },
    }),

    prisma.project.count({
      where: workspaceProjectFilter,
    }),

    prisma.invoice.count({
      where: {
        paid: false,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.count({
      where: {
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.count({
      where: {
        paid: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paid: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.invoice.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paid: false,
        project: workspaceProjectFilter,
      },
    }),

    prisma.milestone.count({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
        project: workspaceProjectFilter,
      },
    }),

    prisma.proposal.count({
      where: {
        approved: true,
        project: workspaceProjectFilter,
      },
    }),

    prisma.proposal.count({
      where: {
        project: workspaceProjectFilter,
      },
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: 6,
    }),

    prisma.booking.findMany({
      where: {
        workspaceId,
        date: {
          gte: todayStart,
        },
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        service: true,
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          startTime: "asc",
        },
      ],
      take: 5,
    }),

    Promise.all(
      nextSevenDays.map((day) =>
        prisma.booking.count({
          where: {
            workspaceId,
            date: {
              gte: day.date,
              lt: day.nextDate,
            },
            status: {
              not: "CANCELLED",
            },
          },
        }),
      ),
    ),

    prisma.auditLog.findMany({
      where: {
        user: {
          workspaceId,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),

    prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  const collectionRate =
    totalInvoices === 0 ? 0 : Math.round((paidInvoices / totalInvoices) * 100);

  const proposalConversionRate =
    totalProposals === 0
      ? 0
      : Math.round((approvedProposals / totalProposals) * 100);

  const projectCompletionRate =
    totalProjects === 0
      ? 0
      : Math.round((completedProjects / totalProjects) * 100);

  const revenueCollected = totalRevenue._sum.amount ?? 0;
  const revenueOutstanding = outstandingRevenue._sum.amount ?? 0;

  const heroMetrics = [
    {
      label: "Bookings Today",
      value: todaysBookings.length,
      helper: "Scheduled appointments",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      helper: "Currently in progress",
    },
    {
      label: "Pending Milestones",
      value: pendingMilestones,
      helper: "Need attention",
    },
    {
      label: "Open Invoices",
      value: openInvoices,
      helper: "Awaiting payment",
    },
    {
      label: "Clients",
      value: totalClients,
      helper: "Total client accounts",
    },
  ];

  const professionalMetrics = [
    {
      label: "Revenue Collected",
      value: `$${revenueCollected.toLocaleString()}`,
      helper: "Paid invoices",
    },
    {
      label: "Outstanding Revenue",
      value: `$${revenueOutstanding.toLocaleString()}`,
      helper: "Awaiting payment",
    },
    {
      label: "Collection Rate",
      value: `${collectionRate}%`,
      helper: "Invoices paid",
    },
    {
      label: "Proposal Conversion",
      value: `${proposalConversionRate}%`,
      helper: "Proposals approved",
    },
    {
      label: "Project Completion",
      value: `${projectCompletionRate}%`,
      helper: "Projects completed",
    },
  ];

  const bookingTrendData = nextSevenDays.map((day, index) => ({
    label: day.label,
    count: bookingTrendCounts[index] ?? 0,
  }));

  const workspaceEngine = buildWorkspaceEngine({
    overdueInvoices: openInvoices,
    todaysBookings: todaysBookings.length,
    bookingsNeedingAttention: 0,
    outstandingRevenue: revenueOutstanding,
    pendingProposals: totalProposals - approvedProposals,
    completedProjects,
  });

  const financeEngine = buildFinanceEngine({
    totalRevenue: revenueCollected,
    outstandingRevenue: revenueOutstanding,
    overdueInvoices: openInvoices,
    paidInvoices,
    totalInvoices,
  });

  // Executive Inbox aggregates recommendations from every domain.
  // Each engine contributes Recommendation[].
  // The Recommendation Engine merges and prioritizes them.

  const executiveInbox = buildRecommendationEngine(
    workspaceEngine.recommendations,
    financeEngine.recommendations,
    // clientRecommendations,
    // bookingRecommendations,
  );


  const timelineEvents = buildTimelineFromRecommendations(
    executiveInbox,
  );

  const executiveContext = buildExecutiveContext(
    {
      overallHealth: Math.round(
        (
          workspaceEngine.health.score +
          financeEngine.health.score +
          90 +
          90
        ) / 4,
      ),
      revenueHealth: financeEngine.health.score,
      clientHealth: 90,
      workspaceHealth: workspaceEngine.health.score,
      bookingHealth: 90,
      generatedAt: new Date(),
    },
    executiveInbox,
  );

  const executiveBrief = buildExecutiveBrief(executiveContext);

  const dashboardContext = buildDashboardContext({
    executiveContext,
    executiveBrief,
    timeline: timelineEvents,
  });

  return (
    <BrandedDashboardShell>
      <DashboardHero firstName={currentUser.firstName} />
      <WorkspaceCommandCenter>
        <ExecutiveDashboardCard context={dashboardContext} />
        <ExecutiveTimelineCard events={timelineEvents} />
        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <WorkspaceMissionCard
            mission={workspaceEngine.mission}
          />
          <WorkspaceHealthCard
            health={workspaceEngine.health}

          />
        </section>
        <div className="mt-8">
          <WorkspaceExecutiveBriefCard brief={workspaceEngine.executiveBrief} />
        </div>
        <div className="mt-8">
          <WorkspaceRevenueOpportunityCard
            opportunity={workspaceEngine.revenueOpportunity}
          />
        </div>
        <div className="mt-8">
          <WorkspaceRiskCard
            risks={workspaceEngine.risks}
          />
        </div>
        <div className="mt-8">
          <WorkspaceOpportunityCard
            opportunities={workspaceEngine.opportunities}
          />
        </div>
        <div className="mt-8">
          <WorkspaceQuickActionsDock />
        </div>
        <div className="mt-8">
          <ExecutiveInboxCard
            items={executiveInbox}
          />
        </div>
      </WorkspaceCommandCenter>
      {!isProfessional && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <p className="font-medium">Unlock Executive Analytics</p>

          <p className="mt-2 text-sm text-foreground/70">
            Upgrade to Professional to view revenue, collection, proposal, and
            project completion insights.
          </p>
        </div>
      )}

      <MetricsGrid metrics={heroMetrics} />

      {isProfessional && <ProfessionalMetrics metrics={professionalMetrics} />}

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <BookingsTrendChart data={bookingTrendData} />

        <RevenueSummaryChart
          collected={revenueCollected}
          outstanding={revenueOutstanding}
        />
      </section>

      <div className="mt-8">
        <WorkspaceAICard />
      </div>

      <div className="mt-8">
        <WorkspaceActionsCard
          userId={session.user.id}
          workspaceId={workspaceId}
        />
      </div>

      <div className="mt-8">
        <AICommandCenter />
      </div>

      <DashboardScheduleSection
        todaysBookings={todaysBookings}
        upcomingBookings={upcomingBookings}
      />

      <div className="mt-8">
        <ActivityFeed activities={recentNotifications} />
      </div>

      <DashboardRecentActivitySection recentActivity={recentActivity} />
    </BrandedDashboardShell>
  );
}