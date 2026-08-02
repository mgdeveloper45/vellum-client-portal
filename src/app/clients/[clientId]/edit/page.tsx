import { auth } from "@/auth";
import { CLIENT_STATUS_OPTIONS } from "@/lib/client-status-options";
import {
  deleteClientAction,
  updateClientAction,
} from "@/actions/client-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { canManageClients } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getClientForEditService } from "@/lib/services/clients/composition/client-services";

type EditClientPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    !canManageClients(session.user.role)
  ) {
    return null;
  }

  const { clientId } = await params;

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const result = await getClientForEditService({
    workspaceId,
    clientId,
  });

  if (!result.success) {
    return (
      <DashboardShell>
        <p>Client not found.</p>
      </DashboardShell>
    );
  }

  const client = result.client;

  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">
        Edit Client
      </h1>

      <form
        action={updateClientAction}
        className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <input
          type="hidden"
          name="clientId"
          value={client.id}
        />

        <input
          name="firstName"
          defaultValue={client.firstName}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="lastName"
          defaultValue={client.lastName}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="email"
          type="email"
          defaultValue={client.email}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <textarea
          name="notes"
          defaultValue={client.notes || ""}
          className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <div className="space-y-2">
          <label
            htmlFor="clientStatus"
            className="block text-sm font-medium"
          >
            Client Status
          </label>

          <select
            id="clientStatus"
            name="clientStatus"
            defaultValue={client.clientStatus}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
          >
            {CLIENT_STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="isBlacklisted"
            defaultChecked={client.isBlacklisted}
          />

          Blacklist client
        </label>

        <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
          Save Changes
        </button>
      </form>

      <form
        action={deleteClientAction}
        className="mt-6 max-w-xl rounded-2xl border border-red-500/30 bg-card p-6"
      >
        <input
          type="hidden"
          name="clientId"
          value={client.id}
        />

        <h2 className="text-xl font-medium text-red-400">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm text-foreground/70">
          A client can only be deleted when they have no
          existing projects. Deletion permanently removes
          their account.
        </p>

        <button className="mt-4 rounded-full bg-red-500 px-6 py-3 font-medium text-white">
          Delete Client
        </button>
      </form>
    </DashboardShell>
  );
}