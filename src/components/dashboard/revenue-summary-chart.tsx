type RevenueSummaryChartProps = {
    collected: number;
    outstanding: number;
};

export function RevenueSummaryChart({
    collected,
    outstanding,
}: RevenueSummaryChartProps) {
    const total = collected + outstanding;
    const collectedPercent = total === 0 ? 0 : Math.round((collected / total) * 100);
    const outstandingPercent =
        total === 0 ? 0 : Math.round((outstanding / total) * 100);

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">Revenue Summary</h2>

            <p className="mt-1 text-sm text-foreground/60">
                Paid versus outstanding invoice revenue.
            </p>

            <div className="mt-6 space-y-5">
                <div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Collected</span>
                        <span>${collected.toLocaleString()}</span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="workspace-accent-bg h-full rounded-full"
                            style={{ width: `${collectedPercent}%` }}
                        />
                    </div>

                    <p className="mt-1 text-xs text-foreground/50">
                        {collectedPercent}% of total revenue
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between text-sm">
                        <span>Outstanding</span>
                        <span>${outstanding.toLocaleString()}</span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-foreground/30"
                            style={{ width: `${outstandingPercent}%` }}
                        />
                    </div>

                    <p className="mt-1 text-xs text-foreground/50">
                        {outstandingPercent}% still awaiting payment
                    </p>
                </div>
            </div>
        </section>
    );
}