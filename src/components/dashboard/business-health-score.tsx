import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "stable";

type Metric = {
    label: string;
    trend: Trend;
};

type Props = {
    score: number;
    status: string;
    metrics: Metric[];
};

const trendStyles = {
    up: {
        icon: "↗",
        className: "text-emerald-600",
    },
    down: {
        icon: "↘",
        className: "text-red-600",
    },
    stable: {
        icon: "→",
        className: "text-amber-600",
    },
};

export function BusinessHealthScore({
    score,
    status,
    metrics,
}: Props) {
    const circumference = 2 * Math.PI * 56;

    const progress = Math.min(Math.max(score, 0), 100);

    const offset =
        circumference -
        (progress / 100) * circumference;

    return (
        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.04] p-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-8">

                    <div className="relative h-36 w-36">

                        <svg
                            className="-rotate-90"
                            width="144"
                            height="144"
                        >
                            <circle
                                cx="72"
                                cy="72"
                                r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                className="text-border"
                            />

                            <circle
                                cx="72"
                                cy="72"
                                r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeLinecap="round"
                                className="text-primary transition-all duration-700"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-5xl font-light">
                                {score}
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-foreground/45">
                                Health
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.30em] text-primary">
                            Business Health
                        </p>

                        <h2 className="mt-3 text-4xl font-light tracking-tight">
                            {status}
                        </h2>

                        <p className="mt-4 max-w-lg text-sm leading-7 text-foreground/65">
                            Vellum continuously evaluates bookings,
                            revenue, collections, utilization,
                            customer activity, and operational
                            performance to calculate your overall
                            business health.
                        </p>
                    </div>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                    {metrics.map((metric) => {
                        const trend = trendStyles[metric.trend];

                        return (
                            <div
                                key={metric.label}
                                className="rounded-2xl border border-border bg-background/60 px-5 py-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        {metric.label}
                                    </span>

                                    <span
                                        className={cn(
                                            "text-lg font-medium",
                                            trend.className,
                                        )}
                                    >
                                        {trend.icon}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}