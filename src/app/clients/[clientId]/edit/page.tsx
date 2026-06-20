import {
  updateClientAction,
  deleteClientAction,
} from "@/actions/client-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

type EditClientPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { clientId } = await params;

  const client = await prisma.user.findUnique({
    where: {
      id: clientId,
    },
  });

  if (!client) {
    return (
      <DashboardShell>
        <p>Client not found.</p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">Edit Client</h1>

      <form
        action={updateClientAction}
        className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <input type="hidden" name="clientId" value={client.id} />

        <input
          name="firstName"
          defaultValue={client.firstName}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="lastName"
          defaultValue={client.lastName}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="email"
          type="email"
          defaultValue={client.email}
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <textarea
          name="notes"
          defaultValue={client.notes || ""}
          className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
        />

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
        <input type="hidden" name="clientId" value={client.id} />

        <h2 className="text-xl font-medium text-red-400">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm text-foreground/70">
          Deleting this client permanently removes their account. Only do this for test clients right now.
        </p>

        <button className="mt-4 rounded-full bg-red-500 px-6 py-3 font-medium text-white">
          Delete Client
        </button>
      </form>

    </DashboardShell>
  );
}