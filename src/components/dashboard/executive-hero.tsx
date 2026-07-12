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
            helper: "Expected from current activity",
        },
        {
            label: "Collections Attention",
            value: outstandingRevenue,
            helper: "Outstanding revenue requiring follow-up",
        },
        {
            label: "High-Impact Actions",
            value: priorityCount.toString(),
            helper: "Recommended priorities for today",
        },
    ];

    return (
        <CommandCard
            eyebrow="Executive Brief"
            title={`Good afternoon${firstName ? `, ${firstName}` : ""}.`}
            subtitle="Your priorities, financial outlook, and recommended focus for today."
            className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/10"
        >
            <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="flex flex-col">
                    <ExecutiveCallout
                        title="Vellum Executive Advisor"
                        description={narrative}
                    />

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
                        <div className="mt-6">
                            <Link href={primaryAction.href}>
                                <ExecutiveButton size="lg">
                                    {primaryAction.label}
                                </ExecutiveButton>
                            </Link>
                        </div>
                    )}
                </div>

                <aside className="flex h-full flex-col rounded-3xl border border-primary/20 bg-primary/[0.06] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Recommended Focus
                    </p>

                    <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight">
                        Recover outstanding revenue and protect today&apos;s schedule.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-foreground/65">
                        Resolve unpaid invoices first, then review upcoming bookings and
                        high-value client follow-ups.
                    </p>

                    <div className="mt-auto pt-8">
                        <ExecutiveMetricTile
                            label="Estimated Impact"
                            value={outstandingRevenue}
                            helper="Potential near-term recovery"
                        />
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}