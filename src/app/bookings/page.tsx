import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { MonthlyBookingCalendar } from "@/components/bookings/monthly-booking-calendar";


export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{
        month?: string;
        year?: string;
    }>;
}) {
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

    const resolvedSearchParams = await searchParams;

    const today = new Date();

    const selectedMonth =
        resolvedSearchParams.month !== undefined
            ? Number(resolvedSearchParams.month)
            : today.getMonth();

    const selectedYear =
        resolvedSearchParams.year !== undefined
            ? Number(resolvedSearchParams.year)
            : today.getFullYear();

    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 1);

    const bookings = await prisma.booking.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
            status: {
                not: "CANCELLED",
            },
            date: {
                gte: monthStart,
                lt: monthEnd,
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

            <div className="mt-8 grid gap-8">
                <MonthlyBookingCalendar
                    bookings={bookings}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />

                <BookingTimeline bookings={bookings} />
            </div>
        </BrandedDashboardShell>
    );
}