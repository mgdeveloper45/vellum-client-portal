import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { formatActivityTitle } from "@/lib/activity";

/**
 * Dashboard page.
 * Shows workspace-aware business metrics from PostgreSQL.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return null;
  }

  const workspaceProjectFilter =
    session.user.role === "ADMIN"
      ? {
          workspaceId: currentUser.workspaceId,
        }
      : {
          workspaceId: currentUser.workspaceId,
          clientId: session.user.id,
        };

  const totalClients =
    session.user.role === "ADMIN"
      ? await prisma.user.count({
          where: {
            role: "CLIENT",
            workspaceId: currentUser.workspaceId,
          },
        })
      : 1;

  const activeProjects = await prisma.project.count({
    where: {
      ...workspaceProjectFilter,
      status: "ACTIVE",
    },
  });

  const completedProjects = await prisma.project.count({
    where: {
      ...workspaceProjectFilter,
      status: "COMPLETED",
    },
  });

  const totalProjects = await prisma.project.count({
    where: workspaceProjectFilter,
  });

  const openInvoices = await prisma.invoice.count({
    where: {
      paid: false,
      project: workspaceProjectFilter,
    },
  });

  const totalInvoices = await prisma.invoice.count({
    where: {
      project: workspaceProjectFilter,
    },
  });

  const paidInvoices = await prisma.invoice.count({
    where: {
      paid: true,
      project: workspaceProjectFilter,
    },
  });

  const totalRevenue = await prisma.invoice.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      paid: true,
      project: workspaceProjectFilter,
    },
  });

  const outstandingRevenue = await prisma.invoice.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      paid: false,
      project: workspaceProjectFilter,
    },
  });

  const pendingMilestones = await prisma.milestone.count({
    where: {
      status: {
        in: ["PENDING", "IN_PROGRESS"],
      },
      project: workspaceProjectFilter,
    },
  });

  const approvedProposals = await prisma.proposal.count({
    where: {
      approved: true,
      project: workspaceProjectFilter,
    },
  });

  const totalProposals = await prisma.proposal.count({
    where: {
      project: workspaceProjectFilter,
    },
  });

  const recentActivity = await prisma.auditLog.findMany({
    where: {
      user: {
        workspaceId: currentUser.workspaceId,
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const collectionRate =
    totalInvoices === 0
      ? 0
      : Math.round((paidInvoices / totalInvoices) * 100);

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

  const metrics = [
    {
      label: "Clients",
      value: totalClients,
      helper: "Total client accounts",
    },
    {
      label: "Active Projects",
      value: activeProjects,
      helper: "Projects currently active",
    },
    {
      label: "Open Invoices",
      value: openInvoices,
      helper: "Invoices awaiting payment",
    },
    {
      label: "Pending Milestones",
      value: pendingMilestones,
      helper: "Milestones still in progress",
    },
    {
      label: "Approved Proposals",
      value: approvedProposals,
      helper: "Accepted client proposals",
    },
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
    {
      label: "Activity Events",
      value: recentActivity.length,
      helper: "Recent audit events",
    },
  ];

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-light">Dashboard</h1>

        <p className="mt-2 text-foreground/70">
          A real-time overview of clients, projects, invoices, and milestones.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm text-foreground/60">{metric.label}</p>

            <p className="mt-4 text-3xl font-light">{metric.value}</p>

            <p className="mt-3 text-sm text-foreground/60">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-light">Recent Activity</h2>

        <div className="mt-4 grid gap-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="font-medium">{formatActivityTitle(activity)}</p>

              <p className="mt-1 text-sm text-foreground/70">
                {activity.user
                  ? `${activity.user.firstName} ${activity.user.lastName}`
                  : "System"}
              </p>

              <p className="mt-2 text-sm text-foreground/60">
                {activity.entity}
              </p>

              <p className="mt-2 text-xs text-foreground/50">
                {activity.createdAt.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}