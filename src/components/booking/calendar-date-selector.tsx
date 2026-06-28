type CalendarDateSelectorProps = {
    slug: string;
    serviceId: string;
    selectedDate: string;
};

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

export function CalendarDateSelector({
    slug,
    serviceId,
    selectedDate,
}: CalendarDateSelectorProps) {
    const today = new Date();

    const dates = Array.from({ length: 14 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return date;
    });

    return (
        <section className="rounded-3xl border border-border bg-card p-8">
            <p className="workspace-accent-text text-sm font-medium">Step 2</p>

            <h2 className="mt-2 text-2xl font-light">Choose a date</h2>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {dates.map((date) => {
                    const value = formatDate(date);
                    const isSelected = selectedDate === value;

                    return (
                        <a
                            key={value}
                            href={`/book/${slug}?serviceId=${serviceId}&date=${value}`}
                            className={
                                isSelected
                                    ? "workspace-accent-button rounded-2xl px-4 py-4 text-center text-sm font-medium"
                                    : "rounded-2xl border border-border px-4 py-4 text-center text-sm transition hover:border-foreground/40"
                            }
                        >
                            <span className="block text-xs uppercase opacity-70">
                                {date.toLocaleDateString(undefined, { weekday: "short" })}
                            </span>

                            <span className="mt-1 block text-lg">
                                {date.getDate()}
                            </span>

                            <span className="block text-xs opacity-70">
                                {date.toLocaleDateString(undefined, { month: "short" })}
                            </span>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}