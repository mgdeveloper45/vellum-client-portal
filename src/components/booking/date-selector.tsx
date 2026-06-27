type DateSelectorProps = {
    selectedDate: string;
    serviceId: string;
    slug: string;
};

export function DateSelector({
    selectedDate,
    serviceId,
    slug,
}: DateSelectorProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-8">
            <p className="workspace-accent-text text-sm font-medium">
                Step 2
            </p>

            <h2 className="mt-2 text-2xl font-light">
                Choose a date
            </h2>

            <form
                action={`/book/${slug}`}
                className="mt-6 flex items-center gap-3"
            >
                <input
                    type="hidden"
                    name="serviceId"
                    value={serviceId}
                />

                <input
                    type="date"
                    name="date"
                    defaultValue={selectedDate}
                    className="rounded-xl border border-border bg-background px-5 py-3"
                />

                <button className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium">
                    Update
                </button>
            </form>
        </section>
    );
}