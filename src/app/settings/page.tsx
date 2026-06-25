import { auth } from "@/auth";
import { updateWorkspaceBrandingAction } from "@/actions/branding-actions";
import { uploadWorkspaceLogoAction } from "@/actions/branding-logo-actions";
import { createCheckoutSessionAction } from "@/actions/billing-actions";
import { openCustomerPortalAction } from "@/actions/customer-portal-actions";
import { createDefaultWorkspaceAction } from "@/actions/workspace-actions";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      workspace: true,
    },
  });

  return (
    <BrandedDashboardShell>
      <h1 className="text-3xl font-light">Settings</h1>

      <p className="mt-2 text-foreground/70">
        Manage your account, billing, security, and workspace branding.
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
          <h2 className="text-xl font-medium">Billing</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Upgrade your workspace to Vellum Professional or manage your
            existing billing settings.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <form action={createCheckoutSessionAction}>
              <button className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium">
                Upgrade to Professional
              </button>
            </form>

            <form action={openCustomerPortalAction}>
              <button className="workspace-accent-button-outline rounded-full px-5 py-2 text-sm font-medium">
                Manage Billing
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Workspace Branding</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Customize how your workspace appears to clients and team members.
          </p>

          <form action={uploadWorkspaceLogoAction} className="mt-5 space-y-3">
            <label className="block text-sm text-foreground/70">
              Workspace Logo
            </label>

            <input
              name="logo"
              type="file"
              accept="image/*"
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="workspace-accent-button-outline rounded-full px-5 py-2 text-sm font-medium">
              Upload Logo
            </button>
          </form>

          <form action={updateWorkspaceBrandingAction} className="mt-6 space-y-4">
            <input
              name="companyName"
              placeholder="Company name"
              defaultValue={currentUser?.workspace?.companyName ?? ""}
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
              name="accentColor"
              placeholder="Hex color (e.g. #C9A227)"
              defaultValue={currentUser?.workspace?.accentColor ?? "#8B5CF6"}
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <input
              name="customDomain"
              placeholder="portal.yourcompany.com"
              defaultValue={currentUser?.workspace?.customDomain ?? ""}
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium">
              Save Branding
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Security</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Change your password using your current password.
          </p>

          <ChangePasswordForm />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Notifications</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Notification preferences will be added in a future update.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Workspace Setup</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Create the default workspace and attach existing users and projects.
          </p>

          <form action={createDefaultWorkspaceAction} className="mt-4">
            <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
              Create Default Workspace
            </button>
          </form>
        </div>
      </div>
    </BrandedDashboardShell>
  );
}