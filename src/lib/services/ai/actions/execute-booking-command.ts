import { listServicesQuery } from "@/lib/queries/services/list-services-query";
import { prismaClientRepository } from "@/lib/services/clients/prisma-client-repository";
import { createBookingService } from "@/lib/services/booking/composition/booking-services";

import { resolveBookingCommand } from "./resolve-booking-command";

export type ExecuteBookingCommandResult =
  | {
      success: true;
      bookingId: string;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export async function executeBookingCommand(
  command: string,
  workspaceId: string,
): Promise<ExecuteBookingCommandResult> {
  const [services, clients] = await Promise.all([
    listServicesQuery(workspaceId),
    prismaClientRepository.findMany({
      workspaceId,
    }),
  ]);

  const activeServices = services
    .filter((service) => service.active)
    .map((service) => ({
      id: service.id,
      workspaceId: service.workspaceId,
      name: service.name,
      duration: service.duration,
      price: service.price,
    }));

  const resolution = resolveBookingCommand(command, activeServices, clients);

  if (resolution.missingFields.length > 0) {
    return {
      success: false,
      message: `I need more information before creating the booking: ${resolution.missingFields.join(
        ", ",
      )}.`,
    };
  }

  if (
    !resolution.service ||
    !resolution.client ||
    !resolution.date ||
    !resolution.startTime
  ) {
    return {
      success: false,
      message: "The booking command could not be resolved safely.",
    };
  }

  const result = await createBookingService.execute({
    workspaceId,
    serviceId: resolution.service.id,
    customerName:
      `${resolution.client.firstName} ${resolution.client.lastName}`.trim(),
    customerEmail: resolution.client.email,
    date: resolution.date,
    startTime: resolution.startTime,
  });

  if (!result.success || !result.bookingId) {
    return {
      success: false,
      message: result.reasons?.join(" ") ?? "The booking could not be created.",
    };
  }

  return {
    success: true,
    bookingId: result.bookingId,
    message: `Booking created for ${resolution.client.firstName} ${resolution.client.lastName} — ${resolution.service.name} on ${resolution.date} at ${resolution.startTime}.`,
  };
}
