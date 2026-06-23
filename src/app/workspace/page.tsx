import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function WorkspacePage() {
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

    const members = await prisma.user.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
        },
        orderBy: {
            firstName: "asc",
        },
    });

    return (
        <DashboardShell>
            <h1 className="text-3xl font-light">
                Workspace Members
            </h1>

            <p className="mt-2 text-foreground/70">
                Manage everyone inside your workspace.
            </p>

            <div className="mt-8 grid gap-4">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="rounded-2xl border border-border bg-card p-5"
                    >
                        <p className="font-medium">
                            {member.firstName} {member.lastName}
                        </p>

                        <p className="text-sm text-foreground/70">
                            {member.email}
                        </p>

                        <p className="mt-2 text-xs">
                            {member.role}
                        </p>
                    </div>
                ))}
            </div>
        </DashboardShell>
    );
}