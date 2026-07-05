import type { ClientProfile } from "./client-types";

export function calculateLifetimeValue(client: ClientProfile) {
  return client.totalRevenue;
}

export function calculateAverageBookingValue(client: ClientProfile) {
  if (client.totalBookings === 0) {
    return 0;
  }

  return Math.round(client.totalRevenue / client.totalBookings);
}
