import { ExecutiveCenterSkeleton } from "@/components/dashboard/executive-center-skeleton";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default function DashboardLoading() {
    return (
        <BrandedDashboardShell>
            <ExecutiveCenterSkeleton />
        </BrandedDashboardShell>
    );
}