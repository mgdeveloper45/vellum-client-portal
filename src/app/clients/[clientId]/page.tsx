import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  params: Promise<{
    clientId: string;
  }>;
}

export default async function ClientDetailPage({
  params,
}: Props) {
  const { clientId } = await params;

  const client = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
    include: {
      clientProjects: {
        include: {
          messages: true,
          invoices: true,
          proposals: true,
        },
      },
    },
  });

  if (!client) {
    return (
      <DashboardShell>
        <p>Client not found.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light">
            {client.firstName} {client.lastName}
          </h1>

          <p className="mt-2 text-foreground/70">
            {client.email}
          </p>

        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/clients/${client.id}/edit`}
            className="rounded-full border border-border px-4 py-2 text-sm"
          >
            Edit Client
          </Link>

          <div
            className={`rounded-full px-4 py-2 text-sm ${client.isBlacklisted
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
              }`}
          >
            {client.isBlacklisted ? "Blacklisted" : "Active Client"}
          </div>
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-foreground/60">
            Projects
          </p>

          <p className="mt-2 text-3xl font-light">
            {client.clientProjects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-foreground/60">
            Messages
          </p>

          <p className="mt-2 text-3xl font-light">
            {client.clientProjects.reduce(
              (total, project) =>
                total + project.messages.length,
              0
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-foreground/60">
            Invoices
          </p>

          <p className="mt-2 text-3xl font-light">
            {client.clientProjects.reduce(
              (total, project) =>
                total + project.invoices.length,
              0
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-foreground/60">
            Proposals
          </p>

          <p className="mt-2 text-3xl font-light">
            {client.clientProjects.reduce(
              (total, project) =>
                total + project.proposals.length,
              0
            )}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-medium">
          Client Notes
        </h2>

        <p className="mt-4 text-foreground/80">
          {client.notes || "No notes available."}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-medium">
          Projects
        </h2>

        <div className="mt-4 space-y-3">
          {client.clientProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-border p-4"
            >
              <h3>{project.name}</h3>

              <p className="mt-1 text-sm text-foreground/60">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}