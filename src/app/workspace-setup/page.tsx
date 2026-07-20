import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createDefaultWorkspaceAction } from "@/actions/workspace-actions";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function WorkspaceSetupPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (!canManageWorkspace(session.user.role)) {
        return (
            <main className="min-h-screen bg-background p-8 text-foreground">
                <div className="mx-auto max-w-xl">
                    <h1 className="text-2xl font-semibold">Workspace setup unavailable</h1>

                    <p className="mt-3 text-muted-foreground">
                        Your account does not have permission to create a workspace.
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Current role: {session.user.role}
                    </p>
                </div>
            </main>
        );
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            workspaceId: true,
        },
    });

    if (!currentUser) {
        redirect("/sign-in");
    }

    if (currentUser.workspaceId) {
        redirect("/settings");
    }

    return (
        <main className="min-h-screen bg-background p-8 text-foreground">
            <div className="mx-auto max-w-xl rounded-xl border bg-card p-6">
                <h1 className="text-2xl font-semibold">Create your workspace</h1>

                <p className="mt-3 text-muted-foreground">
                    Your account is not currently connected to a workspace. Create the
                    default workspace to finish setting up Vellum.
                </p>

                <form action={createDefaultWorkspaceAction} className="mt-6">
                    <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </main>
    );
}