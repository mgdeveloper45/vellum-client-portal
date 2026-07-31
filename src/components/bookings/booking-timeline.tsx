import Link from "next/link";
import { updateBookingStatusAction } from "@/actions/booking-actions";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

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

const statusVariant = {
    CONFIRMED: "success",
    COMPLETED: "info",
    PENDING: "warning",
    CANCELLED: "danger",
} as const;

function formatStatus(status: string) {
    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatGroupLabel(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) {
        return "Today";
    }

    if (target.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
    }

    return target.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export function BookingTimeline({
    bookings,
}: BookingTimelineProps) {
    const bookingsByDate = bookings.reduce<
        Record<string, typeof bookings>
    >((groups, booking) => {
        const key = booking.date.toDateString();

        groups[key] ??= [];
        groups[key].push(booking);

        return groups;
    }, {});

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
        <div className="space-y-8">
            {Object.entries(bookingsByDate).map(
                ([date, dateBookings]) => (
                    <section key={date}>
                        <h2 className="mb-4 text-2xl font-light">
                            {formatGroupLabel(
                                new Date(date),
                            )}
                        </h2>

                        <div className="overflow-hidden rounded-3xl border border-border bg-card">
                            {HOURS.map((hour) => {
                                const hourBookings =
                                    dateBookings.filter(
                                        (booking) =>
                                            Number(
                                                booking.startTime.split(
                                                    ":",
                                                )[0],
                                            ) === hour,
                                    );

                                return (
                                    <div
                                        key={hour}
                                        className="grid grid-cols-[90px_1fr] border-b border-border last:border-b-0"
                                    >
                                        <div className="border-r border-border p-4 text-sm text-foreground/60">
                                            {`${hour
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0",
                                                )}:00`}
                                        </div>

                                        <div className="min-h-[90px] p-3">
                                            {hourBookings.length ===
                                                0 ? (
                                                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border/50 text-xs text-foreground/35">
                                                    Available
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {hourBookings.map(
                                                        (
                                                            booking,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    booking.id
                                                                }
                                                                className="rounded-2xl border border-border bg-background p-4"
                                                            >
                                                                <Link
                                                                    href={`/bookings/${booking.id}`}
                                                                    className="block transition hover:opacity-80"
                                                                >
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {
                                                                                    booking.customerName
                                                                                }
                                                                            </p>

                                                                            <p className="mt-1 text-sm text-foreground/60">
                                                                                {
                                                                                    booking.service.name
                                                                                }
                                                                            </p>

                                                                            <p className="mt-2 text-xs text-foreground/45">
                                                                                {
                                                                                    booking.startTime
                                                                                }
                                                                                {" – "}
                                                                                {
                                                                                    booking.endTime
                                                                                }
                                                                            </p>
                                                                        </div>

                                                                        <StatusBadge
                                                                            variant={
                                                                                statusVariant[
                                                                                booking.status as keyof typeof statusVariant
                                                                                ]
                                                                            }
                                                                        >
                                                                            {formatStatus(
                                                                                booking.status,
                                                                            )}
                                                                        </StatusBadge>
                                                                    </div>
                                                                </Link>

                                                                <form
                                                                    action={
                                                                        updateBookingStatusAction
                                                                    }
                                                                    className="mt-4 flex gap-2"
                                                                >
                                                                    <input
                                                                        type="hidden"
                                                                        name="bookingId"
                                                                        value={
                                                                            booking.id
                                                                        }
                                                                    />

                                                                    <select
                                                                        name="status"
                                                                        defaultValue={
                                                                            booking.status
                                                                        }
                                                                        className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                                                                    >
                                                                        <option value="PENDING">
                                                                            Pending
                                                                        </option>

                                                                        <option value="CONFIRMED">
                                                                            Confirmed
                                                                        </option>

                                                                        <option value="COMPLETED">
                                                                            Completed
                                                                        </option>

                                                                        <option value="CANCELLED">
                                                                            Cancelled
                                                                        </option>
                                                                    </select>

                                                                    <button
                                                                        type="submit"
                                                                        className="workspace-accent-button rounded-xl px-4 py-2 text-sm font-medium"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ),
            )}
        </div>
    );
}