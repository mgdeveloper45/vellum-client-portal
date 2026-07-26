import type { CSSProperties } from "react";
import { TimeSelector } from "@/components/booking/time-selector";
import { BookingHeader } from "@/components/booking/booking-header";
import { ServiceSelector } from "@/components/booking/service-selector";
import { CalendarDateSelector } from "@/components/booking/calendar-date-selector";
import { getPublicBookingPageQuery } from "@/lib/queries/bookings/get-public-booking-page-query";
import { getAvailableSlotsService } from "@/lib/services/availability/composition/availability-service";

type PublicBookingPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    serviceId?: string;
    date?: string;
    time?: string;
  }>;
};

export default async function PublicBookingPage({
  params,
  searchParams,
}: PublicBookingPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const workspace = await getPublicBookingPageQuery(slug);

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

  let availableSlots: string[] = [];

  if (selectedService) {
    const availabilityResult = await getAvailableSlotsService({
      workspaceId: workspace.id,
      serviceId: selectedService.id,
      bookingDate: new Date(`${selectedDate}T00:00:00`),
      duration: selectedService.duration,
    });

    if (availabilityResult.success) {
      availableSlots = availabilityResult.availableSlots;
    }
  }

  const displayName =
    workspace.companyName || workspace.name || "Vellum";

  return (
    <main
      className="min-h-screen bg-background p-8 text-foreground"
      style={
        {
          "--workspace-accent":
            workspace.accentColor || "#8B5CF6",
        } as CSSProperties
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
              <CalendarDateSelector
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