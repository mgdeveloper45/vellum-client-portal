type BookingTrend = {
    label: string;
    count: number;
};

type BookingsTrendChartProps = {
    data: BookingTrend[];
};

export function BookingsTrendChart({ data }: BookingsTrendChartProps) {
    const max = Math.max(...data.map((item) => item.count), 1);

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">Booking Trend</h2>

            <p className="mt-1 text-sm text-foreground/60">
                Appointments scheduled over the next 7 days.
            </p>

            <div className="mt-6 flex h-48 items-end gap-3">
                {data.map((item) => {
                    const height = Math.max((item.count / max) * 100, item.count > 0 ? 12 : 4);

                    return (
                        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                            <div className="flex h-36 w-full items-end">
                                <div
                                    className="workspace-accent-bg w-full rounded-t-xl"
                                    style={{
                                        height: `${height}%`,
                                    }}
                                />
                            </div>

                            <p className="text-xs text-foreground/60">{item.label}</p>

                            <p className="text-xs font-medium">{item.count}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}