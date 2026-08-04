import { ExecutiveDashboardSection } from "@/components/dashboard/sections/executive-dashboard-section";
import { WorkspaceCommandCenter } from "@/components/dashboard/workspace-command-center";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { OperationsDashboardSection } from "@/components/dashboard/sections/operations-dashboard-section";
import { AnalyticsDashboardSection } from "@/components/dashboard/sections/analytics-dashboard-section";
import { AIDashboardSection } from "@/components/dashboard/sections/ai-dashboard-section";
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
    const { } = dashboard;

    return (
        <BrandedDashboardShell>
            <WorkspaceCommandCenter>
                <ExecutiveDashboardSection
                    dashboard={dashboard}
                />

                <OperationsDashboardSection
                    dashboard={dashboard}
                />

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
                        <AnalyticsDashboardSection
                            dashboard={dashboard}
                            isProfessional={isProfessional}
                        />

                        <AIDashboardSection
                            userId={userId}
                            workspaceId={workspaceId}
                        />
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