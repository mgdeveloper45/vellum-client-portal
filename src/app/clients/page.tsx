import { auth } from "@/auth";
import { canManageClients } from "@/lib/permissions";
import { ClientGrid } from "@/components/clients/client-grid";
import { ClientsHeader } from "@/components/clients/clients-header";
import { ClientStatusFilter } from "@/components/clients/client-status-filter";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { listClientsService } from "@/lib/services/clients/composition/client-services";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";

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
            <ClientsHeader
                canManageClients={userCanManageClients}
            />
            <ClientStatusFilter selected="ALL" />
            <ClientGrid clients={clients} />
        </BrandedDashboardShell>
    );
}