type TimelineItem = {
    id: string;
    type: string;
    title: string;
    detail: string;
    date: Date;
};

type ProjectTimelineProps = {
    items: TimelineItem[];
};

export function ProjectTimeline({
    items,
}: ProjectTimelineProps) {
    return (
        <section
            aria-labelledby="timeline-heading"
            className="mt-10"
        >
            <h2
                id="timeline-heading"
                className="text-xl font-medium"
            >
                Activity Timeline
            </h2>

            <div className="mt-4 grid gap-3">
                {items.map((item) => (
                    <div
                        key={`${item.type}-${item.id}`}
                        className="rounded-xl border border-border p-4"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <p className="font-medium">
                                {item.title}
                            </p>

                            <span className="text-xs text-accent">
                                {item.type}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-foreground/70">
                            {item.detail}
                        </p>

                        <p className="mt-3 text-xs text-foreground/50">
                            {item.date.toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}