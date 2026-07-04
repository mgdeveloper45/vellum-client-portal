type BookingAICardProps = {
    summary: string;
};

export function BookingAICard({ summary }: BookingAICardProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                    <div className="workspace-accent-bg flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow">
                        ✨
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                            Executive Brief
                        </p>

                        <h2 className="mt-1 text-2xl font-light">Vellum AI</h2>
                    </div>
                </div>

                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/60">
                    Confidence 98%
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                <p className="whitespace-pre-wrap leading-7 text-foreground/80">
                    {summary}
                </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button className="workspace-accent-button rounded-full px-4 py-2 text-sm font-medium">
                    Generate Follow-up
                </button>

                <button className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted">
                    Copy Brief
                </button>
            </div>
        </section>
    );
}