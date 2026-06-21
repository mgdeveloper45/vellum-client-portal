import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

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
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Account</h2>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-foreground/60">Name</p>
              <p className="font-medium">{session.user.name}</p>
            </div>

            <div>
              <p className="text-sm text-foreground/60">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>

            <div>
              <p className="text-sm text-foreground/60">Role</p>
              <p className="font-medium">{session.user.role}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Notifications</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Notification preferences will be added in a future update.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Security</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Change your password using your current password.
          </p>

          <ChangePasswordForm />
        </div>
      </div>
    </DashboardShell>
  );
}