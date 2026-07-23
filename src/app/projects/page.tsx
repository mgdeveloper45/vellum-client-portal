import Link from "next/link";

import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { listProjectsService } from "@/lib/services/projects/composition/project-services";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const userCanManageProjects = canManageProjects(
    session.user.role,
  );

  const result = await listProjectsService({
    workspaceId,
    viewerUserId: session.user.id,
    canManageProjects: userCanManageProjects,
  });

  const projects = result.success
    ? result.projects
    : [];

  return (
    <BrandedDashboardShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light">
            Projects
          </h1>

          <p className="mt-2 text-foreground/70">
            Manage client work, approvals, deadlines,
            and delivery.
          </p>
        </div>

        {userCanManageProjects && (
          <Link
            href="/projects/new"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
          >
            New Project
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            client={`${project.client.firstName} ${project.client.lastName}`}
            status={project.status}
            dueDate="No due date yet"
            description={project.description}
          />
        ))}
      </div>
    </BrandedDashboardShell>
  );
}