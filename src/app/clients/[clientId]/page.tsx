import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

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
      clientProjects: true,
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
      <div>
        <h1 className="text-3xl font-light">
          {client.firstName} {client.lastName}
        </h1>

        <p className="mt-2 text-foreground/70">
          {client.email}
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