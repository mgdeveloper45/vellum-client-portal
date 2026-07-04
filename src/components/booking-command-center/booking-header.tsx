type BookingHeaderProps = {
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    status: string;
};

export function BookingHeader({
    customerName,
    serviceName,
    date,
    time,
    status,
}: BookingHeaderProps) {
    const initials = customerName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                    <div className="workspace-accent-bg flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-semibold text-white shadow">
                        {initials}
                    </div>

                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                            Booking Command Center
                        </p>

                        <h1 className="mt-2 text-4xl font-light">{customerName}</h1>

                        <p className="mt-2 text-lg text-foreground/70">{serviceName}</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/80 p-5 text-left lg:text-right">
                    <div className="workspace-accent-badge inline-flex rounded-full px-4 py-2 text-sm">
                        {status}
                    </div>

                    <p className="mt-4 text-lg font-medium">{date}</p>

                    <p className="text-sm text-foreground/60">{time}</p>
                </div>
            </div>
        </section>
    );
}