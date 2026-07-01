import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { NotificationLinkCard } from "@/components/notifications/notification-link-card";


export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Notifications</h1>

            <div className="mt-8 grid gap-3">
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
                {notifications.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-foreground/60">
                        No notifications yet.
                    </div>
                )}
            </div>
        </BrandedDashboardShell>
    );
}