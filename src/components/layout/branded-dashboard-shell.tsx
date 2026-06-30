import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CommandPalette } from "@/components/search/command-palette";
import { WorkspaceSearch } from "@/components/search/workspace-search";


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
      <div className="mb-8">
        <WorkspaceSearch />
      </div>
      {children}
    </DashboardShell>
  );
}