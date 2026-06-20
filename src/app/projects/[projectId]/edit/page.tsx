import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { updateProjectAction } from "@/actions/project-actions";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: Props) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return (
      <DashboardShell>
        <p>Project not found.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">
        Edit Project
      </h1>

      <form
        action={updateProjectAction}
        className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <input
          type="hidden"
          name="projectId"
          value={project.id}
        />

        <input
          name="name"
          defaultValue={project.name}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <textarea
          name="description"
          defaultValue={project.description}
          className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <select
          name="status"
          defaultValue={project.status}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        >
          <option value="PLANNING">
            Planning
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="REVIEW">
            Review
          </option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>

        <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
          Save Changes
        </button>
      </form>
    </DashboardShell>
  );
}