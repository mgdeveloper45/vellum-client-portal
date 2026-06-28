import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";


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
            status: {
                not: "CANCELLED",
            },
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

            <div className="mt-8">
                <BookingTimeline bookings={bookings} />
            </div>
        </BrandedDashboardShell>
    );
}