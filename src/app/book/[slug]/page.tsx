import { prisma } from "@/lib/prisma";
import { DateSelector } from "@/components/booking/date-selector";
import { TimeSelector } from "@/components/booking/time-selector";
import { BookingHeader } from "@/components/booking/booking-header";
import { ServiceSelector } from "@/components/booking/service-selector";
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
    slug: string;
  }>;
  searchParams: Promise<{
    serviceId?: string;
    date?: string;
    time?: string;
  }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const workspace = await prisma.workspace.findUnique({
    where: {
      slug,
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

  const selectedTime = resolvedSearchParams.time;

  const dayIndex = new Date(
    `${selectedDate}T00:00:00`,
  ).getDay() as keyof typeof dayMap;

  const dayOfWeek = dayMap[dayIndex];

  const businessHour = await prisma.businessHour.findUnique({
    where: {
      workspaceId_dayOfWeek: {
        workspaceId: workspace.id,
        dayOfWeek,
      },
    },
  });

  const bookings = selectedService
    ? await prisma.booking.findMany({
        where: {
          workspaceId: workspace.id,
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
      <div className="mx-auto grid max-w-6xl gap-6">
        <BookingHeader
          companyName={displayName}
          accentColor={workspace.accentColor}
        />

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-6">
            <ServiceSelector
              slug={slug}
              selectedDate={selectedDate}
              selectedServiceId={selectedService?.id}
              services={workspace.services}
            />
          </div>

          <div className="space-y-6">
            {selectedService && (
              <DateSelector
                slug={slug}
                serviceId={selectedService.id}
                selectedDate={selectedDate}
              />
            )}

            {selectedService && (
              <TimeSelector
                slug={slug}
                workspaceId={workspace.id}
                serviceId={selectedService.id}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={availableSlots}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}