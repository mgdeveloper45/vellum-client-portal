import Link from "next/link";
import { updateBookingStatusAction } from "@/actions/booking-actions";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";

type BookingTimelineProps = {
    bookings: {
        id: string;
        customerName: string;
        startTime: string;
        endTime: string;
        status: string;
        date: Date;
        service: {
            name: string;
        };
    }[];
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

function getStatusClass(status: string) {
    if (status === "CANCELLED") {
        return "border-red-500/40 bg-red-500/10";
    }

    if (status === "COMPLETED") {
        return "border-blue-500/40 bg-blue-500/10";
    }

    if (status === "PENDING") {
        return "border-yellow-500/40 bg-yellow-500/10";
    }

    return "workspace-accent-border bg-background";
}

export function BookingTimeline({ bookings }: BookingTimelineProps) {
    const bookingsByDate = bookings.reduce<Record<string, typeof bookings>>(
        (groups, booking) => {
            const key = booking.date.toDateString();

            groups[key] = groups[key] ?? [];
            groups[key].push(booking);

            return groups;
        },
        {},
    );

    if (bookings.length === 0) {
        return (
            <ExecutiveEmptyState
                title="No bookings yet"
                description="Confirmed and pending appointments will appear here in your operational timeline."
                action={
                    <Link
                        href="/availability"
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                    >
                        Review Availability
                    </Link>
                }
                className="min-h-[320px]"
            />
        );
    }

    return (
        <div className="grid gap-6">
            {Object.entries(bookingsByDate).map(([date, dateBookings]) => (
                <div key={date}>
                    <h2 className="mb-3 text-xl font-medium">{date}</h2>

                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        {HOURS.map((hour) => {
                            const hourBookings = dateBookings.filter(
                                (booking) =>
                                    Number(booking.startTime.split(":")[0]) === hour,
                            );

                            return (
                                <div
                                    key={hour}
                                    className="grid grid-cols-[90px_1fr] border-b border-border last:border-b-0"
                                >
                                    <div className="border-r border-border p-4 text-sm text-foreground/60">
                                        {`${hour.toString().padStart(2, "0")}:00`}
                                    </div>

                                    <div className="min-h-[80px] p-3">
                                        {hourBookings.length === 0 ? (
                                            <div className="h-full rounded-lg border border-dashed border-border" />
                                        ) : (
                                            <div className="space-y-2">
                                                {hourBookings.map((booking) => (
                                                    <Link
                                                        key={booking.id}
                                                        href={`/bookings/${booking.id}`}
                                                        className={`block rounded-xl border p-3 transition hover:scale-[1.01] hover:shadow-sm ${getStatusClass(
                                                            booking.status,
                                                        )}`}
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <p className="font-medium">
                                                                {booking.customerName}
                                                            </p>

                                                            <p className="text-xs text-foreground/60">
                                                                {booking.startTime}–{booking.endTime}
                                                            </p>
                                                        </div>

                                                        <p className="mt-1 text-sm text-foreground/70">
                                                            {booking.service.name}
                                                        </p>

                                                        <p className="mt-2 text-xs uppercase tracking-wide text-foreground/50">
                                                            {booking.status}
                                                        </p>

                                                        <form
                                                            action={updateBookingStatusAction}
                                                            className="mt-3 flex gap-2"
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name="bookingId"
                                                                value={booking.id}
                                                            />

                                                            <select
                                                                name="status"
                                                                defaultValue={booking.status}
                                                                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs"
                                                            >
                                                                <option value="PENDING">Pending</option>
                                                                <option value="CONFIRMED">Confirmed</option>
                                                                <option value="COMPLETED">Completed</option>
                                                                <option value="CANCELLED">Cancelled</option>
                                                            </select>

                                                            <button className="workspace-accent-button rounded-lg px-3 py-2 text-xs font-medium">
                                                                Save
                                                            </button>
                                                        </form>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}