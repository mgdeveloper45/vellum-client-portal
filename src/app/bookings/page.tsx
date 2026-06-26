import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { prisma } from "@/lib/prisma";

export default async function BookingsPage() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

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

    const bookings = await prisma.booking.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
        },
        include: {
            service: true,
        },
        orderBy: [
            {
                date: "asc",
            },
            {
                startTime: "asc",
            },
        ],
    });

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Bookings</h1>

            <p className="mt-2 text-foreground/70">
                View scheduled appointments and client booking details.
            </p>

            <div className="mt-8 grid gap-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="rounded-2xl border border-border bg-card p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xl font-medium">{booking.customerName}</p>

                                <p className="mt-1 text-sm text-foreground/70">
                                    {booking.customerEmail}
                                </p>

                                {booking.customerPhone && (
                                    <p className="mt-1 text-sm text-foreground/70">
                                        {booking.customerPhone}
                                    </p>
                                )}

                                <p className="mt-4 text-sm text-foreground/60">
                                    {booking.service.name}
                                </p>

                                {booking.notes && (
                                    <p className="mt-3 text-sm text-foreground/70">
                                        {booking.notes}
                                    </p>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="workspace-accent-badge rounded-full px-3 py-1 text-sm">
                                    {booking.status}
                                </p>

                                <p className="mt-4 text-sm text-foreground/70">
                                    {booking.date.toLocaleDateString()}
                                </p>

                                <p className="mt-1 text-sm text-foreground/70">
                                    {booking.startTime}–{booking.endTime}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <p className="text-foreground/70">
                            No bookings yet.
                        </p>
                    </div>
                )}
            </div>
        </BrandedDashboardShell>
    );
}