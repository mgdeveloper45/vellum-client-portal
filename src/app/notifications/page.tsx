import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { markNotificationReadAction } from "@/actions/notification-actions";
import { prisma } from "@/lib/prisma";

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
        <DashboardShell>
            <h1 className="text-3xl font-light">Notifications</h1>

            <div className="mt-8 grid gap-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`rounded-2xl border p-5 ${notification.read
                                ? "border-border bg-card"
                                : "border-accent bg-muted"
                            }`}
                    >
                        <p className="font-medium">{notification.title}</p>

                        <p className="mt-2 text-sm text-foreground/70">
                            {notification.message}
                        </p>

                        <p className="mt-3 text-xs text-foreground/50">
                            {notification.createdAt.toLocaleDateString()}
                        </p>

                        {!notification.read && (
                            <form action={markNotificationReadAction} className="mt-3">
                                <input
                                    type="hidden"
                                    name="notificationId"
                                    value={notification.id}
                                />

                                <button className="text-sm text-accent">
                                    Mark as read
                                </button>
                            </form>
                        )}

                    </div>
                ))}
            </div>
        </DashboardShell>
    );
}