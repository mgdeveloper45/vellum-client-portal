import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardScheduleSection } from "@/components/dashboard/dashboard-schedule-section";
import { ExecutiveInboxCard } from "@/components/dashboard/executive-inbox-card";
import { ExecutiveTimelineCard } from "@/components/dashboard/executive-timeline-card";
import { WorkspaceQuickActionsDock } from "@/components/dashboard/workspace-quick-actions-dock";
import { ExecutiveSection } from "@/components/ui/executive-section";

import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";

type Props = {
    dashboard: DashboardViewModel;
};

export function OperationsDashboardSection({
    dashboard,
}: Props) {
    const {
        executiveInbox,
        dashboardContext,
        todaysBookings,
        upcomingBookings,
        recentNotifications,
    } = dashboard;

    return (
        <>
            <DashboardScheduleSection
                todaysBookings={todaysBookings}
                upcomingBookings={upcomingBookings}
            />

            <ExecutiveSection
                eyebrow="Recommended"
                title="What to Do Next"
                description="The highest-impact actions generated from your current business data."
            >
                <div id="recommended-actions">
                    <ExecutiveInboxCard
                        items={executiveInbox.slice(0, 3)}
                    />
                </div>
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Business Activity"
                title="Recent Events and Updates"
                description="A concise view of what has changed across your workspace."
            >
                <div className="grid gap-6 xl:grid-cols-2">
                    <ExecutiveTimelineCard
                        events={dashboardContext.timeline.slice(0, 3)}
                    />

                    <ActivityFeed
                        activities={recentNotifications.slice(0, 3)}
                    />
                </div>
            </ExecutiveSection>

            <div className="mt-10">
                <WorkspaceQuickActionsDock />
            </div>
        </>
    );
}