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
    return (
        <section className="rounded-3xl border border-border bg-card p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Booking
                    </p>

                    <h1 className="mt-2 text-4xl font-light">
                        {customerName}
                    </h1>

                    <p className="mt-3 text-lg text-foreground/70">
                        {serviceName}
                    </p>
                </div>

                <div className="text-right">
                    <div className="workspace-accent-badge inline-flex rounded-full px-4 py-2 text-sm">
                        {status}
                    </div>

                    <p className="mt-4 text-lg">
                        {date}
                    </p>

                    <p className="text-sm text-foreground/60">
                        {time}
                    </p>
                </div>
            </div>
        </section>
    );
}