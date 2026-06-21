import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard page.
 * Shows real business metrics from PostgreSQL.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const projectFilter =
    session.user.role === "ADMIN"
      ? {}
      : {
        clientId: session.user.id,
      };

  const totalClients =
    session.user.role === "ADMIN"
      ? await prisma.user.count({
        where: {
          role: "CLIENT",
        },
      })
      : 1;

  const activeProjects = await prisma.project.count({
    where: {
      ...projectFilter,
      status: "ACTIVE",
    },
  });

  const openInvoices = await prisma.invoice.count({
    where: {
      paid: false,
      project: projectFilter,
    },
  });

  const pendingMilestones = await prisma.milestone.count({
    where: {
      status: {
        in: ["PENDING", "IN_PROGRESS"],
      },
      project: projectFilter,
    },
  });

  const approvedProposals = await prisma.proposal.count({
    where: {
      approved: true,
      project: projectFilter,
    },
  });

  const recentMessages = await prisma.message.findMany({
    take: 5,
    where: {
      project: projectFilter,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: true,
      project: true,
    },
  });

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
  ];

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-light">Dashboard</h1>

        <p className="mt-2 text-foreground/70">
          A real-time overview of clients, projects, invoices, and milestones.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-sm text-foreground/60">
              {metric.label}
            </p>

            <p className="mt-4 text-3xl font-light">
              {metric.value}
            </p>

            <p className="mt-3 text-sm text-foreground/60">
              {metric.helper}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-light">
          Recent Activity
        </h2>

        <div className="mt-4 grid gap-3">
          {recentMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <p className="font-medium">
                {message.sender.firstName} {message.sender.lastName}
              </p>

              <p className="text-sm text-foreground/60">
                {message.project.name}
              </p>

              <p className="mt-2 text-sm">
                {message.content}
              </p>

              <p className="mt-2 text-xs text-foreground/50">
                {message.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </DashboardShell>
  );
}