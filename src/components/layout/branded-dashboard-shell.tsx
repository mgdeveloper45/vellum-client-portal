import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CommandPalette } from "@/components/search/command-palette";
import { WorkspaceSearch } from "@/components/search/workspace-search";
import { NotificationBell } from "@/components/notifications/notification-bell";


export async function BrandedDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const unreadNotifications = currentUser?.workspaceId
    ? await prisma.notification.count({
      where: {
        userId: currentUser.id,
        read: false,
      },
    })
    : 0;

  const rawLogoImageUrl = currentUser?.workspace?.logoImageUrl;

  const logoImageUrl =
    rawLogoImageUrl &&
      rawLogoImageUrl !== "NULL" &&
      rawLogoImageUrl !== "null"
      ? rawLogoImageUrl
      : null;

  const accentColor =
    currentUser?.workspace?.accentColor || "#8B5CF6";

  return (
    <DashboardShell
      companyName={currentUser?.workspace?.companyName}
      logoImageUrl={logoImageUrl}
      accentColor={accentColor}
    >
      <CommandPalette />
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <WorkspaceSearch />
        <NotificationBell unreadCount={unreadNotifications} />
      </div>
      {children}
    </DashboardShell>
  );
}