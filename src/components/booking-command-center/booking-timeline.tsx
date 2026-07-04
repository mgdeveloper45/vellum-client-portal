type TimelineItem = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
};

type BookingTimelineProps = {
    items: TimelineItem[];
};

export function BookingTimeline({ items }: BookingTimelineProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-light">Booking Timeline</h2>

            <div className="mt-8 space-y-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <div key={item.id} className="relative flex gap-4 pb-8">
                            {!isLast && (
                                <div className="absolute left-[11px] top-7 h-full w-px bg-border" />
                            )}

                            <div
                                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs ${item.completed
                                        ? "workspace-accent-bg text-white"
                                        : "border border-border bg-card text-foreground/40"
                                    }`}
                            >
                                {item.completed ? "✓" : "•"}
                            </div>

                            <div className="-mt-1">
                                <h3 className="font-medium">{item.title}</h3>

                                <p className="mt-1 text-sm text-foreground/60">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}