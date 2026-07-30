import { CommandCard } from "@/components/ui/command-card";
import { cn } from "@/lib/utils";

type Props = {
    overall: number;
    revenue: number;
    bookings: number;
    workspace: number;
    capacity: number;
};

type Metric = {
    label: string;
    score: number;
};

function getHealth(score: number) {
    if (score >= 90) {
        return {
            label: "Excellent",
            color: "bg-emerald-500",
            badge:
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        };
    }

    if (score >= 75) {
        return {
            label: "Healthy",
            color: "bg-green-500",
            badge:
                "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
        };
    }

    if (score >= 60) {
        return {
            label: "Watch",
            color: "bg-amber-500",
            badge:
                "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        };
    }

    return {
        label: "Needs Attention",
        color: "bg-red-500",
        badge:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    };
}

function PulseMetric({
    label,
    score,
}: Metric) {
    const health = getHealth(score);

    return (
        <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                        {label}
                    </p>

                    <p className="mt-3 text-3xl font-light tracking-tight">
                        {score}
                    </p>
                </div>

                <span
                    className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        health.badge,
                    )}
                >
                    {health.label}
                </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-700",
                        health.color,
                    )}
                    style={{
                        width: `${Math.min(Math.max(score, 0), 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}

export function BusinessPulseCard({
    overall,
    revenue,
    bookings,
    workspace,
    capacity,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Health"
            title="Business Pulse"
            subtitle="A real-time executive view of operational performance."
        >
            <div className="mb-8 rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Overall Business Health
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-5xl font-light tracking-tight">
                            {overall}
                        </p>

                        <p className="mt-2 text-sm text-foreground/60">
                            Composite executive score
                        </p>
                    </div>

                    <div className="text-right text-sm text-foreground/55">
                        Updated from revenue,
                        bookings,
                        workspace,
                        and capacity.
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <PulseMetric
                    label="Revenue"
                    score={revenue}
                />

                <PulseMetric
                    label="Bookings"
                    score={bookings}
                />

                <PulseMetric
                    label="Workspace"
                    score={workspace}
                />

                <PulseMetric
                    label="Capacity"
                    score={capacity}
                />
            </div>
        </CommandCard>
    );
}