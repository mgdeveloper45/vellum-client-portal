import { auth } from "@/auth";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { MonthlyBookingCalendar } from "@/components/bookings/monthly-booking-calendar";
import { WeeklyBookingCalendar } from "@/components/bookings/weekly-booking-calendar";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { listBookingsQuery } from "@/lib/queries/bookings/list-bookings-query";
import { getCurrentUserWorkspaceQuery } from "@/lib/queries/users/get-current-user-workspace-query";

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{
        month?: string;
        year?: string;
        weekStart?: string;
        status?: string;
    }>;
}) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const workspaceId = await getCurrentUserWorkspaceQuery(
        session.user.id,
    );

    if (!workspaceId) {
        return null;
    }

    const resolvedSearchParams = await searchParams;

    const today = new Date();

    const selectedWeekStart = resolvedSearchParams.weekStart
        ? new Date(`${resolvedSearchParams.weekStart}T00:00:00`)
        : null;

    const selectedStatus =
        resolvedSearchParams.status ?? "ALL";

    const selectedMonth =
        resolvedSearchParams.month !== undefined
            ? Number(resolvedSearchParams.month)
            : today.getMonth();

    const selectedYear =
        resolvedSearchParams.year !== undefined
            ? Number(resolvedSearchParams.year)
            : today.getFullYear();

    const monthStart = new Date(
        selectedYear,
        selectedMonth,
        1,
    );

    const monthEnd = new Date(
        selectedYear,
        selectedMonth + 1,
        1,
    );

    const bookings = await listBookingsQuery({
        workspaceId,
        monthStart,
        monthEnd,
        status: selectedStatus,
    });

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">
                Bookings
            </h1>

            <p className="mt-2 text-foreground/70">
                View scheduled appointments and client booking
                details.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
                {[
                    "ALL",
                    "CONFIRMED",
                    "PENDING",
                    "COMPLETED",
                    "CANCELLED",
                ].map((status) => (
                    <a
                        key={status}
                        href={
                            status === "ALL"
                                ? "/bookings"
                                : `/bookings?status=${status}`
                        }
                        className={
                            selectedStatus === status
                                ? "workspace-accent-button rounded-full px-4 py-2 text-sm font-medium"
                                : "rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
                        }
                    >
                        {status === "ALL"
                            ? "All"
                            : status
                                .toLowerCase()
                                .replace("_", " ")
                                .replace(
                                    /\b\w/g,
                                    (char) => char.toUpperCase(),
                                )}
                    </a>
                ))}
            </div>

            <div className="mt-8 grid gap-8">
                <WeeklyBookingCalendar
                    bookings={bookings}
                    selectedWeekStart={selectedWeekStart}
                />

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