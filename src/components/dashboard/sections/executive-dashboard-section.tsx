import { ExecutiveDailyBriefCard } from "@/components/dashboard/executive-daily-brief-card";
import { ExecutiveHero } from "@/components/dashboard/executive-hero";
import { BusinessPulseCard } from "@/components/dashboard/business-pulse-card";
import { WorkspaceExecutiveForecastCard } from "@/components/dashboard/workspace-executive-forecast-card";
import { WorkspaceMorningBriefCard } from "@/components/dashboard/workspace-morning-brief-card";
import { WorkspaceRevenueOpportunityCard } from "@/components/dashboard/workspace-revenue-opportunity-card";
import { WorkspaceExecutiveBriefCard } from "@/components/dashboard/workspace-executive-brief-card";
import { ExecutiveSection } from "@/components/ui/executive-section";

import type {
    DashboardViewModel,
} from "@/lib/services/dashboard/dashboard-builder";

type Props = {
    dashboard: DashboardViewModel;
};

export function ExecutiveDashboardSection({
    dashboard,
}: Props) {
    const {
        workspaceEngine,
        executiveInbox,
        dashboardContext,
        morningBrief,
        revenueForecast,
        bookingForecast,
        workspaceCapacity,
        topAdvice,
        aiResult,
        firstName,
        revenueCollected,
        revenueOutstanding,
    } = dashboard;

    return (
        <>
            <ExecutiveDailyBriefCard
                brief={morningBrief}
                topAdvice={topAdvice}
            />

            <ExecutiveHero
                firstName={firstName}
                narrative={aiResult.narrative}
                projectedRevenue={revenueCollected.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                })}
                outstandingRevenue={revenueOutstanding.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                })}
                priorityCount={executiveInbox.length}
                primaryAction={{
                    label: "Start Today’s Mission",
                    href: "#recommended-actions",
                }}
            />

            <ExecutiveSection
                eyebrow="Forecast"
                title="Executive Revenue Outlook"
                description="Projected financial performance based on current business activity."
            >
                <WorkspaceExecutiveForecastCard
                    forecast={revenueForecast}
                />
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Daily Briefing"
                title="Your Morning Brief"
                description="Yesterday’s performance, today’s workload, and Vellum’s recommended priorities."
            >
                <WorkspaceMorningBriefCard
                    brief={morningBrief}
                />
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Business Health"
                title="Business Pulse"
                description="A concise view of financial, booking, capacity, and operational performance."
            >
                <BusinessPulseCard
                    overall={
                        dashboardContext.executiveContext.summary.overallHealth
                    }
                    revenue={
                        dashboardContext.executiveContext.summary.revenueHealth
                    }
                    bookings={bookingForecast.utilizationWeek}
                    workspace={workspaceEngine.health.score}
                    capacity={
                        workspaceCapacity.weeklyUtilizationRate
                    }
                />
            </ExecutiveSection>

            <ExecutiveSection
                eyebrow="Financial Focus"
                title="Revenue and Executive Intelligence"
                description="Your highest-value financial opportunity and Vellum’s current assessment of the business."
            >
                <div className="grid gap-6 xl:grid-cols-2">
                    <WorkspaceRevenueOpportunityCard
                        opportunity={
                            workspaceEngine.revenueOpportunity
                        }
                    />

                    <WorkspaceExecutiveBriefCard
                        brief={
                            workspaceEngine.executiveBrief
                        }
                    />
                </div>
            </ExecutiveSection>
        </>
    );
}