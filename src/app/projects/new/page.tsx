import { createProjectAction } from "@/actions/project-actions";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { listProjectClientsService } from "@/lib/services/projects/composition/project-services";

export default async function NewProjectPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    if (!canManageProjects(session.user.role)) {
        return (
            <DashboardShell>
                <p>
                    You do not have permission to create projects.
                </p>
            </DashboardShell>
        );
    }

    const workspaceId =
        await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
            session.user.id,
        );

    if (!workspaceId) {
        return null;
    }

    const result =
        await listProjectClientsService(workspaceId);

    const clients = result.success
        ? result.clients
        : [];

    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">
                New Project
            </h1>

            <form
                action={createProjectAction}
                className="mt-8 max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6"
            >
                <input
                    type="hidden"
                    name="ownerId"
                    value={session.user.id}
                />

                <input
                    name="name"
                    placeholder="Project name"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <textarea
                    name="description"
                    placeholder="Project description"
                    required
                    className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <select
                    name="clientId"
                    required
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                >
                    <option value="">Select client</option>

                    {clients.map((client) => (
                        <option
                            key={client.id}
                            value={client.id}
                        >
                            {client.firstName} {client.lastName}
                        </option>
                    ))}
                </select>

                <select
                    name="status"
                    defaultValue="PLANNING"
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
                    Create Project
                </button>
            </form>
        </DashboardShell>
    );
}