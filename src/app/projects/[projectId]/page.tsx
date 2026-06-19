import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

/**
 * Individual project page.
 * Loads a project directly from PostgreSQL.
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      client: true,
      milestones: true,
      invoices: true,
      proposals: true,
      messages: true,
    },
  });

  if (!project) {
    return (
      <DashboardShell>
        <h1 className="text-2xl font-light">
          Project not found
        </h1>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <Link
        href="/projects"
        className="text-sm text-accent"
      >
        ← Back to Projects
      </Link>

      <div className="mt-6 rounded-2xl border border-border bg-card p-8">
        <h1 className="text-4xl font-light">
          {project.name}
        </h1>

        <p className="mt-4 text-foreground/70">
          {project.description}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-medium">
              Client
            </h2>

            <p className="mt-2 text-foreground/70">
              {project.client.firstName}{" "}
              {project.client.lastName}
            </p>
          </div>

          <div>
            <h2 className="font-medium">
              Status
            </h2>

            <p className="mt-2 text-foreground/70">
              {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
            </p>
          </div>

{/* =======================================================
    PROJECT MILESTONES
    Displays all milestones related to this project.
    Data comes directly from PostgreSQL through Prisma.
======================================================= */}
          <div className="mt-10">
            <h2 className="text-xl font-medium">
              Milestones
            </h2>

            <div className="mt-4 grid gap-3">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{milestone.title}</h3>

                    <span className="text-sm text-foreground/70">
                      {milestone.status.charAt(0) + milestone.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {milestone.dueDate && (
                    <p className="mt-2 text-sm text-foreground/60">
                      Due {milestone.dueDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardShell>
  );
}