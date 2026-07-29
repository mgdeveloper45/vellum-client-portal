import Link from "next/link";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveButton } from "@/components/ui/executive-button";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";

type HeroMetric = {
    label: string;
    value: string;
    helper?: string;
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

export function ExecutiveHero({
    firstName,
    narrative,
    projectedRevenue,
    outstandingRevenue,
    priorityCount,
    primaryAction,
}: Props) {
    const metrics: HeroMetric[] = [
        {
            label: "Projected Revenue",
            value: projectedRevenue,
            helper: "Expected from current business activity",
        },
        {
            label: "Revenue Awaiting Collection",
            value: outstandingRevenue,
            helper: "Outstanding invoices requiring attention",
        },
        {
            label: "Priority Actions",
            value: priorityCount.toString(),
            helper: "High-impact recommendations",
        },
    ];

    const recommendedFocus =
        priorityCount > 0
            ? "Complete today's highest-impact actions before moving to lower-value operational work."
            : "Operations are in good shape. Focus on growth opportunities and client experience.";

    const impactLabel =
        priorityCount > 5
            ? "High"
            : priorityCount > 2
                ? "Moderate"
                : "Stable";

    return (
        <CommandCard
            eyebrow="Today's Mission"
            title={`Good afternoon${firstName ? `, ${firstName}` : ""}.`}
            subtitle="Your executive workspace has analyzed today's business and identified the highest-value work."
            className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/10"
        >
            <div className="grid gap-10 xl:grid-cols-[1.45fr_0.55fr]">
                <section className="flex flex-col">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.30em] text-primary">
                            Executive Summary
                        </p>

                        <h2 className="mt-4 text-4xl font-light leading-tight tracking-tight xl:text-5xl">
                            Focus on the work that moves today‘s business forward.
                        </h2>

                        <p className="mt-6 max-w-3xl text-base leading-8 text-foreground/70 xl:text-lg">
                            Vellum has already reviewed today‘s appointments,
                            revenue, collections, and operational priorities.
                            Your objective is simple: complete the highest-impact
                            work first and let everything else follow.
                        </p>
                    </div>

                    <div className="mt-10">
                        <ExecutiveCallout
                            title="Executive Intelligence"
                            description={narrative}
                        />
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {metrics.map((metric) => (
                            <ExecutiveMetricTile
                                key={metric.label}
                                label={metric.label}
                                value={metric.value}
                                helper={metric.helper}
                            />
                        ))}
                    </div>

                    {primaryAction && (
                        <div className="mt-10">
                            <Link href={primaryAction.href}>
                                <ExecutiveButton size="lg">
                                    {primaryAction.label}
                                </ExecutiveButton>
                            </Link>
                        </div>
                    )}
                </section>

                <aside className="flex h-full flex-col rounded-3xl border border-primary/20 bg-primary/[0.05] p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.30em] text-primary">
                        Recommended Focus
                    </p>

                    <h3 className="mt-4 text-2xl font-light leading-tight">
                        {recommendedFocus}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-foreground/65">
                        These recommendations are generated from your current
                        operational state, financial outlook, and today‘s
                        executive priorities.
                    </p>

                    <div className="mt-8 space-y-4">
                        <ExecutiveMetricTile
                            label="Estimated Recovery"
                            value={outstandingRevenue}
                            helper="Potential revenue collection"
                        />

                        <ExecutiveMetricTile
                            label="Business Impact"
                            value={impactLabel}
                            helper="Overall urgency"
                        />
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="rounded-2xl border border-primary/15 bg-background/70 p-5 backdrop-blur-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                                Executive Recommendation
                            </p>

                            <p className="mt-3 text-sm leading-7 text-foreground/70">
                                Prioritize revenue-generating work first, resolve
                                outstanding collections, then move into today‘s
                                appointments and client follow-ups. Completing
                                high-impact work early creates flexibility for the
                                remainder of the day.
                            </p>

                            {primaryAction && (
                                <div className="mt-6">
                                    <Link
                                        href={primaryAction.href}
                                        className="block"
                                    >
                                        <ExecutiveButton
                                            size="lg"
                                            className="w-full"
                                        >
                                            {primaryAction.label}
                                        </ExecutiveButton>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}