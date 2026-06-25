import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function ProjectsPage() {
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

  const projectFilter =
    session.user.role === "ADMIN"
      ? {
        workspaceId: currentUser.workspaceId,
      }
      : {
        workspaceId: currentUser.workspaceId,
        clientId: session.user.id,
      };

  const projects = await prisma.project.findMany({
    where: projectFilter,
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <BrandedDashboardShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light">Projects</h1>

          <p className="mt-2 text-foreground/70">
            Manage client work, approvals, deadlines, and delivery.
          </p>
        </div>

        {session.user.role === "ADMIN" && (
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