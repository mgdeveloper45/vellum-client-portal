import { auth } from "@/auth";
import { createClientAction } from "@/actions/client-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { canManageClients } from "@/lib/permissions";

export default async function NewClientPage() {
  const session = await auth();

  if (
    !session?.user ||
    !canManageClients(session.user.role)
  ) {
    return null;
  }

  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">
        New Client
      </h1>

      <form
        action={createClientAction}
        className="mt-8 max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6"
      >
        <input
          name="firstName"
          placeholder="First name"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="lastName"
          placeholder="Last name"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <textarea
          name="notes"
          placeholder="Client notes"
          className="min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3"
        />

        <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
          Create Client
        </button>
      </form>
    </DashboardShell>
  );
}