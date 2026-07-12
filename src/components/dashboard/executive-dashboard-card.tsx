import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";
import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";

type Props = {
    context: DashboardContext;
};

export function ExecutiveDashboardCard({ context }: Props) {
    const summary = context.executiveContext.summary;

    const metrics = [
        {
            label: "Overall",
            value: summary.overallHealth.toString(),
            helper: "Combined business health",
        },
        {
            label: "Revenue",
            value: summary.revenueHealth.toString(),
            helper: "Financial performance",
        },
        {
            label: "Clients",
            value: summary.clientHealth.toString(),
            helper: "Client relationship health",
        },
        {
            label: "Workspace",
            value: summary.workspaceHealth.toString(),
            helper: "Operational readiness",
        },
        {
            label: "Bookings",
            value: summary.bookingHealth.toString(),
            helper: "Scheduling performance",
        },
    ];

    return (
        <CommandCard
            eyebrow="Business Snapshot"
            title={context.executiveBrief.title}
            subtitle="A concise view of your organization’s current health."
        >
            <ExecutiveCallout
                title="Executive Overview"
                description={context.executiveBrief.overview}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                    <ExecutiveMetricTile
                        key={metric.label}
                        label={metric.label}
                        value={metric.value}
                        helper={metric.helper}
                    />
                ))}
            </div>
        </CommandCard>
    );
}