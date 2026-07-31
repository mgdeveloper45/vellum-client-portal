import Link from "next/link";

function getStatusDotClass(status: string) {
    switch (status) {
        case "CONFIRMED":
            return "bg-emerald-500";
        case "PENDING":
            return "bg-yellow-500";
        case "COMPLETED":
            return "bg-blue-500";
        case "CANCELLED":
            return "bg-red-500";
        default:
            return "workspace-accent-bg";
    }
}

type Booking = {
    id: string;
    customerName: string;
    date: Date;
    startTime: string;
    status: string;
    service: {
        name: string;
    };
};

type MonthlyBookingCalendarProps = {
    bookings: Booking[];
    selectedMonth: number;
    selectedYear: number;
};

export function MonthlyBookingCalendar({
    bookings,
    selectedMonth,
    selectedYear,
}: MonthlyBookingCalendarProps) {
    const today = new Date();

    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const previousYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

    const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;

    const startOffset = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const calendarCells = [
        ...Array.from({ length: startOffset }, () => null),
        ...Array.from({ length: totalDays }, (_, index) => {
            return new Date(selectedYear, selectedMonth, index + 1);
        }),
    ];

    function getBookingsForDate(date: Date) {
        return bookings.filter(
            (booking) =>
                booking.date.toDateString() === date.toDateString(),
        );
    }

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-light">
                        {firstDayOfMonth.toLocaleDateString(undefined, {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>

                    <p className="mt-1 text-sm text-foreground/60">
                        Monthly booking calendar
                    </p>
                </div>

                <Link
                    href={`/bookings?month=${previousMonth}&year=${previousYear}`}
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
                    href={`/bookings?month=${nextMonth}&year=${nextYear}`}
                    className="workspace-accent-button rounded-full px-4 py-2 text-sm font-medium"
                >
                    Next →
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-wide text-foreground/50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
                {calendarCells.map((date, index) => {
                    const dayBookings = date ? getBookingsForDate(date) : [];
                    const isToday =
                        date?.toDateString() === today.toDateString();

                    return (
                        <div
                            key={date?.toISOString() ?? `empty-${index}`}
                            className={
                                date
                                    ? "group min-h-40 rounded-3xl border border-border bg-background p-3 transition hover:border-foreground/20 hover:shadow-md"
                                    : "min-h-40 rounded-3xl border border-transparent"
                            }
                        >
                            {date && (
                                <>
                                    <div
                                        className={
                                            isToday
                                                ? "workspace-accent-bg inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow"
                                                : "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-foreground/70 transition group-hover:bg-muted"
                                        }
                                    >
                                        {date.getDate()}
                                    </div>
                                    {dayBookings.length > 0 && (
                                        <p className="mt-2 text-[11px] font-medium text-foreground/50">
                                            {dayBookings.length} appointment
                                            {dayBookings.length === 1 ? "" : "s"}
                                        </p>
                                    )}

                                    <div className="mt-3 space-y-2">
                                        {dayBookings.slice(0, 3).map((booking) => (
                                            <Link
                                                key={booking.id}
                                                href={`/bookings/${booking.id}`}
                                                className="group block rounded-xl border border-border bg-card px-2.5 py-2 text-left text-xs transition hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${getStatusDotClass(booking.status)}`} />

                                                    <span className="font-medium">
                                                        {booking.startTime}
                                                    </span>
                                                </div>

                                                <span className="mt-1 block truncate text-foreground/60 group-hover:text-foreground">
                                                    {booking.service.name}
                                                </span>

                                                <span className="mt-1 block truncate text-[11px] text-foreground/40">
                                                    {booking.customerName}
                                                </span>
                                            </Link>
                                        ))}

                                        {dayBookings.length > 3 && (
                                            <p className="text-xs text-foreground/50">
                                                View all 7 appointments →
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}