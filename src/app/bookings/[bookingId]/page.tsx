import Link from "next/link";

import { auth } from "@/auth";
import { BookingAICard } from "@/components/booking-command-center/booking-ai-card";
import { BookingActionsCard } from "@/components/booking-command-center/booking-actions-card";
import { BookingCommandCenter } from "@/components/booking-command-center/booking-command-center";
import { BookingCountdownCard } from "@/components/booking-command-center/booking-countdown-card";
import { BookingHeader } from "@/components/booking-command-center/booking-header";
import { BookingHealthCard } from "@/components/booking-command-center/booking-health-card";
import { BookingMissionCard } from "@/components/booking-command-center/booking-mission-card";
import { BookingStatusCard } from "@/components/booking-command-center/booking-status-card";
import { BookingTimeline } from "@/components/booking-command-center/booking-timeline";
import { CustomerOverviewCard } from "@/components/booking-command-center/customer-overview-card";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";
import { getBookingCommandCenter } from "@/lib/services/bookings/booking-command-center";

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

    const workspaceId =
        await getCurrentUserWorkspaceQuery(session.user.id);

    if (!workspaceId) {
        return null;
    }

    const bookingData = await getBookingCommandCenter({
        bookingId,
        workspaceId,
    });

    if (!bookingData) {
        return (
            <BrandedDashboardShell>
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h1 className="text-2xl font-light">
                        Booking not found
                    </h1>

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

    const {
        booking,
        intelligence: bookingIntelligence,
        flags,
    } = bookingData;

    return (
        <BrandedDashboardShell>
            <BookingCommandCenter>
                <Link
                    href="/bookings"
                    className="workspace-accent-text text-sm"
                >
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
                    <BookingMissionCard
                        mission={bookingIntelligence.mission}
                    />

                    <BookingCountdownCard
                        countdown={bookingIntelligence.countdown}
                    />
                </section>

                <div className="mt-8">
                    <BookingAICard
                        summary={bookingIntelligence.aiSummary}
                    />
                </div>

                <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
                    <div className="grid gap-6">
                        <CustomerOverviewCard
                            customerName={booking.customerName}
                            customerEmail={booking.customerEmail}
                            customerPhone={booking.customerPhone}
                            workspaceName={
                                booking.workspace.companyName ??
                                booking.workspace.name
                            }
                            notes={booking.notes}
                        />

                        <BookingTimeline
                            items={bookingIntelligence.timeline}
                        />
                    </div>

                    <aside className="grid gap-6">
                        <BookingStatusCard
                            lifecycle={bookingIntelligence.lifecycle}
                            health={bookingIntelligence.health.score}
                            countdown={
                                bookingIntelligence.countdown.label
                            }
                            invoiceStatus={
                                !flags.hasInvoice
                                    ? "Not Created"
                                    : flags.invoicePaid
                                        ? "Paid"
                                        : "Outstanding"
                            }
                            depositStatus={
                                !flags.hasDeposit
                                    ? "Not Requested"
                                    : flags.depositPaid
                                        ? "Paid"
                                        : "Outstanding"
                            }
                            projectStatus={
                                flags.hasProject
                                    ? "Created"
                                    : "Not Created"
                            }
                            calendarSynced={flags.calendarSynced}
                        />

                        <BookingHealthCard
                            health={bookingIntelligence.health}
                        />

                        <BookingActionsCard
                            actions={bookingIntelligence.actions}
                        />

                        <a
                            href={`/bookings/${booking.id}/reschedule`}
                            className="workspace-accent-button inline-block rounded-full px-4 py-2 text-center text-sm font-medium"
                        >
                            Reschedule
                        </a>
                    </aside>
                </section>
            </BookingCommandCenter>
        </BrandedDashboardShell>
    );
}