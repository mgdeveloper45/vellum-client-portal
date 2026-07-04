import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatActivityTitle } from "@/lib/activity";
import { hasProfessionalPlan } from "@/lib/subscription";
import { AICommandCenter } from "@/components/ai/command-center";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { WorkspaceAICard } from "@/components/dashboard/workspace-ai-card";
import { BookingsTrendChart } from "@/components/dashboard/bookings-trend-chart";
import { ProfessionalMetrics } from "@/components/dashboard/professional-metrics";
import { RevenueSummaryChart } from "@/components/dashboard/revenue-summary-chart";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { WorkspaceActionsCard } from "@/components/dashboard/workspace-actions-card";
import { WorkspaceMissionCard } from "@/components/dashboard/workspace-mission-card";
import { WorkspaceRiskCard } from "@/components/dashboard/workspace-risk-card";
import { WorkspaceHealthCard } from "@/components/dashboard/workspace-health-card";
import { WorkspaceCommandCenter } from "@/components/dashboard/workspace-command-center";
import { WorkspaceOpportunityCard } from "@/components/dashboard/workspace-opportunity-card";
import { WorkspaceExecutiveBriefCard } from "@/components/dashboard/workspace-executive-brief-card";
import { WorkspaceRevenueOpportunityCard } from "@/components/dashboard/workspace-revenue-opportunity-card";
import { buildWorkspaceEngine } from "@/lib/services/workspace/workspace-engine";

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

  return (
    <BrandedDashboardShell>
      <DashboardHero firstName={currentUser.firstName} />
      <WorkspaceCommandCenter>
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

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-light">Today&apos;s Schedule</h2>

              <p className="mt-1 text-sm text-foreground/60">
                Your upcoming appointments for today.
              </p>
            </div>

            <Link href="/bookings" className="text-sm workspace-accent-text">
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {todaysBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
                No bookings scheduled for today.
              </div>
            ) : (
              todaysBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>

                      <p className="mt-1 text-sm text-foreground/60">
                        {booking.service.name}
                      </p>
                    </div>

                    <p className="workspace-accent-badge rounded-full px-3 py-1 text-sm">
                      {booking.startTime}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl font-light">Upcoming</h2>

          <p className="mt-1 text-sm text-foreground/60">
            Next scheduled appointments.
          </p>

          <div className="mt-6 grid gap-3">
            {upcomingBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
                No upcoming bookings yet.
              </div>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <p className="font-medium">{booking.customerName}</p>

                  <p className="mt-1 text-sm text-foreground/60">
                    {booking.service.name}
                  </p>

                  <p className="mt-2 text-xs text-foreground/50">
                    {booking.date.toLocaleDateString()} · {booking.startTime}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="mt-8">
        <ActivityFeed activities={recentNotifications} />
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-2xl font-light">Recent Activity</h2>

        <div className="mt-5 grid gap-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <p className="font-medium">{formatActivityTitle(activity)}</p>

              <p className="mt-1 text-sm text-foreground/70">
                {activity.user
                  ? `${activity.user.firstName} ${activity.user.lastName}`
                  : "System"}
              </p>

              <p className="mt-2 text-xs text-foreground/50">
                {activity.entity} · {activity.createdAt.toLocaleString()}
              </p>
            </div>
          ))}

          {recentActivity.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
              No recent activity yet.
            </div>
          )}
        </div>
      </section>
    </BrandedDashboardShell>
  );
}