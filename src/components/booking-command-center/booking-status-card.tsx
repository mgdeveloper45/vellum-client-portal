type BookingStatusCardProps = {
    lifecycle: string;
    health: number;
    countdown: string;
    invoiceStatus: string;
    depositStatus: string;
    projectStatus: string;
    calendarSynced: boolean;
};

export function BookingStatusCard({
    lifecycle,
    health,
    countdown,
    invoiceStatus,
    depositStatus,
    projectStatus,
    calendarSynced,
}: BookingStatusCardProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-medium">
                Booking Snapshot
            </h2>

            <div className="mt-6 space-y-4">
                <StatusRow label="Lifecycle" value={lifecycle} />
                <StatusRow label="Health" value={`${health}%`} />
                <StatusRow label="Countdown" value={countdown} />
                <StatusRow label="Invoice" value={invoiceStatus} />
                <StatusRow label="Deposit" value={depositStatus} />
                <StatusRow label="Project" value={projectStatus} />

                <StatusRow
                    label="Calendar"
                    value={calendarSynced ? "Synced" : "Not Synced"}
                />
            </div>
        </section>
    );
}

function StatusRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">
                {label}
            </span>

            <span className="font-medium">
                {value}
            </span>
        </div>
    );
}