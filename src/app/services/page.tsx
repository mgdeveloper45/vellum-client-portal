import { auth } from "@/auth";
import {
    createServiceAction,
    toggleServiceActiveAction,
} from "@/actions/service-actions";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { canManageWorkspace } from "@/lib/permissions";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { listServicesQuery } from "@/lib/queries/services/list-services-query";

export default async function ServicesPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const workspaceId = await getCurrentUserWorkspaceQuery(
        session.user.id,
    );

    if (!workspaceId) {
        return null;
    }

    const canManage = canManageWorkspace(session.user.role);

    const services = await listServicesQuery(workspaceId);

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Services</h1>

            <p className="mt-2 text-foreground/70">
                Create and manage the services clients can book.
            </p>

            {canManage && (
                <form
                    action={createServiceAction}
                    className="mt-8 rounded-2xl border border-border bg-card p-6"
                >
                    <h2 className="text-xl font-medium">
                        Create Service
                    </h2>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <input
                            name="name"
                            required
                            placeholder="Service name"
                            className="rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <input
                            name="duration"
                            required
                            type="number"
                            min="5"
                            step="5"
                            placeholder="Duration in minutes"
                            className="rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <input
                            name="price"
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Price in dollars"
                            className="rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <input
                            name="description"
                            placeholder="Short description"
                            className="rounded-lg border border-border bg-background px-4 py-3"
                        />
                    </div>

                    <button className="workspace-accent-button mt-4 rounded-full px-5 py-2 text-sm font-medium">
                        Create Service
                    </button>
                </form>
            )}

            <div className="mt-8 grid gap-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="rounded-2xl border border-border bg-card p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xl font-medium">
                                    {service.name}
                                </p>

                                {service.description && (
                                    <p className="mt-2 text-sm text-foreground/70">
                                        {service.description}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-foreground/70">
                                    <span>
                                        {service.duration} minutes
                                    </span>

                                    <span>
                                        ${(service.price / 100).toFixed(2)}
                                    </span>

                                    <span
                                        className={
                                            service.active
                                                ? "workspace-accent-badge rounded-full px-3 py-1"
                                                : "rounded-full bg-muted px-3 py-1 text-foreground/60"
                                        }
                                    >
                                        {service.active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {canManage && (
                                <form
                                    action={toggleServiceActiveAction}
                                >
                                    <input
                                        type="hidden"
                                        name="serviceId"
                                        value={service.id}
                                    />

                                    <input
                                        type="hidden"
                                        name="active"
                                        value={String(service.active)}
                                    />

                                    <button className="workspace-accent-button-outline rounded-full px-4 py-2 text-sm font-medium">
                                        {service.active
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </BrandedDashboardShell>
    );
}