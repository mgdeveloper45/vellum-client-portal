import type { WorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";
import { CommandCard } from "@/components/ui/command-card";
import { cn } from "@/lib/utils";

type Props = {
    brief: WorkspaceMorningBrief;
};

function formatCurrency(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

export function WorkspaceMorningBriefCard({
    brief,
}: Props) {
    return (
        <CommandCard
            eyebrow="Morning Brief"
            title={brief.greeting}
            subtitle={brief.dateLabel}
        >
            <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-8">
                    <ComparisonSection
                        title="Yesterday"
                        metrics={[
                            {
                                label: "Revenue",
                                value: formatCurrency(
                                    brief.yesterday.revenue,
                                ),
                            },
                            {
                                label: "Bookings",
                                value: brief.yesterday.completedBookings.toString(),
                            },
                            {
                                label: "New Clients",
                                value: brief.yesterday.newClients.toString(),
                            },
                            {
                                label: "Accepted Proposals",
                                value: brief.yesterday.proposalsAccepted.toString(),
                            },
                        ]}
                    />

                    <ComparisonSection
                        title="Today"
                        metrics={[
                            {
                                label: "Appointments",
                                value: brief.today.appointments.toString(),
                            },
                            {
                                label: "Follow Ups",
                                value: brief.today.followUps.toString(),
                            },
                            {
                                label: "Overdue Invoices",
                                value: brief.today.overdueInvoices.toString(),
                            },
                            {
                                label: "Projected Revenue",
                                value: formatCurrency(
                                    brief.estimatedRevenue,
                                ),
                            },
                        ]}
                    />
                </div>

                <aside className="flex flex-col rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                            Executive Recommendation
                        </p>

                        <p className="mt-5 text-base leading-8 text-foreground/80">
                            {brief.executiveSummary}
                        </p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-border/70 bg-background/70 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                            Action Plan
                        </p>

                        <ol className="mt-5 space-y-4">
                            {brief.recommendations.map(
                                (recommendation, index) => (
                                    <li
                                        key={recommendation}
                                        className="flex gap-4"
                                    >
                                        <span
                                            className={cn(
                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                                "border border-primary/20 bg-primary/10",
                                                "text-xs font-semibold text-primary",
                                            )}
                                        >
                                            {index + 1}
                                        </span>

                                        <p className="pt-1 text-sm leading-6 text-foreground/70">
                                            {recommendation}
                                        </p>
                                    </li>
                                ),
                            )}
                        </ol>
                    </div>

                    <div className="mt-auto border-t border-primary/10 pt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                            Today‘s Objective
                        </p>

                        <p className="mt-3 text-sm leading-7 text-foreground/60">
                            Complete revenue-generating work first, resolve
                            overdue financial items, then move into scheduled
                            client commitments.
                        </p>
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}

type ComparisonMetric = {
    label: string;
    value: string;
};

function ComparisonSection({
    title,
    metrics,
}: {
    title: string;
    metrics: ComparisonMetric[];
}) {
    return (
        <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                {title}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {metrics.map((metric) => (
                    <MetricCard
                        key={metric.label}
                        label={metric.label}
                        value={metric.value}
                    />
                ))}
            </div>
        </section>
    );
}

function MetricCard({
    label,
    value,
}: ComparisonMetric) {
    return (
        <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                {label}
            </p>

            <p className="mt-3 text-3xl font-light tracking-tight">
                {value}
            </p>
        </div>
    );
}