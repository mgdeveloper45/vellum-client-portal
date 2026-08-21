import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoBookings } from "@/lib/demo/demo-data";

export default function DemoBookingsPage() {
    const confirmedBookings = demoBookings.filter(
        (booking) => booking.status === "CONFIRMED",
    ).length;

    const depositsNeeded = demoBookings.filter(
        (booking) =>
            booking.depositRequired && !booking.depositPaid,
    ).length;

    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Scheduling
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Bookings
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Manage upcoming client sessions, booking health,
                        preparation, and deposits.
                    </p>
                </div>

                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Upcoming
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {demoBookings.length}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Scheduled sessions
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Confirmed
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {confirmedBookings}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Ready on the calendar
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/50">
                            Deposits Needed
                        </p>

                        <p className="mt-4 text-3xl font-light">
                            {depositsNeeded}
                        </p>

                        <p className="mt-3 text-sm text-foreground/55">
                            Require follow-up
                        </p>
                    </div>
                </section>

                <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
                    <div className="border-b border-border px-6 py-5">
                        <h2 className="text-xl font-medium">
                            Upcoming Sessions
                        </h2>

                        <p className="mt-1 text-sm text-foreground/50">
                            Explore scheduling and booking workflows.
                        </p>
                    </div>

                    <div className="divide-y divide-border">
                        {demoBookings.map((booking) => {
                            const needsDeposit =
                                booking.depositRequired &&
                                !booking.depositPaid;

                            return (
                                <Link
                                    key={booking.id}
                                    href={`/demo/bookings/${booking.id}`}
                                    className="flex flex-col gap-5 px-6 py-6 transition hover:bg-muted/40 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="text-lg font-medium">
                                                {booking.serviceName}
                                            </p>

                                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                                {booking.status}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-foreground/55">
                                            {booking.customerName}
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/45">
                                            {booking.dateLabel} · {booking.timeLabel}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="text-left lg:text-right">
                                            <p className="text-xs text-foreground/45">
                                                Booking Health
                                            </p>

                                            <p className="mt-1 font-medium">
                                                {booking.healthScore}%
                                            </p>
                                        </div>

                                        {needsDeposit && (
                                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
                                                Deposit needed
                                            </span>
                                        )}

                                        <span className="text-sm font-medium workspace-accent-text">
                                            Review →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </DemoShell>
    );
}