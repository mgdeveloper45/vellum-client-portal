import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { NotificationLinkCard } from "@/components/notifications/notification-link-card";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { listNotificationsQuery } from "@/lib/queries/notifications/list-notifications-query";

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const notifications = await listNotificationsQuery(
        session.user.id,
    );

    return (
        <BrandedDashboardShell>
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                    Workspace Updates
                </p>

                <h1 className="mt-2 text-3xl font-light tracking-tight">
                    Notifications
                </h1>

                <p className="mt-2 text-sm leading-6 text-foreground/60">
                    Review important alerts, reminders, and workspace
                    activity.
                </p>
            </div>

            <div className="mt-8">
                {notifications.length === 0 ? (
                    <ExecutiveEmptyState
                        title="You're all caught up"
                        description="New reminders, booking updates, payment alerts, and important workspace notifications will appear here."
                        className="min-h-[300px]"
                    />
                ) : (
                    <div className="grid gap-3">
                        {notifications.map((notification) => (
                            <NotificationLinkCard
                                key={notification.id}
                                id={notification.id}
                                title={notification.title}
                                message={notification.message}
                                href={notification.href}
                                read={notification.read}
                                createdAt={notification.createdAt.toLocaleString()}
                            />
                        ))}
                    </div>
                )}
            </div>
        </BrandedDashboardShell>
    );
}