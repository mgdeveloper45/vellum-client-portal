import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { buildClientEngine } from "@/lib/services/clients/client-engine";
import { ClientCommandCenter } from "@/components/client-command-center/client-command-center";
import { ClientHeader } from "@/components/client-command-center/client-header";
import { ClientLifetimeValueCard } from "@/components/client-command-center/client-lifetime-value-card";
import { ClientHealthCard } from "@/components/client-command-center/client-health-card";
import { ClientRetentionCard } from "@/components/client-command-center/client-retention-card";
import { ClientOpportunitiesCard } from "@/components/client-command-center/client-opportunities-card";
import { ClientSummaryCard } from "@/components/client-command-center/client-summary-card";
import { MetricCard } from "@/components/ui/metric-card";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { CommandCard } from "@/components/ui/command-card";

interface Props {
  params: Promise<{
    clientId: string;
  }>;
}

export default async function ClientDetailPage({ params }: Props) {
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!client) {
    return (
      <DashboardShell>
        <ExecutiveEmptyState
          title="Client not found"
          description="This client does not exist or may have been removed from the workspace."
          action={
            <Link
              href="/clients"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Back to Clients
            </Link>
          }
        />
      </DashboardShell>
    );
  }

  const totalProjects = client.clientProjects.length;

  const invoices = client.clientProjects.flatMap(
    (project) => project.invoices,
  );

  const messages = client.clientProjects.flatMap(
    (project) => project.messages,
  );

  const proposals = client.clientProjects.flatMap(
    (project) => project.proposals,
  );

  const totalRevenue = invoices
    .filter((invoice) => invoice.paid)
    .reduce((total, invoice) => total + invoice.amount, 0);

  const lastProject = client.clientProjects[0];

  const clientIntelligence = buildClientEngine({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`,
    email: client.email,
    totalBookings: totalProjects,
    totalRevenue,
    lastBookingAt: lastProject?.createdAt ?? null,
    averageBookingValue:
      totalProjects === 0
        ? 0
        : Math.round(totalRevenue / totalProjects),
  });

  return (
    <DashboardShell>
      <ClientCommandCenter>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <ClientHeader
            name={`${client.firstName} ${client.lastName}`}
            email={client.email}
            health={clientIntelligence.health.status}
          />

          <Link
            href={`/clients/${client.id}/edit`}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border px-4 py-2 text-sm transition hover:border-primary/40 hover:bg-primary/5"
          >
            Edit Client
          </Link>
        </div>

        <ClientSummaryCard summary={clientIntelligence.summary} />

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <ClientLifetimeValueCard
            lifetimeValue={clientIntelligence.lifetimeValue}
            averageBookingValue={clientIntelligence.averageBookingValue}
          />

          <MetricCard
            label="Projects"
            value={totalProjects}
            helper="Total client projects"
          />

          <MetricCard
            label="Messages"
            value={messages.length}
            helper="Project messages"
          />

          <MetricCard
            label="Invoices"
            value={invoices.length}
            helper="Client invoices"
          />

          <MetricCard
            label="Proposals"
            value={proposals.length}
            helper="Client proposals"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ClientHealthCard
            score={clientIntelligence.health.score}
            reasons={clientIntelligence.health.reasons}
          />

          <ClientRetentionCard
            risk={clientIntelligence.retention.risk}
            recommendedAction={
              clientIntelligence.retention.recommendedAction
            }
          />
        </section>

        <ClientOpportunitiesCard
          opportunities={clientIntelligence.opportunities}
        />

        <CommandCard
          eyebrow="Relationship"
          title="Client Notes"
          subtitle="Private internal notes for this client."
        >
          <p className="leading-7 text-foreground/80">
            {client.notes || "No notes available."}
          </p>
        </CommandCard>

        <CommandCard
          eyebrow="History"
          title="Projects"
          subtitle="Client project history"
        >
          {client.clientProjects.length === 0 ? (
            <ExecutiveEmptyState
              title="No projects yet"
              description="Projects associated with this client will appear here with their invoices, messages, and proposals."
              action={
                <Link
                  href="/projects/new"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Create Project
                </Link>
              }
              className="min-h-[240px]"
            />
          ) : (
            <div className="space-y-3">
              {client.clientProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/30"
                >
                  <h3 className="font-medium">{project.name}</h3>

                  <p className="mt-1 text-sm leading-6 text-foreground/60">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CommandCard>
      </ClientCommandCenter>
    </DashboardShell>
  );
}