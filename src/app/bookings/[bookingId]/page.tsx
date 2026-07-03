import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildBookingEngine } from "@/lib/services/bookings/booking-engine";
import { BookingHeader } from "@/components/booking-command-center/booking-header";
import { BookingAICard } from "@/components/booking-command-center/booking-ai-card";
import { BookingTimeline } from "@/components/booking-command-center/booking-timeline";
import { BookingStatusCard } from "@/components/booking-command-center/booking-status-card";
import { BookingMissionCard } from "@/components/booking-command-center/booking-mission-card";
import { BookingCountdownCard } from "@/components/booking-command-center/booking-countdown-card";
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

                    <Link href="/bookings" className="mt-4 inline-block workspace-accent-text">
                        Back to bookings
                    </Link>
                </div>
            </BrandedDashboardShell>
        );
    }

    const relatedProjects = await prisma.project.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
            client: {
                email: booking.customerEmail,
            },
        },
        include: {
            invoices: true,
            messages: true,
            files: true,
        },
    });

    const hasProject = relatedProjects.length > 0;
    const invoices = relatedProjects.flatMap((project) => project.invoices);
    const messages = relatedProjects.flatMap((project) => project.messages);
    const files = relatedProjects.flatMap((project) => project.files);

    const hasInvoice = invoices.length > 0;
    const invoicePaid = invoices.some((invoice) => invoice.paid);
    const hasMessages = messages.length > 0;
    const hasFiles = files.length > 0;

    const bookingIntelligence = buildBookingEngine({
        bookingId: booking.id,
        customerName: booking.customerName,
        serviceName: booking.service.name,
        status: booking.status,
        bookingCreatedAt: booking.createdAt,
        bookingDate: booking.date,
        hasGoogleCalendarEvent: Boolean(booking.googleCalendarEventId),
        hasProject,
        hasInvoice,
        invoicePaid,
        hasMessages,
        hasFiles,
    });

    return (
        <BrandedDashboardShell>
            <Link href="/bookings" className="workspace-accent-text text-sm">
                ← Back to bookings
            </Link>

            <div className="mt-6">
                <BookingHeader
                    customerName={booking.customerName}
                    serviceName={booking.service.name}
                    date={booking.date.toLocaleDateString()}
                    time={`${booking.startTime}–${booking.endTime}`}
                    status={booking.status}
                />
            </div>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <BookingMissionCard mission={bookingIntelligence.mission} />
                <BookingCountdownCard countdown={bookingIntelligence.countdown} />
            </section>

            <div className="mt-8">
                <BookingAICard summary={bookingIntelligence.aiSummary} />
            </div>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
                <div className="grid gap-6">
                    <div className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-2xl font-light">Customer Details</h2>

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
                        </div>

                        {booking.notes && (
                            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
                                <p className="text-sm text-foreground/50">Notes</p>
                                <p className="mt-2 text-foreground/80">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    <BookingTimeline items={bookingIntelligence.timeline} />
                </div>

                <aside className="grid gap-6">
                    <BookingStatusCard
                        lifecycle={bookingIntelligence.lifecycle}
                        health={bookingIntelligence.health.score}
                        countdown={bookingIntelligence.countdown.label}
                        paymentStatus={invoicePaid ? "Paid" : "Pending"}
                        projectStatus={hasProject ? "Created" : "Not Created"}
                        calendarSynced={Boolean(booking.googleCalendarEventId)}
                    />

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-medium">Booking Health</h2>

                        <div className="mt-5 rounded-2xl border border-border bg-background p-5">
                            <p className="text-4xl font-light">
                                {bookingIntelligence.health.score}%
                            </p>

                            <p className="mt-2 text-sm uppercase tracking-wide text-foreground/50">
                                {bookingIntelligence.health.label.replace("_", " ")}
                            </p>
                        </div>

                        <div className="mt-5 space-y-2">
                            {bookingIntelligence.health.reasons.map((reason) => (
                                <p key={reason} className="text-sm text-foreground/70">
                                    • {reason}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                        <h2 className="text-xl font-medium">Recommended Actions</h2>

                        <div className="mt-5 grid gap-3">
                            {bookingIntelligence.actions.map((action) => (
                                <Link
                                    key={action.id}
                                    href={action.href}
                                    className="rounded-2xl border border-border bg-background p-4 transition hover:border-accent"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-medium">{action.title}</p>

                                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {action.priority}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-foreground/60">
                                        {action.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <a
                        href={`/bookings/${booking.id}/reschedule`}
                        className="workspace-accent-button inline-block rounded-full px-4 py-2 text-center text-sm font-medium"
                    >
                        Reschedule
                    </a>
                </aside>
            </section>
        </BrandedDashboardShell>
    );
}