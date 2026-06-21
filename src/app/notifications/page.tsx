import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
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
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="font-medium">{notification.title}</p>

            <p className="mt-2 text-sm text-foreground/70">
              {notification.message}
            </p>

            <p className="mt-3 text-xs text-foreground/50">
              {notification.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}