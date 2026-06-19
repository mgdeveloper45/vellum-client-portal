type StatCardProps = {
    label: string;
    value: string;
    helper: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/60">{label}</p>
            <p className="mt-3 text-3xl font-light">{value}</p>
            <p className="mt-2 text-sm text-foreground/50">{helper}</p>
        </div>
    );
}