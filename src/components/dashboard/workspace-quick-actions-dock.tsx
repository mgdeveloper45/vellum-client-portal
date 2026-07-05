import Link from "next/link";

const actions = [
    {
        label: "New Booking",
        href: "/bookings",
    },
    {
        label: "Create Invoice",
        href: "/invoices",
    },
    {
        label: "View Calendar",
        href: "/bookings",
    },
    {
        label: "AI Command Center",
        href: "/ai/command-center",
    },
];

export function WorkspaceQuickActionsDock() {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Quick Actions
                    </p>

                    <h2 className="mt-2 text-2xl font-light">
                        Move the business forward
                    </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                    {actions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}