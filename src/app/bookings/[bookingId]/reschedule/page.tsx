import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rescheduleBookingAction } from "@/actions/booking-actions";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import {
    generateTimeSlots,
    removeBookedSlots,
} from "@/lib/services/booking/availability-service";


export default async function RescheduleBookingPage({
    params,
    searchParams,
}: {
    params: Promise<{
        bookingId: string;
    }>;
    searchParams: Promise<{
        date?: string;
    }>;
}) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const { bookingId } = await params;
    const resolvedSearchParams = await searchParams;

    const selectedDate =
        resolvedSearchParams.date ?? new Date().toISOString().slice(0, 10);

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            workspaceId: true,
        },
    });

    if (!currentUser?.workspaceId) {
        return null;
    }

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            workspaceId: currentUser.workspaceId,
        },
        include: {
            service: true,
        },
    });

    if (!booking) {
        return (
            <BrandedDashboardShell>
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h1 className="text-2xl font-light">Booking not found</h1>

                    <Link href="/bookings" className="mt-4 inline-block workspace-accent-text">
                        Back to bookings
                    </Link>
                </div>
            </BrandedDashboardShell>
        );
    }

    const selectedDateObject = new Date(`${selectedDate}T00:00:00`);

    const dayMap = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
    } as const;

    const dayOfWeek = dayMap[
        selectedDateObject.getDay() as keyof typeof dayMap
    ];

    const businessHour = await prisma.businessHour.findUnique({
        where: {
            workspaceId_dayOfWeek: {
                workspaceId: currentUser.workspaceId,
                dayOfWeek,
            },
        },
    });

    const existingBookings = await prisma.booking.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
            serviceId: booking.serviceId,
            date: selectedDateObject,
            status: {
                not: "CANCELLED",
            },
            id: {
                not: booking.id,
            },
        },
    });

    const rawSlots =
        businessHour && !businessHour.closed
            ? generateTimeSlots({
                openTime: businessHour.openTime,
                closeTime: businessHour.closeTime,
                duration: booking.service.duration,
            })
            : [];

    const availableSlots = removeBookedSlots({
        slots: rawSlots,
        duration: booking.service.duration,
        bookings: existingBookings,
    });

    return (
        <BrandedDashboardShell>
            <Link href={`/bookings/${booking.id}`} className="workspace-accent-text text-sm">
                ← Back to booking
            </Link>

            <h1 className="mt-4 text-3xl font-light">Reschedule Booking</h1>

            <p className="mt-2 text-foreground/70">
                Choose a new date and time for this appointment.
            </p>

            <section className="mt-8 rounded-3xl border border-border bg-card p-6">
                <h2 className="text-2xl font-light">{booking.service.name}</h2>

                <p className="mt-2 text-foreground/70">
                    Current time: {booking.date.toLocaleDateString()} · {booking.startTime}–
                    {booking.endTime}
                </p>

                <form className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="date"
                        name="date"
                        defaultValue={selectedDate}
                        className="rounded-xl border border-border bg-background px-5 py-3"
                    />

                    <button className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium">
                        Check Availability
                    </button>
                </form>
            </section>

            <section className="mt-6 rounded-3xl border border-border bg-card p-6">
                <h2 className="text-2xl font-light">Available times</h2>

                {availableSlots.length === 0 ? (
                    <p className="mt-4 text-sm text-foreground/70">
                        No available times for this date.
                    </p>
                ) : (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {availableSlots.map((slot) => (
                            <form
                                key={slot}
                                action={rescheduleBookingAction}
                                className="rounded-2xl border border-border bg-background p-4"
                            >
                                <input type="hidden" name="bookingId" value={booking.id} />
                                <input type="hidden" name="date" value={selectedDate} />
                                <input type="hidden" name="startTime" value={slot} />

                                <p className="font-medium">{slot}</p>

                                <button className="workspace-accent-button mt-4 w-full rounded-full px-4 py-2 text-sm font-medium">
                                    Move to {slot}
                                </button>
                            </form>
                        ))}
                    </div>
                )}
            </section>
        </BrandedDashboardShell>
    );
}
