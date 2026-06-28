import { MetricCard } from "@/components/dashboard/metric-card";

type Metric = {
    label: string;
    value: string | number;
    helper: string;
};

type MetricsGridProps = {
    metrics: Metric[];
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
    return (
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
                <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    helper={metric.helper}
                />
            ))}
        </section>
    );
}