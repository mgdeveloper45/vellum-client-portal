import Link from "next/link";

import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { canManageClients } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { listClientsService } from "@/lib/services/clients/composition/client-services";

export default async function ClientsPage() {
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

    const userCanManageClients = canManageClients(
        session.user.role,
    );

    const result = await listClientsService({
        workspaceId,
        viewerUserId: session.user.id,
        canManageClients: userCanManageClients,
    });

    const clients = result.success ? result.clients : [];

    return (
        <BrandedDashboardShell>
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-light">
                        Clients
                    </h1>

                    <p className="mt-2 text-foreground/70">
                        Manage client relationships, projects, and
                        communication.
                    </p>
                </div>

                {userCanManageClients && (
                    <Link
                        href="/clients/new"
                        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                    >
                        New Client
                    </Link>
                )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {clients.map((client) => (
                    <Link
                        key={client.id}
                        href={`/clients/${client.id}`}
                        className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent"
                    >
                        <h2 className="text-xl font-medium">
                            {client.firstName} {client.lastName}
                        </h2>

                        <p className="mt-2 text-sm text-foreground/60">
                            {client.email}
                        </p>

                        <p className="mt-4 text-sm text-accent">
                            {client.projectCount} Project
                            {client.projectCount !== 1 ? "s" : ""}
                        </p>
                    </Link>
                ))}
            </div>
        </BrandedDashboardShell>
    );
}