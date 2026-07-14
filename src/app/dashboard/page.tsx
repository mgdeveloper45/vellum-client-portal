import { DashboardContent } from "@/components/dashboard/dashboard-content";
import {
  loadDashboardWorkspace,
  requireDashboardUser,
} from "@/lib/dashboard/dashboard-loader";
import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { hasProfessionalPlan } from "@/lib/subscription";

export default async function DashboardPage() {
  const user = await requireDashboardUser();

  if (!user) {
    return null;
  }

  const [isProfessional, currentUser] = await Promise.all([
    hasProfessionalPlan(user.id),
    loadDashboardWorkspace(user.id),
  ]);

  if (!currentUser) {
    return null;
  }

  const workspaceId = currentUser.workspaceId;

  const dashboard = await buildDashboard({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    workspaceId,
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