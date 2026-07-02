type TimelineItem = {
    id: string;
    title: string;
    description: string;
    completed: boolean;
};

type BookingTimelineProps = {
    items: TimelineItem[];
};

export function BookingTimeline({
    items,
}: BookingTimelineProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">
                Booking Timeline
            </h2>

            <div className="mt-8 space-y-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4"
                    >
                        <div
                            className={`mt-1 h-4 w-4 rounded-full ${item.completed
                                    ? "bg-green-500"
                                    : "border-2 border-border"
                                }`}
                        />

                        <div>
                            <h3 className="font-medium">
                                {item.title}
                            </h3>

                            <p className="mt-1 text-sm text-foreground/60">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}