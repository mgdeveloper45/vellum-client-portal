import { AICommandCenter } from "@/components/ai/command-center";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardAnalyticsSection } from "@/components/dashboard/dashboard-analytics-section";
import { DashboardRecentActivitySection } from "@/components/dashboard/dashboard-recent-activity-section";
import { DashboardScheduleSection } from "@/components/dashboard/dashboard-schedule-section";
import { ExecutiveDailyBriefCard } from "@/components/dashboard/executive-daily-brief-card";
import { ExecutiveDashboardCard } from "@/components/dashboard/executive-dashboard-card";
import { ExecutiveHero } from "@/components/dashboard/executive-hero";
import { ExecutiveInboxCard } from "@/components/dashboard/executive-inbox-card";
import { ExecutiveTimelineCard } from "@/components/dashboard/executive-timeline-card";
import { WorkspaceAICard } from "@/components/dashboard/workspace-ai-card";
import { WorkspaceActionsCard } from "@/components/dashboard/workspace-actions-card";
import { WorkspaceCommandCenter } from "@/components/dashboard/workspace-command-center";
import { WorkspaceExecutiveBriefCard } from "@/components/dashboard/workspace-executive-brief-card";
import { WorkspaceExecutiveForecastCard } from "@/components/dashboard/workspace-executive-forecast-card";
import { WorkspaceHealthCard } from "@/components/dashboard/workspace-health-card";
import { WorkspaceMissionCard } from "@/components/dashboard/workspace-mission-card";
import { WorkspaceMorningBriefCard } from "@/components/dashboard/workspace-morning-brief-card";
import { WorkspaceOpportunityCard } from "@/components/dashboard/workspace-opportunity-card";
import { WorkspaceQuickActionsDock } from "@/components/dashboard/workspace-quick-actions-dock";
import { WorkspaceRevenueOpportunityCard } from "@/components/dashboard/workspace-revenue-opportunity-card";
import { WorkspaceRiskCard } from "@/components/dashboard/workspace-risk-card";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { ExecutiveSection } from "@/components/ui/executive-section";
import type { DashboardViewModel } from "@/lib/services/dashboard/dashboard-builder";

type DashboardContentProps = {
    dashboard: DashboardViewModel;
    isProfessional: boolean;
    userId: string;
    workspaceId: string;
};

export function DashboardContent({
    dashboard,
    isProfessional,
    userId,
    workspaceId,
}: DashboardContentProps) {
    const {
        workspaceEngine,
        executiveInbox,
        dashboardContext,
        morningBrief,
        revenueForecast,
        topAdvice,
        heroMetrics,
        professionalMetrics,
        bookingTrendData,
        aiResult,
        firstName,
        revenueCollected,
        revenueOutstanding,
        todaysBookings,
        upcomingBookings,
        recentActivity,
        recentNotifications,
    } = dashboard;

    return (
        <BrandedDashboardShell>
            <WorkspaceCommandCenter>
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
                    <WorkspaceMorningBriefCard brief={morningBrief} />
                </ExecutiveSection>

                <ExecutiveSection
                    eyebrow="Today"
                    title="Your Operating Priorities"
                    description="The mission, health, and financial opportunity that deserve attention today."
                >
                    <div className="grid gap-6 xl:grid-cols-12">
                        <div className="xl:col-span-7">
                            <WorkspaceMissionCard
                                mission={workspaceEngine.mission}
                            />
                        </div>

                        <div className="xl:col-span-5">
                            <WorkspaceHealthCard
                                health={workspaceEngine.health}
                            />
                        </div>
                    </div>
                </ExecutiveSection>

                <ExecutiveSection
                    eyebrow="Financial Focus"
                    title="Revenue and Executive Intelligence"
                    description="Your highest-value financial opportunity and Vellum’s current assessment of the business."
                >
                    <div className="grid gap-6 xl:grid-cols-2">
                        <WorkspaceRevenueOpportunityCard
                            opportunity={workspaceEngine.revenueOpportunity}
                        />

                        <WorkspaceExecutiveBriefCard
                            brief={workspaceEngine.executiveBrief}
                        />
                    </div>
                </ExecutiveSection>

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

                <details className="mt-10 overflow-hidden rounded-3xl border border-border/70 bg-card/60">
                    <summary className="cursor-pointer list-none px-5 py-5 transition hover:bg-primary/5 sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                                    Advanced Workspace
                                </p>

                                <h2 className="mt-2 text-2xl font-light tracking-tight">
                                    Analytics, Risks and Intelligence Tools
                                </h2>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                                    Expand for deeper reporting, historical activity, business
                                    risks, growth opportunities, and guided advisor commands.
                                </p>
                            </div>

                            <span className="inline-flex w-fit shrink-0 rounded-full border border-border px-4 py-2 text-sm text-foreground/70">
                                Explore
                            </span>
                        </div>
                    </summary>

                    <div className="border-t border-border/60 px-4 pb-8 sm:px-6">
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

                        <ExecutiveSection
                            eyebrow="Executive Advisor"
                            title="Command Center"
                            description="Run guided business commands and explore workspace intelligence."
                        >
                            <AICommandCenter />
                        </ExecutiveSection>

                        <div className="mt-10 grid gap-6 xl:grid-cols-2">
                            <WorkspaceActionsCard
                                userId={userId}
                                workspaceId={workspaceId}
                            />

                            <WorkspaceAICard />
                        </div>
                    </div>
                </details>
            </WorkspaceCommandCenter>

            {!isProfessional && (
                <div className="mt-10 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6 shadow-sm">
                    <p className="text-lg font-medium">
                        Unlock Executive Analytics
                    </p>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/70">
                        Upgrade to Professional to view revenue, collection, proposal, and
                        project-completion insights.
                    </p>
                </div>
            )}
        </BrandedDashboardShell>
    );
}