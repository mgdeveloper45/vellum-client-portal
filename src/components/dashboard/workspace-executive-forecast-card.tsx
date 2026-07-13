import type {
    RevenueForecast,
    RevenueForecastRisk,
    RevenueForecastTrend,
} from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveCallout } from "@/components/ui/executive-callout";
import { ExecutiveMetricTile } from "@/components/ui/executive-metric-tile";
import { StatusBadge } from "@/components/ui/status-badge";

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
    UP: "↑ Growing",
    STABLE: "→ Stable",
    DOWN: "↓ Declining",
};

function formatCurrency(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

export function WorkspaceExecutiveForecastCard({
    forecast,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Forecast"
            title="Revenue Outlook"
            subtitle="A forward-looking estimate based on collections, invoice history, and upcoming business activity."
            actions={
                <StatusBadge variant={riskVariant[forecast.risk]}>
                    {forecast.risk} RISK
                </StatusBadge>
            }
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ExecutiveMetricTile
                    label="Projected Revenue"
                    value={formatCurrency(forecast.projectedRevenue)}
                    helper="Collected, expected, and scheduled revenue"
                />

                <ExecutiveMetricTile
                    label="Expected Collections"
                    value={formatCurrency(forecast.expectedCollections)}
                    helper="Likely recovery from outstanding invoices"
                />

                <ExecutiveMetricTile
                    label="Revenue at Risk"
                    value={formatCurrency(forecast.revenueAtRisk)}
                    helper="Outstanding revenue unlikely to be collected"
                />

                <ExecutiveMetricTile
                    label="Forecast Confidence"
                    value={`${forecast.confidence}%`}
                    helper={trendLabel[forecast.trend]}
                />
            </div>

            <div className="mt-6">
                <ExecutiveCallout
                    title={`Revenue trend: ${trendLabel[forecast.trend]}`}
                    description={forecast.summary}
                />
            </div>
        </CommandCard>
    );
}