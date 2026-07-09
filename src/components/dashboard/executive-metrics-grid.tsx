import { ExecutiveMetricCard } from "@/components/ui/executive-metric-card";

type ExecutiveMetric = {
    label: string;
    value: string | number;
    helper?: string;
    trend?: string;
    tone?: "neutral" | "success" | "warning" | "danger";
};

type Props = {
    metrics: ExecutiveMetric[];
};

export function ExecutiveMetricsGrid({ metrics }: Props) {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
                <ExecutiveMetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    helper={metric.helper}
                    trend={metric.trend}
                    tone={metric.tone}
                />
            ))}
        </section>
    );
}