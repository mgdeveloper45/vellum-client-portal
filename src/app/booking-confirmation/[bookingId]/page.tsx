import type { CSSProperties } from "react";
import Link from "next/link";
import { getBookingConfirmationQuery } from "@/lib/queries/bookings/get-booking-confirmation-query";

export default async function BookingConfirmationPage({
    params,
}: {
    params: Promise<{
        bookingId: string;
    }>;
}) {
    const { bookingId } = await params;

    const booking = await getBookingConfirmationQuery(bookingId);

    if (!booking) {
        return (
            <main className="min-h-screen bg-background p-8 text-foreground">
                Booking not found.
            </main>
        );
    }

    const displayName =
        booking.workspace.companyName || booking.workspace.name || "Vellum";

    return (
        <main
            className="min-h-screen bg-background p-8 text-foreground"
            style={
                {
                    "--workspace-accent":
                        booking.workspace.accentColor || "#8B5CF6",
                } as CSSProperties
            }
        >
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8">
                <p className="workspace-accent-text text-sm uppercase tracking-[0.35em]">
                    {displayName}
                </p>

                <h1 className="mt-4 text-4xl font-light">
                    Booking confirmed
                </h1>

                <p className="mt-3 text-foreground/70">
                    Thanks, {booking.customerName}. Your appointment has been scheduled.
                </p>

                <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-background p-6">
                    <div>
                        <p className="text-sm text-foreground/60">Service</p>
                        <p className="font-medium">{booking.service.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-foreground/60">Date</p>
                        <p className="font-medium">
                            {booking.date.toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-foreground/60">Time</p>
                        <p className="font-medium">
                            {booking.startTime}–{booking.endTime}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-foreground/60">Email</p>
                        <p className="font-medium">{booking.customerEmail}</p>
                    </div>
                </div>

                <Link
                    href={`/book/${booking.workspaceId}`}
                    className="workspace-accent-button mt-6 inline-block rounded-full px-5 py-2 text-sm font-medium"
                >
                    Book another appointment
                </Link>
            </div>
        </main>
    );
}