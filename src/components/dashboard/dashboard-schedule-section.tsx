import Link from "next/link";

type Booking = {
    id: string;
    customerName: string;
    date: Date;
    startTime: string;
    service: {
        name: string;
    };
};

type Props = {
    todaysBookings: Booking[];
    upcomingBookings: Booking[];
};

export function DashboardScheduleSection({
    todaysBookings,
    upcomingBookings,
}: Props) {
    return (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-light">
                            Today’s Schedule
                        </h2>

                        <p className="mt-1 text-sm text-foreground/60">
                            Your upcoming appointments for today.
                        </p>
                    </div>

                    <Link
                        href="/bookings"
                        className="text-sm workspace-accent-text"
                    >
                        View all
                    </Link>
                </div>

                <div className="mt-6 grid gap-3">
                    {todaysBookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
                            No bookings scheduled for today.
                        </div>
                    ) : (
                        todaysBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-2xl border border-border bg-background p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium">
                                            {booking.customerName}
                                        </p>

                                        <p className="mt-1 text-sm text-foreground/60">
                                            {booking.service.name}
                                        </p>
                                    </div>

                                    <p className="workspace-accent-badge rounded-full px-3 py-1 text-sm">
                                        {booking.startTime}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-2xl font-light">
                    Upcoming
                </h2>

                <p className="mt-1 text-sm text-foreground/60">
                    Next scheduled appointments.
                </p>

                <div className="mt-6 grid gap-3">
                    {upcomingBookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-foreground/60">
                            No upcoming bookings yet.
                        </div>
                    ) : (
                        upcomingBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="rounded-2xl border border-border bg-background p-4"
                            >
                                <p className="font-medium">
                                    {booking.customerName}
                                </p>

                                <p className="mt-1 text-sm text-foreground/60">
                                    {booking.service.name}
                                </p>

                                <p className="mt-2 text-xs text-foreground/50">
                                    {booking.date.toLocaleDateString()} ·{" "}
                                    {booking.startTime}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}