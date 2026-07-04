type CustomerOverviewCardProps = {
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    workspaceName: string;
    notes?: string | null;
};

export function CustomerOverviewCard({
    customerName,
    customerEmail,
    customerPhone,
    workspaceName,
    notes,
}: CustomerOverviewCardProps) {
    const initials = customerName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="workspace-accent-bg flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white">
                    {initials}
                </div>

                <div>
                    <h2 className="text-2xl font-light">
                        {customerName}
                    </h2>

                    <p className="text-sm text-foreground/60">
                        Client Overview
                    </p>
                </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Info label="Email" value={customerEmail} />
                <Info label="Phone" value={customerPhone || "Not provided"} />
                <Info label="Workspace" value={workspaceName} />
            </div>

            {notes && (
                <div className="mt-8 rounded-2xl border border-border bg-background p-5">
                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                        Internal Notes
                    </p>

                    <p className="mt-3 leading-7 text-foreground/75">
                        {notes}
                    </p>
                </div>
            )}
        </section>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-foreground/50">
                {label}
            </p>

            <p className="mt-2 font-medium">
                {value}
            </p>
        </div>
    );
}