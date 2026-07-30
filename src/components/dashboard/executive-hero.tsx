import Link from "next/link";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveButton } from "@/components/ui/executive-button";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";
import { cn } from "@/lib/utils";

type HeroMetric = {
    label: string;
    value: string;
    helper: string;
};

type Props = {
    firstName: string | null;
    narrative: string;
    projectedRevenue: string;
    outstandingRevenue: string;
    priorityCount: number;
    primaryAction?: {
        label: string;
        href: string;
    };
};

type PriorityState = {
    label: string;
    description: string;
    indicatorClassName: string;
    badgeClassName: string;
};

function getPriorityState(priorityCount: number): PriorityState {
    if (priorityCount >= 6) {
        return {
            label: "High attention",
            description:
                "Several high-impact items need attention before routine operational work.",
            indicatorClassName:
                "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.45)]",
            badgeClassName:
                "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
        };
    }

    if (priorityCount >= 3) {
        return {
            label: "Focused",
            description:
                "A manageable set of priorities should guide today’s work.",
            indicatorClassName:
                "bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.4)]",
            badgeClassName:
                "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        };
    }

    return {
        label: "Stable",
        description:
            "Operations are under control, leaving room for growth and client-focused work.",
        indicatorClassName:
            "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.4)]",
        badgeClassName:
            "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    };
}

export function ExecutiveHero({
    firstName,
    narrative,
    projectedRevenue,
    outstandingRevenue,
    priorityCount,
    primaryAction,
}: Props) {
    const priorityState = getPriorityState(priorityCount);

    const metrics: HeroMetric[] = [
        {
            label: "Projected Revenue",
            value: projectedRevenue,
            helper: "Expected from current business activity",
        },
        {
            label: "Awaiting Collection",
            value: outstandingRevenue,
            helper: "Outstanding invoice revenue",
        },
        {
            label: "Priority Actions",
            value: priorityCount.toLocaleString("en-US"),
            helper:
                priorityCount === 1
                    ? "Recommended action requiring attention"
                    : "Recommended actions requiring attention",
        },
    ];

    const recommendedFocus =
        priorityCount > 0
            ? "Complete the highest-impact recommendations before moving into lower-value operational work."
            : "Protect today’s momentum by focusing on growth, client experience, and upcoming opportunities.";

    return (
        <CommandCard
            eyebrow="Today’s Mission"
            title={`Welcome back${firstName ? `, ${firstName}` : ""}.`}
            subtitle="Your executive workspace has reviewed current revenue, operations, and business priorities."
            className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.08]"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] xl:gap-10">
                <section className="min-w-0">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                                Executive Overview
                            </p>

                            <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl xl:text-5xl">
                                Focus on the work that moves the business
                                forward.
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                                Vellum has organized today’s financial and
                                operational signals into a focused plan of
                                action.
                            </p>
                        </div>

                        <div
                            className={cn(
                                "inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium",
                                priorityState.badgeClassName,
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    "h-2 w-2 rounded-full",
                                    priorityState.indicatorClassName,
                                )}
                            />
                            {priorityState.label}
                        </div>
                    </div>

                    <div className="mt-8">
                        <ExecutiveCallout
                            title="Executive Intelligence"
                            description={narrative}
                        />
                    </div>

                    <dl className="mt-8 grid gap-4 md:grid-cols-3">
                        {metrics.map((metric) => (
                            <div key={metric.label}>
                                <ExecutiveMetricTile
                                    label={metric.label}
                                    value={metric.value}
                                    helper={metric.helper}
                                />
                            </div>
                        ))}
                    </dl>

                    {primaryAction && (
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href={primaryAction.href}>
                                <ExecutiveButton size="lg">
                                    {primaryAction.label}
                                </ExecutiveButton>
                            </Link>

                            <p className="text-sm text-foreground/50">
                                Start with the most valuable work identified for
                                today.
                            </p>
                        </div>
                    )}
                </section>

                <aside className="flex min-w-0 flex-col rounded-3xl border border-primary/20 bg-primary/[0.045] p-6 sm:p-7">
                    <div>
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                                Recommended Focus
                            </p>

                            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-foreground/55">
                                Today
                            </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-light leading-snug tracking-tight">
                            {recommendedFocus}
                        </h3>

                        <p className="mt-4 text-sm leading-7 text-foreground/60">
                            {priorityState.description}
                        </p>
                    </div>

                    <div className="mt-7 rounded-2xl border border-border/70 bg-background/65 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground/45">
                            Suggested Sequence
                        </p>

                        <ol className="mt-5 space-y-4">
                            <FocusStep
                                number={1}
                                title="Protect revenue"
                                description="Resolve collections and revenue-related actions first."
                            />

                            <FocusStep
                                number={2}
                                title="Prepare operations"
                                description="Review today’s bookings, workload, and delivery needs."
                            />

                            <FocusStep
                                number={3}
                                title="Follow through"
                                description="Complete client communication and growth opportunities."
                            />
                        </ol>
                    </div>

                    <div className="mt-6 border-t border-primary/15 pt-6">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                                    Revenue to Recover
                                </p>

                                <p className="mt-2 text-3xl font-light tracking-tight">
                                    {outstandingRevenue}
                                </p>
                            </div>

                            <p className="max-w-32 text-right text-xs leading-5 text-foreground/50">
                                Potential cash flow awaiting collection
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}

type FocusStepProps = {
    number: number;
    title: string;
    description: string;
};

function FocusStep({
    number,
    title,
    description,
}: FocusStepProps) {
    return (
        <li className="flex gap-4">
            <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary"
            >
                {number}
            </span>

            <div>
                <p className="text-sm font-medium">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-foreground/55">
                    {description}
                </p>
            </div>
        </li>
    );
}