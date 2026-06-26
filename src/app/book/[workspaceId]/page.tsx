import { createBookingAction } from "@/actions/booking-actions";
import { prisma } from "@/lib/prisma";
import {
    generateTimeSlots,
    removeBookedSlots,
} from "@/lib/services/booking/availability-service";

const dayMap = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
} as const;

export default async function PublicBookingPage({
    params,
    searchParams,
}: {
    params: Promise<{
        workspaceId: string;
    }>;
    searchParams: Promise<{
        serviceId?: string;
        date?: string;
    }>;
}) {
    const { workspaceId } = await params;
    const resolvedSearchParams = await searchParams;

    const workspace = await prisma.workspace.findUnique({
        where: {
            id: workspaceId,
        },
        include: {
            services: {
                where: {
                    active: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!workspace) {
        return (
            <main className="min-h-screen bg-background p-8 text-foreground">
                Workspace not found.
            </main>
        );
    }

    const selectedService =
        workspace.services.find(
            (service) => service.id === resolvedSearchParams.serviceId,
        ) ?? workspace.services[0];

    const selectedDate =
        resolvedSearchParams.date ?? new Date().toISOString().slice(0, 10);

    const dayIndex = new Date(`${selectedDate}T00:00:00`).getDay() as keyof typeof dayMap;
    const dayOfWeek = dayMap[dayIndex];

    const businessHour = await prisma.businessHour.findUnique({
        where: {
            workspaceId_dayOfWeek: {
                workspaceId,
                dayOfWeek,
            },
        },
    });

    const bookings = selectedService
        ? await prisma.booking.findMany({
            where: {
                workspaceId,
                serviceId: selectedService.id,
                date: new Date(`${selectedDate}T00:00:00`),
                status: {
                    not: "CANCELLED",
                },
            },
        })
        : [];

    const rawSlots =
        selectedService && businessHour && !businessHour.closed
            ? generateTimeSlots({
                openTime: businessHour.openTime,
                closeTime: businessHour.closeTime,
                duration: selectedService.duration,
            })
            : [];

    const availableSlots = selectedService
        ? removeBookedSlots({
            slots: rawSlots,
            duration: selectedService.duration,
            bookings,
        })
        : [];

    const displayName = workspace.companyName || workspace.name || "Vellum";

    return (
        <main
            className="min-h-screen bg-background p-8 text-foreground"
            style={
                {
                    "--workspace-accent": workspace.accentColor || "#8B5CF6",
                } as React.CSSProperties
            }
        >
            <div className="mx-auto max-w-3xl">
                <p className="workspace-accent-text text-sm uppercase tracking-[0.35em]">
                    {displayName}
                </p>

                <h1 className="mt-4 text-4xl font-light">Book an appointment</h1>

                <p className="mt-3 text-foreground/70">
                    Choose a service, date, and available time.
                </p>

                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-xl font-medium">Choose Service</h2>

                    <div className="mt-4 grid gap-3">
                        {workspace.services.map((service) => (
                            <a
                                key={service.id}
                                href={`/book/${workspaceId}?serviceId=${service.id}&date=${selectedDate}`}
                                className={
                                    selectedService?.id === service.id
                                        ? "workspace-accent-border rounded-xl border bg-background p-4"
                                        : "rounded-xl border border-border bg-background p-4"
                                }
                            >
                                <p className="font-medium">{service.name}</p>

                                <p className="mt-1 text-sm text-foreground/70">
                                    {service.duration} minutes · ${(service.price / 100).toFixed(2)}
                                </p>

                                {service.description && (
                                    <p className="mt-2 text-sm text-foreground/60">
                                        {service.description}
                                    </p>
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {selectedService && (
                    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                        <h2 className="text-xl font-medium">Choose Date</h2>

                        <form className="mt-4">
                            <input type="hidden" name="serviceId" value={selectedService.id} />

                            <input
                                name="date"
                                type="date"
                                defaultValue={selectedDate}
                                className="rounded-lg border border-border bg-background px-4 py-3"
                            />

                            <button className="workspace-accent-button ml-3 rounded-full px-5 py-2 text-sm font-medium">
                                Update Date
                            </button>
                        </form>
                    </div>
                )}

                {selectedService && (
                    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                        <h2 className="text-xl font-medium">Choose Time</h2>

                        {availableSlots.length === 0 ? (
                            <p className="mt-4 text-sm text-foreground/70">
                                No available times for this date.
                            </p>
                        ) : (
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {availableSlots.map((slot) => (
                                    <form key={slot} action={createBookingAction}>
                                        <input type="hidden" name="workspaceId" value={workspaceId} />
                                        <input
                                            type="hidden"
                                            name="serviceId"
                                            value={selectedService.id}
                                        />
                                        <input type="hidden" name="date" value={selectedDate} />
                                        <input type="hidden" name="startTime" value={slot} />

                                        <input
                                            name="customerName"
                                            required
                                            placeholder="Your name"
                                            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                        />

                                        <input
                                            name="customerEmail"
                                            required
                                            type="email"
                                            placeholder="Email"
                                            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                                        />

                                        <button className="workspace-accent-button w-full rounded-full px-4 py-2 text-sm font-medium">
                                            Book {slot}
                                        </button>
                                    </form>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}