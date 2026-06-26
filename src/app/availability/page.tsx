import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots } from "@/lib/services/booking/availability-service";

const dayLabels = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};

export default async function AvailabilityPage() {
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

    const services = await prisma.service.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
            active: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const businessHours = await prisma.businessHour.findMany({
        where: {
            workspaceId: currentUser.workspaceId,
        },
        orderBy: {
            dayOfWeek: "asc",
        },
    });

    const firstService = services[0];

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Availability</h1>

            <p className="mt-2 text-foreground/70">
                Preview bookable time slots based on your services and business hours.
            </p>

            {!firstService ? (
                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                    <p>Create an active service first before generating availability.</p>
                </div>
            ) : (
                <div className="mt-8 grid gap-6">
                    <div className="rounded-2xl border border-border bg-card p-6">
                        <p className="text-sm text-foreground/60">Using service</p>

                        <h2 className="mt-2 text-2xl font-medium">{firstService.name}</h2>

                        <p className="mt-2 text-sm text-foreground/70">
                            {firstService.duration} minutes · $
                            {(firstService.price / 100).toFixed(2)}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {businessHours.map((hours) => {
                            const slots = hours.closed
                                ? []
                                : generateTimeSlots({
                                    openTime: hours.openTime,
                                    closeTime: hours.closeTime,
                                    duration: firstService.duration,
                                });

                            return (
                                <div
                                    key={hours.id}
                                    className="rounded-2xl border border-border bg-card p-6"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-medium">
                                                {dayLabels[hours.dayOfWeek]}
                                            </h3>

                                            <p className="mt-1 text-sm text-foreground/60">
                                                {hours.closed
                                                    ? "Closed"
                                                    : `${hours.openTime}–${hours.closeTime}`}
                                            </p>
                                        </div>

                                        <span className="workspace-accent-badge rounded-full px-3 py-1 text-sm">
                                            {slots.length} slots
                                        </span>
                                    </div>

                                    {slots.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {slots.map((slot) => (
                                                <span
                                                    key={slot}
                                                    className="rounded-full border border-border px-3 py-1 text-sm"
                                                >
                                                    {slot}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </BrandedDashboardShell>
    );
}