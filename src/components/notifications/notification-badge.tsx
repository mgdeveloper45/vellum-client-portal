import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function NotificationBadge() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const unreadCount = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className="ml-2 rounded-full bg-accent px-2 py-1 text-xs">
      {unreadCount}
    </span>
  );
}