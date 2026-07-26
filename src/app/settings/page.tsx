import { auth } from "@/auth";
import { CopyButton } from "@/components/shared/copy-button";
import { updateWorkspaceBrandingAction } from "@/actions/branding-actions";
import { uploadWorkspaceLogoAction } from "@/actions/branding-logo-actions";
import { createCheckoutSessionAction } from "@/actions/billing-actions";
import { openCustomerPortalAction } from "@/actions/customer-portal-actions";
import { createDefaultWorkspaceAction } from "@/actions/workspace-actions";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { updateBusinessHoursAction } from "@/actions/business-hour-actions";
import {
  BUSINESS_DAYS,
  DEFAULT_BUSINESS_HOURS,
} from "@/lib/constants/business-hours";
import {
  createApiKeyAction,
  revokeApiKeyAction,
} from "@/actions/api-key-actions";
import { listApiKeysService } from "@/lib/services/api/composition/api-key-services";
import { getSettingsWorkspaceQuery } from "@/lib/queries/settings/get-settings-workspace-query";
import { listBusinessHoursQuery } from "@/lib/queries/settings/list-business-hours-query";




export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    apiKey?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  const currentUser = await getSettingsWorkspaceQuery(user.id);

  const workspaceId = currentUser?.workspaceId ?? null;

  const bookingUrl = currentUser?.workspace?.slug
    ? `http://localhost:3000/book/${currentUser.workspace.slug}`
    : null;

  const apiKeys = workspaceId
    ? await listApiKeysService.execute(workspaceId)
    : [];

  const resolvedSearchParams = await searchParams;

  const createdApiKey =
    typeof resolvedSearchParams.apiKey === "string"
      ? resolvedSearchParams.apiKey
      : null;

  const businessHours = workspaceId
    ? await listBusinessHoursQuery(workspaceId)
    : [];

  const businessHoursByDay = new Map(
    businessHours.map((hour) => [hour.dayOfWeek, hour])
  );

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
          <h2 className="text-xl font-medium">Public Booking Page</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Share this link with clients so they can book appointments.
          </p>

          {bookingUrl ? (
            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
              <code className="flex-1 overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 text-sm">
                {bookingUrl}
              </code>

              <CopyButton value={bookingUrl} />

              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="workspace-accent-button rounded-full px-5 py-3 text-center text-sm font-medium"
              >
                Open Booking Page
              </a>
            </div>
          ) : (
            <p className="mt-5 text-sm text-foreground/70">
              Save your company name first to generate your booking link.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">Business Hours</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Set the weekly hours clients can book services.
          </p>

          <form action={updateBusinessHoursAction} className="mt-5 space-y-4">
            {BUSINESS_DAYS.map((day) => {
              const hours = businessHoursByDay.get(day);

              return (
                <div
                  key={day}
                  className="grid gap-3 rounded-xl border border-border bg-background p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {day.toLowerCase()}
                    </p>
                  </div>

                  <input
                    name={`${day}_openTime`}
                    type="time"
                    defaultValue={
                      hours?.openTime ?? DEFAULT_BUSINESS_HOURS.openTime
                    }
                    className="rounded-lg border border-border bg-card px-4 py-3"
                  />

                  <input
                    name={`${day}_closeTime`}
                    type="time"
                    defaultValue={
                      hours?.closeTime ?? DEFAULT_BUSINESS_HOURS.closeTime
                    }
                    className="rounded-lg border border-border bg-card px-4 py-3"
                  />

                  <label className="flex items-center gap-2 text-sm text-foreground/70">
                    <input
                      name={`${day}_closed`}
                      type="checkbox"
                      defaultChecked={hours?.closed ?? false}
                    />
                    Closed
                  </label>
                </div>
              );
            })}

            <button className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium">
              Save Business Hours
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-medium">API Keys</h2>

          <p className="mt-2 text-sm text-foreground/70">
            Create API keys for integrations, automations, and future public API access.
          </p>

          {createdApiKey && (
            <div className="mt-5 rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium">New API key created</p>

              <p className="mt-2 text-sm text-foreground/70">
                Copy this key now. You will not be able to see it again.
              </p>

              <code className="mt-3 block overflow-x-auto rounded-lg bg-card p-3 text-sm">
                {createdApiKey}
              </code>
            </div>
          )}

          <form action={createApiKeyAction} className="mt-5 flex gap-3">
            <input
              name="name"
              required
              placeholder="API key name"
              className="w-full rounded-lg border border-border bg-background px-4 py-3"
            />

            <button className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium">
              Create Key
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{apiKey.name}</p>

                    <p className="mt-1 text-sm text-foreground/60">
                      Prefix: {apiKey.keyPrefix}...
                    </p>

                    <p className="mt-1 text-xs text-foreground/50">
                      Last used:{" "}
                      {apiKey.lastUsedAt
                        ? apiKey.lastUsedAt.toLocaleString()
                        : "Never"}
                    </p>
                  </div>

                  <form action={revokeApiKeyAction}>
                    <input type="hidden" name="apiKeyId" value={apiKey.id} />

                    <button className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500 hover:text-white">
                      Revoke
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
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