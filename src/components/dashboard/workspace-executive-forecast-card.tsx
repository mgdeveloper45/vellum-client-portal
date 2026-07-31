import type {
    RevenueForecast,
    RevenueForecastRisk,
    RevenueForecastTrend,
} from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type Props = {
    forecast: RevenueForecast;
};

const riskVariant: Record<
    RevenueForecastRisk,
    "success" | "warning" | "danger"
> = {
    LOW: "success",
    MEDIUM: "warning",
    HIGH: "danger",
};

const trendLabel: Record<RevenueForecastTrend, string> = {
    UP: "Growing",
    STABLE: "Stable",
    DOWN: "Declining",
};

const trendIcon: Record<RevenueForecastTrend, string> = {
    UP: "↑",
    STABLE: "→",
    DOWN: "↓",
};

function formatCurrency(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

function confidenceStatus(confidence: number) {
    if (confidence >= 90) return "High";
    if (confidence >= 75) return "Good";
    return "Limited";
}

export function WorkspaceExecutiveForecastCard({
    forecast,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Forecast"
            title="Revenue Outlook"
            subtitle="Projected financial performance based on invoices, collections, and upcoming business activity."
            actions={
                <StatusBadge variant={riskVariant[forecast.risk]}>
                    {forecast.risk} RISK
                </StatusBadge>
            }
        >
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ExecutiveMetricTile
                            label="Projected Revenue"
                            value={formatCurrency(
                                forecast.projectedRevenue,
                            )}
                            helper="Expected business revenue"
                        />

                        <ExecutiveMetricTile
                            label="Expected Collections"
                            value={formatCurrency(
                                forecast.expectedCollections,
                            )}
                            helper="Outstanding invoices likely to be paid"
                        />

                        <ExecutiveMetricTile
                            label="Revenue At Risk"
                            value={formatCurrency(
                                forecast.revenueAtRisk,
                            )}
                            helper="Revenue unlikely to be collected"
                        />

                        <ExecutiveMetricTile
                            label="Forecast Confidence"
                            value={`${forecast.confidence}%`}
                            helper={confidenceStatus(
                                forecast.confidence,
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <ExecutiveCallout
                            title={`Trend ${trendIcon[forecast.trend]} ${trendLabel[forecast.trend]}`}
                            description={forecast.summary}
                        />
                    </div>
                </div>

                <aside className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        Forecast Summary
                    </p>

                    <div className="mt-6 space-y-5">
                        <ForecastRow
                            label="Trend"
                            value={trendLabel[forecast.trend]}
                        />

                        <ForecastRow
                            label="Confidence"
                            value={`${forecast.confidence}%`}
                        />

                        <ForecastRow
                            label="Risk Level"
                            value={forecast.risk}
                        />
                    </div>

                    <div className="mt-8 rounded-2xl border border-border/60 bg-background/70 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                            Executive Guidance
                        </p>

                        <p className="mt-4 text-sm leading-7 text-foreground/65">
                            {forecast.risk === "HIGH"
                                ? "Protect cash flow, prioritize collections, and closely monitor outstanding invoices."
                                : forecast.risk === "MEDIUM"
                                    ? "Maintain collection efforts while keeping upcoming bookings on schedule."
                                    : "Financial outlook is healthy. Focus on growth opportunities and client experience."}
                        </p>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-foreground/45">
                            <span>Forecast Confidence</span>
                            <span>{forecast.confidence}%</span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700",
                                    forecast.risk === "HIGH"
                                        ? "bg-red-500"
                                        : forecast.risk === "MEDIUM"
                                            ? "bg-amber-500"
                                            : "bg-emerald-500",
                                )}
                                style={{
                                    width: `${forecast.confidence}%`,
                                }}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </CommandCard>
    );
}

function ForecastRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">
                {label}
            </span>

            <span className="font-medium">
                {value}
            </span>
        </div>
    );
}