import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { prisma } from "@/lib/prisma";

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
      {children}
    </DashboardShell>
  );
}