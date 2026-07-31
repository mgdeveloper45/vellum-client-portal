type RevenueSummaryChartProps = {
    collected: number;
    outstanding: number;
};

function formatCurrency(value: number) {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

export function RevenueSummaryChart({
    collected,
    outstanding,
}: RevenueSummaryChartProps) {
    const total = collected + outstanding;

    const collectedPercent =
        total === 0
            ? 0
            : Math.round((collected / total) * 100);

    const outstandingPercent =
        total === 0
            ? 0
            : Math.round((outstanding / total) * 100);

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Analytics
            </p>

            <h2 className="mt-2 text-2xl font-light tracking-tight">
                Revenue Summary
            </h2>

            <p className="mt-2 text-sm text-foreground/60">
                Paid versus outstanding invoice revenue.
            </p>

            <div className="mt-6">
                <p className="text-4xl font-light">
                    {formatCurrency(total)}
                </p>

                <p className="text-sm text-foreground/55">
                    Total invoice revenue
                </p>
            </div>

            <div className="mt-8 space-y-7">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Revenue Collected
                        </span>

                        <span className="text-sm font-medium">
                            {formatCurrency(collected)}
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="workspace-accent-bg h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${collectedPercent}%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-xs text-foreground/50">
                        {collectedPercent}% of total revenue
                    </p>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Outstanding Revenue
                        </span>

                        <span className="text-sm font-medium">
                            {formatCurrency(outstanding)}
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-foreground/30 transition-all duration-700"
                            style={{
                                width: `${outstandingPercent}%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-xs text-foreground/50">
                        {outstandingPercent}% awaiting collection
                    </p>
                </div>
            </div>
        </section>
    );
}