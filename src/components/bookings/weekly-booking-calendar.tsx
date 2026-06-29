import Link from "next/link";

type Booking = {
    id: string;
    customerName: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: string;
    service: {
        name: string;
    };
};

type WeeklyBookingCalendarProps = {
    bookings: Booking[];
    selectedWeekStart: Date | null;
};

const HOURS = Array.from({ length: 11 }, (_, index) => index + 8);

function getStartOfWeek(date: Date) {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);

    return start;
}

function formatHour(hour: number) {
    const suffix = hour >= 12 ? "PM" : "AM";
    const value = hour % 12 === 0 ? 12 : hour % 12;

    return `${value} ${suffix}`;
}

function getBookingsForSlot(bookings: Booking[], date: Date, hour: number) {
    return bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);

        return (
            bookingDate.toDateString() === date.toDateString() &&
            Number(booking.startTime.slice(0, 2)) === hour
        );
    });
}

export function WeeklyBookingCalendar({
    bookings,
    selectedWeekStart,
}: WeeklyBookingCalendarProps) {
    const today = new Date();
    const startOfWeek = selectedWeekStart ?? getStartOfWeek(today);

    const previousWeek = new Date(startOfWeek);
    previousWeek.setDate(startOfWeek.getDate() - 7);

    const nextWeek = new Date(startOfWeek);
    nextWeek.setDate(startOfWeek.getDate() + 7);

    function formatDateParam(date: Date) {
        return date.toISOString().slice(0, 10);
    }

    const weekDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);

        return date;
    });

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-light">Weekly Schedule</h2>

                    <p className="mt-1 text-sm text-foreground/60">
                        Your appointments this week.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/bookings?weekStart=${formatDateParam(previousWeek)}`}
                        className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
                    >
                        ← Previous
                    </Link>

                    <Link
                        href="/bookings"
                        className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                        Today
                    </Link>

                    <Link
                        href={`/bookings?weekStart=${formatDateParam(nextWeek)}`}
                        className="workspace-accent-button rounded-full px-4 py-2 text-sm font-medium"
                    >
                        Next →
                    </Link>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border pb-3">
                        <div />

                        {weekDays.map((date) => {
                            const isToday = date.toDateString() === today.toDateString();

                            return (
                                <div key={date.toISOString()} className="px-2 text-center">
                                    <p className="text-xs uppercase tracking-wide text-foreground/50">
                                        {date.toLocaleDateString(undefined, { weekday: "short" })}
                                    </p>

                                    <div
                                        className={
                                            isToday
                                                ? "workspace-accent-bg mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow"
                                                : "mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-full text-sm text-foreground/70"
                                        }
                                    >
                                        {date.getDate()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div>
                        {HOURS.map((hour) => (
                            <div
                                key={hour}
                                className="grid min-h-28 grid-cols-[80px_repeat(7,1fr)] border-b border-border last:border-b-0"
                            >
                                <div className="border-r border-border pr-3 pt-4 text-right text-xs text-foreground/50">
                                    {formatHour(hour)}
                                </div>

                                {weekDays.map((date) => {
                                    const slotBookings = getBookingsForSlot(bookings, date, hour);

                                    return (
                                        <div
                                            key={`${date.toISOString()}-${hour}`}
                                            className="border-r border-border p-2 last:border-r-0"
                                        >
                                            {slotBookings.map((booking) => (
                                                <Link
                                                    key={booking.id}
                                                    href={`/bookings/${booking.id}`}
                                                    className="mb-2 block rounded-xl border border-border bg-background p-3 text-xs transition hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-sm"
                                                >
                                                    <p className="font-medium">{booking.service.name}</p>

                                                    <p className="mt-1 truncate text-foreground/60">
                                                        {booking.customerName}
                                                    </p>

                                                    <p className="mt-2 text-[11px] text-foreground/40">
                                                        {booking.startTime}–{booking.endTime}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}