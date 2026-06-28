import Link from "next/link";

type DashboardHeroProps = {
    firstName: string;
};

export function DashboardHero({
    firstName,
}: DashboardHeroProps) {
    return (
        <section className="rounded-3xl border border-border bg-card p-8">
            <p className="workspace-accent-text text-sm font-medium">
                Welcome back
            </p>

            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-4xl font-light tracking-tight">
                        Good day, {firstName}
                    </h1>

                    <p className="mt-3 max-w-2xl text-foreground/70">
                        Here&apos;s what&apos;s happening across your bookings, clients,
                        projects, invoices, and workspace activity.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/bookings"
                        className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium"
                    >
                        View Bookings
                    </Link>

                    <Link
                        href="/services"
                        className="workspace-accent-button-outline rounded-full px-5 py-3 text-sm font-medium"
                    >
                        Manage Services
                    </Link>
                </div>
            </div>
        </section>
    );
}