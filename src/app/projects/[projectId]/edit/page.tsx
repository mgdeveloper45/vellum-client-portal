import {
  deleteProjectAction,
  updateProjectAction,
} from "@/actions/project-actions";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getProjectForEditService } from "@/lib/services/projects/composition/project-services";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: Props) {
  const session = await auth();

  if (
    !session?.user ||
    !canManageProjects(session.user.role)
  ) {
    return null;
  }

  const { projectId } = await params;

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const result = await getProjectForEditService({
    workspaceId,
    projectId,
  });

  if (!result.success) {
    return (
      <DashboardShell>
        <p>Project not found.</p>
      </DashboardShell>
    );
  }

  const project = result.project;

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
          type="hidden"
          name="clientId"
          value={project.clientId}
        />

        <input
          type="hidden"
          name="ownerId"
          value={project.ownerId}
        />

        <input
          name="name"
          defaultValue={project.name}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <textarea
          name="description"
          defaultValue={project.description}
          required
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

          <option value="ACTIVE">Active</option>
          <option value="REVIEW">Review</option>

          <option value="COMPLETED">
            Completed
          </option>
        </select>

        <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
          Save Changes
        </button>
      </form>

      <form
        action={deleteProjectAction}
        className="mt-6 max-w-2xl rounded-2xl border border-red-500/30 bg-card p-6"
      >
        <input
          type="hidden"
          name="projectId"
          value={project.id}
        />

        <h2 className="text-xl font-medium text-red-400">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm text-foreground/70">
          A project can only be deleted after its files,
          milestones, messages, invoices, and proposals
          have been removed.
        </p>

        <button className="mt-4 rounded-full bg-red-500 px-6 py-3 font-medium text-white">
          Delete Project
        </button>
      </form>
    </DashboardShell>
  );
}