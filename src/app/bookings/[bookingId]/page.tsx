import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

export default async function BookingDetailsPage({
    params,
}: {
    params: Promise<{
        bookingId: string;
    }>;
}) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const { bookingId } = await params;

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
            workspace: true,
        },
    });

    if (!booking) {
        return (
            <BrandedDashboardShell>
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h1 className="text-2xl font-light">Booking not found</h1>

                    <Link
                        href="/bookings"
                        className="mt-4 inline-block workspace-accent-text"
                    >
                        Back to bookings
                    </Link>
                </div>
            </BrandedDashboardShell>
        );
    }

    return (
        <BrandedDashboardShell>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <Link href="/bookings" className="workspace-accent-text text-sm">
                        ← Back to bookings
                    </Link>

                    <h1 className="mt-4 text-3xl font-light">Booking Details</h1>

                    <p className="mt-2 text-foreground/70">
                        Manage appointment details, customer information, and booking status.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="rounded-full border border-border bg-card px-4 py-2 text-sm uppercase tracking-wide">
                        {booking.status}
                    </div>

                    <a
                        href={`/bookings/${booking.id}/reschedule`}
                        className="workspace-accent-bg rounded-xl px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        Reschedule
                    </a>
                </div>
            </div>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
                <div className="rounded-3xl border border-border bg-card p-6">
                    <h2 className="text-2xl font-light">{booking.service.name}</h2>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-foreground/50">Customer</p>
                            <p className="mt-1 font-medium">{booking.customerName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-foreground/50">Email</p>
                            <p className="mt-1 font-medium">{booking.customerEmail}</p>
                        </div>

                        <div>
                            <p className="text-sm text-foreground/50">Phone</p>
                            <p className="mt-1 font-medium">
                                {booking.customerPhone || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-foreground/50">Workspace</p>
                            <p className="mt-1 font-medium">
                                {booking.workspace.companyName || booking.workspace.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-foreground/50">Date</p>
                            <p className="mt-1 font-medium">
                                {booking.date.toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-foreground/50">Time</p>
                            <p className="mt-1 font-medium">
                                {booking.startTime}–{booking.endTime}
                            </p>
                        </div>
                    </div>

                    {booking.notes && (
                        <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                            <p className="text-sm text-foreground/50">Notes</p>
                            <p className="mt-2 text-foreground/80">{booking.notes}</p>
                        </div>
                    )}
                </div>

                <aside className="rounded-3xl border border-border bg-card p-6">
                    <h2 className="text-xl font-medium">Calendar</h2>

                    <p className="mt-2 text-sm text-foreground/70">
                        Google Calendar event status.
                    </p>

                    <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                        <p className="text-sm text-foreground/50">Event ID</p>

                        <p className="mt-2 break-all text-sm">
                            {booking.googleCalendarEventId || "No linked calendar event"}
                        </p>
                    </div>
                </aside>
            </section>
        </BrandedDashboardShell>
    );
}