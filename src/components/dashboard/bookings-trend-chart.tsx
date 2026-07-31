type BookingTrend = {
    label: string;
    count: number;
};

type BookingsTrendChartProps = {
    data: BookingTrend[];
};

export function BookingsTrendChart({
    data,
}: BookingsTrendChartProps) {
    const max = Math.max(
        ...data.map((item) => item.count),
        1,
    );

    const totalBookings = data.reduce(
        (sum, item) => sum + item.count,
        0,
    );

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Analytics
            </p>

            <h2 className="mt-2 text-2xl font-light tracking-tight">
                Booking Trend
            </h2>

            <p className="mt-2 text-sm text-foreground/60">
                Appointments scheduled over the next seven days.
            </p>

            <div className="mt-6">
                <p className="text-4xl font-light">
                    {totalBookings}
                </p>

                <p className="text-sm text-foreground/55">
                    Upcoming bookings
                </p>
            </div>

            <div className="mt-8 flex h-52 items-end gap-4">
                {data.map((item) => {
                    const height = Math.max(
                        (item.count / max) * 100,
                        item.count > 0 ? 12 : 4,
                    );

                    return (
                        <div
                            key={item.label}
                            className="group flex flex-1 flex-col items-center gap-3"
                        >
                            <div className="flex h-40 w-full items-end">
                                <div
                                    className="workspace-accent-bg w-full rounded-t-xl transition-all duration-700 group-hover:opacity-80"
                                    style={{
                                        height: `${height}%`,
                                    }}
                                />
                            </div>

                            <p className="text-xs uppercase tracking-wide text-foreground/55">
                                {item.label}
                            </p>

                            <p className="text-sm font-medium">
                                {item.count}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}