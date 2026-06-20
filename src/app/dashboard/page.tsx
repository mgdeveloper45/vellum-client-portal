import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard page.
 * Shows real workspace metrics based on the signed-in user's role.
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

  const activeProjects = await prisma.project.count({
    where: projectFilter,
  });

  const openInvoices = await prisma.invoice.count({
    where: {
      paid: false,
      project: projectFilter,
    },
  });

  const pendingProposals = await prisma.proposal.count({
    where: {
      approved: false,
      project: projectFilter,
    },
  });

  const unreadMessages = await prisma.message.count({
    where: {
      project: projectFilter,
    },
  });

  const metrics = [
    {
      label: "Active Projects",
      value: activeProjects,
      helper: "Projects currently in progress",
    },
    {
      label: "Open Invoices",
      value: openInvoices,
      helper: "Invoices awaiting payment",
    },
    {
      label: "Pending Approvals",
      value: pendingProposals,
      helper: "Proposals awaiting approval",
    },
    {
      label: "Messages",
      value: unreadMessages,
      helper: "Project messages on file",
    },
  ];

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-light">Dashboard</h1>
        <p className="mt-2 text-foreground/70">
          Overview of projects, approvals, invoices, and client activity.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
    </DashboardShell>
  );
}