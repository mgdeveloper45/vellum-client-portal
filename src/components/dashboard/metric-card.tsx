type MetricCardProps = {
    label: string;
    value: string | number;
    helper: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/60">{label}</p>

            <p className="mt-4 text-4xl font-light">{value}</p>

            <p className="mt-3 text-sm text-foreground/60">{helper}</p>
        </div>
    );
}