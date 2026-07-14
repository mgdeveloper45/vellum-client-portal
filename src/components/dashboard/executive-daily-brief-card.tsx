import Link from "next/link";
import type { WorkspaceMorningBrief } from "@/lib/services/workspace/workspace-morning-brief";
import type { ExecutiveAdvice } from "@/lib/services/intelligence/executive-advisor/executive-advisor-engine";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";
import { StatusBadge } from "@/components/ui/status-badge";

type Props = {
    brief: WorkspaceMorningBrief;
    topAdvice: ExecutiveAdvice | null;
};

const priorityVariant = {
    CRITICAL: "danger",
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "success",
} as const;

function formatCurrency(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

export function ExecutiveDailyBriefCard({
    brief,
    topAdvice,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Daily Brief"
            title={brief.greeting}
            subtitle={brief.dateLabel}
            className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.06]"
            actions={
                topAdvice ? (
                    <StatusBadge
                        variant={priorityVariant[topAdvice.priority]}
                    >
                        {topAdvice.priority}
                    </StatusBadge>
                ) : undefined
            }
        >
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                <div>
                    <p className="max-w-3xl text-lg font-light leading-8 text-foreground/75">
                        {brief.executiveSummary}
                    </p>

                    <section className="mt-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Yesterday
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <ExecutiveMetricTile
                                label="Revenue"
                                value={formatCurrency(
                                    brief.yesterday.revenue,
                                )}
                                helper="Revenue collected"
                            />

                            <ExecutiveMetricTile
                                label="Completed"
                                value={brief.yesterday.completedBookings.toString()}
                                helper="Bookings completed"
                            />

                            <ExecutiveMetricTile
                                label="New Clients"
                                value={brief.yesterday.newClients.toString()}
                                helper="Clients added"
                            />

                            <ExecutiveMetricTile
                                label="Proposals"
                                value={brief.yesterday.proposalsAccepted.toString()}
                                helper="Proposals accepted"
                            />
                        </div>
                    </section>

                    <section className="mt-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Today
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <ExecutiveMetricTile
                                label="Appointments"
                                value={brief.today.appointments.toString()}
                                helper="Scheduled today"
                            />

                            <ExecutiveMetricTile
                                label="Follow-Ups"
                                value={brief.today.followUps.toString()}
                                helper="Recommended actions"
                            />

                            <ExecutiveMetricTile
                                label="Invoices"
                                value={brief.today.overdueInvoices.toString()}
                                helper="Require attention"
                            />

                            <ExecutiveMetricTile
                                label="Revenue Outlook"
                                value={formatCurrency(
                                    brief.estimatedRevenue,
                                )}
                                helper="Current estimated revenue"
                            />
                        </div>
                    </section>
                </div>

                <aside className="flex h-full flex-col rounded-3xl border border-primary/20 bg-primary/[0.06] p-6 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
                        Today&apos;s Decision
                    </p>

                    {topAdvice ? (
                        <>
                            <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight">
                                {topAdvice.title}
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-foreground/65">
                                {topAdvice.reason}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                                        Impact
                                    </p>

                                    <p className="mt-2 text-xl font-light">
                                        {topAdvice.estimatedImpact > 0
                                            ? `+${formatCurrency(
                                                topAdvice.estimatedImpact,
                                            )}`
                                            : "Operational"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                                        Confidence
                                    </p>

                                    <p className="mt-2 text-xl font-light">
                                        {topAdvice.confidence}%
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                                        Effort
                                    </p>

                                    <p className="mt-2 text-xl font-light capitalize">
                                        {topAdvice.effort.toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                                    Recommended Action
                                </p>

                                <p className="mt-2 text-sm leading-6 text-foreground/70">
                                    {topAdvice.recommendedAction}
                                </p>
                            </div>

                            <div className="mt-auto pt-6">
                                <Link
                                    href={topAdvice.href}
                                    className="workspace-accent-button inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition hover:opacity-90"
                                >
                                    Review Decision
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mt-4 text-3xl font-light tracking-tight">
                                Maintain business momentum
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-foreground/65">
                                No urgent financial, booking, or operational issues were
                                detected.
                            </p>

                            <div className="mt-6 space-y-3">
                                {brief.recommendations.slice(0, 3).map(
                                    (recommendation) => (
                                        <div
                                            key={recommendation}
                                            className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm leading-6 text-foreground/70"
                                        >
                                            {recommendation}
                                        </div>
                                    ),
                                )}
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </CommandCard>
    );
}