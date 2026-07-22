import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rescheduleBookingAction } from "@/actions/booking-actions";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { getAvailableSlotsService } from "@/lib/services/availability/composition/availability-service";

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
        resolvedSearchParams.date ??
        new Date().toISOString().slice(0, 10);

    const workspaceId =
        await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
            session.user.id,
        );

    if (!workspaceId) {
        return null;
    }

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            workspaceId,
        },
        include: {
            service: true,
        },
    });

    if (!booking) {
        return (
            <BrandedDashboardShell>
                <ExecutiveEmptyState
                    title="Booking not found"
                    description="This booking does not exist or may have been removed from the workspace."
                    action={
                        <Link
                            href="/bookings"
                            className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
                        >
                            Back to Bookings
                        </Link>
                    }
                />
            </BrandedDashboardShell>
        );
    }

    const availabilityResult =
        await getAvailableSlotsService({
            workspaceId,
            serviceId: booking.serviceId,
            bookingDate: new Date(`${selectedDate}T00:00:00`),
            duration: booking.service.duration,
            excludeBookingId: booking.id,
        });

    const availableSlots = availabilityResult.success
        ? availabilityResult.availableSlots
        : [];

    return (
        <BrandedDashboardShell>
            <Link
                href={`/bookings/${booking.id}`}
                className="workspace-accent-text text-sm"
            >
                ← Back to booking
            </Link>

            <h1 className="mt-4 text-3xl font-light">
                Reschedule Booking
            </h1>

            <p className="mt-2 text-foreground/70">
                Choose a new date and time for this appointment.
            </p>

            <section className="mt-8 rounded-3xl border border-border bg-card p-6">
                <h2 className="text-2xl font-light">
                    {booking.service.name}
                </h2>

                <p className="mt-2 text-foreground/70">
                    Current time: {booking.date.toLocaleDateString()} ·{" "}
                    {booking.startTime}–{booking.endTime}
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
                <h2 className="text-2xl font-light">
                    Available times
                </h2>

                {availableSlots.length === 0 ? (
                    <ExecutiveEmptyState
                        title="No times available"
                        description="There are no open appointment times for this date. Choose another date to continue rescheduling."
                        className="mt-5 min-h-[240px]"
                    />
                ) : (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {availableSlots.map((slot) => (
                            <form
                                key={slot}
                                action={rescheduleBookingAction}
                                className="rounded-2xl border border-border bg-background p-4"
                            >
                                <input
                                    type="hidden"
                                    name="bookingId"
                                    value={booking.id}
                                />

                                <input
                                    type="hidden"
                                    name="date"
                                    value={selectedDate}
                                />

                                <input
                                    type="hidden"
                                    name="startTime"
                                    value={slot}
                                />

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