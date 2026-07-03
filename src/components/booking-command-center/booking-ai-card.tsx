type BookingAICardProps = {
    summary: string;
};

export function BookingAICard({
    summary,
}: BookingAICardProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    ✨
                </div>

                <div>
                    <h2 className="text-xl font-medium">
                        AI Brief
                    </h2>

                    <p className="text-sm text-foreground/60">
                        Booking intelligence summary
                    </p>
                </div>
            </div>

            <p className="mt-6 whitespace-pre-wrap leading-7 text-foreground/80">
                {summary}
            </p>
        </section>
    );
}