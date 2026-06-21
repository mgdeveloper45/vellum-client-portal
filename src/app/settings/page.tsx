import { auth } from "@/auth";
import { changePasswordAction } from "@/actions/security-actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardShell>
      <h1 className="text-3xl font-light">Settings</h1>

      <p className="mt-2 text-foreground/70">
        Manage your account information and preferences.
      </p>

      <div className="mt-8 grid gap-6">
        {/* ACCOUNT */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">
            Account
          </h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-foreground/60">
                Name
              </p>

              <p className="font-medium">
                {session.user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-foreground/60">
                Email
              </p>

              <p className="font-medium">
                {session.user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-foreground/60">
                Role
              </p>

              <p className="font-medium">
                {session.user.role}
              </p>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-foreground/70">
            Notification preferences will be added in a future update.
          </p>
        </div>

        {/* SECURITY */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">
            Security
          </h2>

          <form
            action={changePasswordAction}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              name="currentPassword"
              required
              placeholder="Current password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
              type="password"
              name="newPassword"
              required
              placeholder="New password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}