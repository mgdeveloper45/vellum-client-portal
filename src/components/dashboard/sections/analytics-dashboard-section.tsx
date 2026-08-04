import { DashboardAnalyticsSection } from "@/components/dashboard/dashboard-analytics-section";
import { DashboardRecentActivitySection } from "@/components/dashboard/dashboard-recent-activity-section";
import { ExecutiveDashboardCard } from "@/components/dashboard/executive-dashboard-card";
import { WorkspaceOpportunityCard } from "@/components/dashboard/workspace-opportunity-card";
import { WorkspaceRiskCard } from "@/components/dashboard/workspace-risk-card";
import { ExecutiveSection } from "@/components/ui/executive-section";

import type {
    DashboardViewModel,
} from "@/lib/services/dashboard/dashboard-builder";

type Props = {
    dashboard: DashboardViewModel;
    isProfessional: boolean;
};

export function AnalyticsDashboardSection({
    dashboard,
    isProfessional,
}: Props) {
    const {
        dashboardContext,
        heroMetrics,
        professionalMetrics,
        bookingTrendData,
        revenueCollected,
        revenueOutstanding,
        workspaceEngine,
        recentActivity,
    } = dashboard;

    return (
        <>
            <div className="mt-8">
                <ExecutiveDashboardCard
                    context={dashboardContext}
                />
            </div>

            <ExecutiveSection
                eyebrow="Performance"
                title="Full Business Analytics"
                description="Detailed operational, booking, project, and financial performance."
            >
                <DashboardAnalyticsSection
                    heroMetrics={heroMetrics}
                    professionalMetrics={professionalMetrics}
                    bookingTrendData={bookingTrendData}
                    revenueCollected={revenueCollected}
                    revenueOutstanding={revenueOutstanding}
                    isProfessional={isProfessional}
                />
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Business Outlook"
                title="Opportunities and Risks"
                description="Growth opportunities to pursue and operational risks to monitor."
            >
                <div className="grid gap-6 xl:grid-cols-2">
                    <WorkspaceOpportunityCard
                        opportunities={workspaceEngine.opportunities}
                    />

                    <WorkspaceRiskCard
                        risks={workspaceEngine.risks}
                    />
                </div>
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Audit History"
                title="Detailed Workspace Activity"
                description="A complete record of recent changes across the workspace."
            >
                <DashboardRecentActivitySection
                    recentActivity={recentActivity}
                />
            </ExecutiveSection>
        </>
    );
}