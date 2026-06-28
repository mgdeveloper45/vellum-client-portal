type ProfessionalMetric = {
    label: string;
    value: string | number;
    helper: string;
};

type ProfessionalMetricsProps = {
    metrics: ProfessionalMetric[];
};

export function ProfessionalMetrics({
    metrics,
}: ProfessionalMetricsProps) {
    return (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map((metric) => (
                <div
                    key={metric.label}
                    className="rounded-2xl border border-border bg-card p-5"
                >
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        {metric.label}
                    </p>

                    <p className="mt-3 text-2xl font-light">{metric.value}</p>

                    <p className="mt-2 text-xs text-foreground/50">{metric.helper}</p>
                </div>
            ))}
        </section>
    );
}