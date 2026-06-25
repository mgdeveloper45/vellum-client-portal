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

    return (
        <DashboardShell
            companyName={currentUser?.workspace?.companyName}
            logoImageUrl={
                currentUser?.workspace?.logoImageUrl &&
                    currentUser.workspace.logoImageUrl !== "NULL"
                    ? currentUser.workspace.logoImageUrl
                    : null
            }
        >
            {children}
        </DashboardShell>
    );
}