import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { createProjectAction } from "@/actions/project-actions";

export default async function NewProjectPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    if (session.user.role !== "ADMIN") {
        return (
            <DashboardShell>
                <p>Only admins can create projects.</p>
            </DashboardShell>
        );
    }

    const clients = await prisma.user.findMany({
        where: {
            role: "CLIENT",
        },
        orderBy: {
            firstName: "asc",
        },
    });

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
                    <option value="">
                        Select client
                    </option>

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
                    Create Project
                </button>
            </form>
        </DashboardShell>
    );
}