import type { WorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";
import { CommandCard } from "@/components/ui/command-card";

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
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                    <section>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Yesterday
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <Metric
                                label="Revenue"
                                value={formatCurrency(brief.yesterday.revenue)}
                            />

                            <Metric
                                label="Bookings"
                                value={brief.yesterday.completedBookings.toString()}
                            />

                            <Metric
                                label="New Clients"
                                value={brief.yesterday.newClients.toString()}
                            />

                            <Metric
                                label="Proposals"
                                value={brief.yesterday.proposalsAccepted.toString()}
                            />
                        </div>
                    </section>

                    <section className="mt-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Today
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <Metric
                                label="Appointments"
                                value={brief.today.appointments.toString()}
                            />

                            <Metric
                                label="Follow Ups"
                                value={brief.today.followUps.toString()}
                            />

                            <Metric
                                label="Overdue"
                                value={brief.today.overdueInvoices.toString()}
                            />

                            <Metric
                                label="Projected Revenue"
                                value={formatCurrency(
                                    brief.estimatedRevenue,
                                )}
                            />
                        </div>
                    </section>
                </div>

                <aside className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Executive Recommendation
                    </p>

                    <p className="mt-4 text-base leading-7 text-foreground/80">
                        {brief.executiveSummary}
                    </p>

                    <div className="mt-6 space-y-3">
                        {brief.recommendations.map((recommendation) => (
                            <div
                                key={recommendation}
                                className="rounded-2xl border border-border bg-background p-3 text-sm"
                            >
                                {recommendation}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}

function Metric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">
                {label}
            </p>

            <p className="mt-2 text-2xl font-light">
                {value}
            </p>
        </div>
    );
}