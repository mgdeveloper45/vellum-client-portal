import type { BookableService } from "@/lib/services/booking/service-repository";

export interface BookingCommandClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ResolvedBookingCommand {
  service: BookableService | null;
  client: BookingCommandClient | null;
  date: string | null;
  startTime: string | null;
  missingFields: string[];
}

export function resolveBookingCommand(
  command: string,
  services: BookableService[],
  clients: BookingCommandClient[] = [],
): ResolvedBookingCommand {
  const normalizedCommand = command.toLowerCase();

  const matchingServices = services.filter((service) =>
    normalizedCommand.includes(service.name.toLowerCase()),
  );

  const service =
    matchingServices.length === 1
      ? matchingServices[0]
      : null;

  const matchingClients = clients.filter((client) => {
    const firstName = client.firstName.toLowerCase();
    const lastName = client.lastName.toLowerCase();
    const fullName =
      `${client.firstName} ${client.lastName}`.toLowerCase();

    return (
      normalizedCommand.includes(fullName) ||
      normalizedCommand.includes(firstName) ||
      normalizedCommand.includes(lastName)
    );
  });

  const client =
    matchingClients.length === 1
      ? matchingClients[0]
      : null;

  const date = resolveDate(normalizedCommand);
  const startTime = resolveTime(normalizedCommand);

  const missingFields: string[] = [];

  if (!service) {
    missingFields.push("service");
  }

  if (!client) {
    missingFields.push("client");
  }

  if (!date) {
    missingFields.push("date");
  }

  if (!startTime) {
    missingFields.push("time");
  }

  return {
    service,
    client,
    date,
    startTime,
    missingFields,
  };
}

function resolveDate(command: string): string | null {
  const explicitDate = command.match(
    /\b(\d{4})-(\d{2})-(\d{2})\b/,
  );

  if (explicitDate) {
    return explicitDate[0];
  }

  if (command.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return formatLocalDate(tomorrow);
  }

  return null;
}

function resolveTime(command: string): string | null {
  const twelveHourTime = command.match(
    /\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/i,
  );

  if (twelveHourTime) {
    let hours = Number(twelveHourTime[1]);
    const minutes = Number(twelveHourTime[2] ?? "0");
    const period = twelveHourTime[3].toLowerCase();

    if (period === "pm" && hours !== 12) {
      hours += 12;
    }

    if (period === "am" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(
      minutes,
    ).padStart(2, "0")}`;
  }

  const twentyFourHourTime = command.match(
    /\b([01]\d|2[0-3]):([0-5]\d)\b/,
  );

  if (twentyFourHourTime) {
    return twentyFourHourTime[0];
  }

  return null;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}