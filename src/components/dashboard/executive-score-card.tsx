import type {
    ExecutiveScore,
    ExecutiveScoreTrend,
} from "@/lib/services/dashboard/executive-score";
import { CommandCard } from "@/components/ui/command-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type Props = {
    executiveScore: ExecutiveScore;
    className?: string;
};

const trendConfig: Record<
    ExecutiveScoreTrend,
    {
        icon: string;
        label: string;
        className: string;
    }
> = {
    up: {
        icon: "↗",
        label: "Improving",
        className: "text-emerald-600",
    },
    down: {
        icon: "↘",
        label: "Declining",
        className: "text-red-600",
    },
    stable: {
        icon: "→",
        label: "Stable",
        className: "text-amber-600",
    },
};

function clampScore(score: number) {
    return Math.min(Math.max(score, 0), 100);
}

function getStatusVariant(score: number) {
    if (score >= 90) {
        return "success";
    }

    if (score >= 70) {
        return "warning";
    }

    return "danger";
}

function getContributorBarClass(score: number) {
    if (score >= 90) {
        return "bg-emerald-500";
    }

    if (score >= 70) {
        return "bg-amber-500";
    }

    return "bg-red-500";
}

export function ExecutiveScoreCard({
    executiveScore,
    className,
}: Props) {
    const score = clampScore(executiveScore.score);
    const circumference = 2 * Math.PI * 58;
    const strokeOffset =
        circumference - (score / 100) * circumference;

    const overallTrend = trendConfig[executiveScore.trend];
    const statusVariant = getStatusVariant(score);

    const deltaLabel =
        executiveScore.delta > 0
            ? `+${executiveScore.delta}`
            : executiveScore.delta.toString();

    return (
        <CommandCard
            eyebrow="Executive Intelligence"
            title="Executive Score"
            subtitle="A unified assessment of your business performance and operational health."
            className={cn(
                "overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.06]",
                className,
            )}
            actions={
                <StatusBadge variant={statusVariant}>
                    Grade {executiveScore.grade}
                </StatusBadge>
            }
        >
            <div className="grid gap-10 xl:grid-cols-[0.72fr_1.28fr]">
                <section className="flex flex-col justify-between rounded-3xl border border-primary/20 bg-primary/[0.05] p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative h-44 w-44">
                            <svg
                                aria-hidden="true"
                                className="h-full w-full -rotate-90"
                                viewBox="0 0 144 144"
                            >
                                <circle
                                    cx="72"
                                    cy="72"
                                    r="58"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    className="text-border/70"
                                />

                                <circle
                                    cx="72"
                                    cy="72"
                                    r="58"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeOffset}
                                    className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-light tracking-tight">
                                    {score}
                                </span>

                                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                                    Out of 100
                                </span>
                            </div>
                        </div>

                        <h3 className="mt-6 text-3xl font-light tracking-tight">
                            {executiveScore.status}
                        </h3>

                        <div
                            className={cn(
                                "mt-3 inline-flex items-center gap-2 text-sm font-medium",
                                overallTrend.className,
                            )}
                        >
                            <span aria-hidden="true" className="text-lg">
                                {overallTrend.icon}
                            </span>

                            <span>
                                {deltaLabel} · {overallTrend.label}
                            </span>
                        </div>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-foreground/65">
                            Your score combines revenue, bookings, capacity,
                            collections, and client performance into one
                            explainable business-health indicator.
                        </p>
                    </div>

                    <div className="mt-8 rounded-2xl border border-border/60 bg-background/60 p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/45">
                            Current Assessment
                        </p>

                        <p className="mt-3 text-sm leading-6 text-foreground/70">
                            {score >= 90
                                ? "The business is performing strongly. Preserve momentum while addressing any weaker contributors."
                                : score >= 70
                                    ? "The business is stable, but targeted improvements could materially strengthen overall performance."
                                    : "Several business signals require attention. Prioritize the lowest-performing contributors first."}
                        </p>
                    </div>
                </section>

                <section>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                                Score Contributors
                            </p>

                            <h3 className="mt-3 text-3xl font-light tracking-tight">
                                What is driving your score
                            </h3>
                        </div>

                        <p className="max-w-md text-sm leading-6 text-foreground/60">
                            Each contributor shows the strength and direction of
                            a core business signal.
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        {executiveScore.contributors.map((contributor) => {
                            const contributorScore = clampScore(
                                contributor.score,
                            );
                            const contributorTrend =
                                trendConfig[contributor.trend];

                            return (
                                <article
                                    key={contributor.key}
                                    className="rounded-2xl border border-border/70 bg-background/60 p-5 transition hover:border-primary/25"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="font-medium">
                                                    {contributor.label}
                                                </h4>

                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 text-xs font-medium",
                                                        contributorTrend.className,
                                                    )}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="text-base"
                                                    >
                                                        {
                                                            contributorTrend.icon
                                                        }
                                                    </span>

                                                    {
                                                        contributorTrend.label
                                                    }
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-foreground/60">
                                                {contributor.summary}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-3xl font-light tracking-tight">
                                            {contributorScore}
                                        </p>
                                    </div>

                                    <div
                                        className="mt-5 h-2 overflow-hidden rounded-full bg-border/60"
                                        role="progressbar"
                                        aria-label={`${contributor.label} score`}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-valuenow={contributorScore}
                                    >
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-[width] duration-700 ease-out",
                                                getContributorBarClass(
                                                    contributorScore,
                                                ),
                                            )}
                                            style={{
                                                width: `${contributorScore}%`,
                                            }}
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </CommandCard>
    );
}