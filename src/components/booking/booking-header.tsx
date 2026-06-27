type BookingHeaderProps = {
    companyName: string;
    accentColor?: string | null;
};

export function BookingHeader({
    companyName,
    accentColor,
}: BookingHeaderProps) {
    return (
        <header
            className="rounded-3xl border border-border bg-card p-10"
            style={
                {
                    "--workspace-accent": accentColor || "#8B5CF6",
                } as React.CSSProperties
            }
        >
            <p className="workspace-accent-text text-sm uppercase tracking-[0.4em]">
                {companyName}
            </p>

            <h1 className="mt-5 text-5xl font-light tracking-tight">
                Book an Appointment
            </h1>

            <p className="mt-4 max-w-xl text-lg text-foreground/70">
                Choose a service, select a time, and confirm your booking in just a few
                clicks.
            </p>
        </header>
    );
}