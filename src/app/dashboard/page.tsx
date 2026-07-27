import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { requireDashboardUser } from "@/lib/dashboard/dashboard-loader";
import { getDashboardQuery } from "@/lib/queries/dashboard/get-dashboard-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { hasProfessionalPlan } from "@/lib/subscription";

export default async function DashboardPage() {
  const user = await requireDashboardUser();

  if (!user) {
    return null;
  }

  const [isProfessional, workspaceId] =
    await Promise.all([
      hasProfessionalPlan(user.id),
      getCurrentUserWorkspaceQuery(user.id),
    ]);

  if (!workspaceId) {
    return null;
  }

  const dashboardData = await getDashboardQuery({
    userId: user.id,
    userRole: user.role,
    workspaceId,
  });

  const dashboard = await buildDashboard({
    data: dashboardData,
  });

  return (
    <DashboardContent
      dashboard={dashboard}
      isProfessional={isProfessional}
      userId={user.id}
      workspaceId={workspaceId}
    />
  );
}