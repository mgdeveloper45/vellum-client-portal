import Link from "next/link";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveButton } from "@/components/ui/executive-button";

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
            subtitle="Your business priorities, financial outlook, and recommended focus for today."
            className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/10"
        >
            <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-stretch">
                <div className="flex flex-col">
                    <div className="max-w-3xl">
                        <p className="text-xl font-light leading-9 text-foreground/80">
                            {narrative}
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="rounded-3xl border border-border/60 bg-background/55 p-5"
                            >
                                <p className="text-xs font-medium uppercase tracking-[0.22em] text-foreground/45">
                                    {metric.label}
                                </p>

                                <p className="mt-3 text-3xl font-light tracking-tight">
                                    {metric.value}
                                </p>

                                {metric.helper && (
                                    <p className="mt-2 text-xs leading-5 text-foreground/50">
                                        {metric.helper}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {primaryAction && (
                        <div className="mt-8">
                            <Link href={primaryAction.href}>
                                <ExecutiveButton size="lg">
                                    {primaryAction.label}
                                </ExecutiveButton>
                            </Link>
                        </div>
                    )}
                </div>

                <aside className="flex h-full flex-col rounded-3xl border border-primary/20 bg-primary/[0.06] p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
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
                        <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                                Estimated Impact
                            </p>

                            <p className="mt-2 text-2xl font-light">
                                {outstandingRevenue}
                            </p>

                            <p className="mt-1 text-xs text-foreground/50">
                                Potential near-term recovery
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}