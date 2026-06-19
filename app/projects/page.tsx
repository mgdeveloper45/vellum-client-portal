import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProjectCard } from "@/components/projects/project-card";

const projects = [
  {
    name: "Coffee Shop Brand Launch",
    client: "Oak & Ember Coffee",
    status: "Active" as const,
    dueDate: "July 12, 2026",
    description:
      "Brand identity, landing page, launch assets, menu design, and client approval workflow.",
  },
  {
    name: "Interior Design Portal",
    client: "Luna Studio",
    status: "Review" as const,
    dueDate: "July 20, 2026",
    description:
      "Client dashboard for mood boards, revisions, invoices, and project milestones.",
  },
  {
    name: "Consulting Proposal System",
    client: "Northline Advisors",
    status: "Planning" as const,
    dueDate: "August 3, 2026",
    description:
      "Proposal builder, approval tracking, document delivery, and invoice management.",
  },
];

export default function ProjectsPage() {
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
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </DashboardShell>
  );
}