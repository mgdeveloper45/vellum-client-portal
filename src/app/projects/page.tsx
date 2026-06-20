import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * Projects page.
 * This is now a server component that fetches real project data from PostgreSQL.
 */
export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Fetch projects from the database and include the related client.
  const projects = await prisma.project.findMany({  
    where:
      session.user.role === "ADMIN"
        ? {}
        : {
            clientId: session.user.id,
          },
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light">Projects</h1>
          <p className="mt-2 text-foreground/70">
            Manage client work, approvals, deadlines, and delivery.
          </p>
        </div>

        <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
          New Project
        </button>
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
    </DashboardShell>
  );
}