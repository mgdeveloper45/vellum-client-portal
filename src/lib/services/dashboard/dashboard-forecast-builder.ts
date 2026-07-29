import type { DashboardQueryResult } from "@/lib/queries/dashboard/get-dashboard-query";
import {
  buildWorkspaceCapacity,
  type WorkspaceCapacity,
} from "@/lib/services/intelligence/capacity/workspace-capacity-engine";
import {
  buildBookingForecast,
  type BookingForecast,
} from "@/lib/services/intelligence/forecasting/booking-forecast-engine";
import {
  buildRevenueForecast,
  type RevenueForecast,
} from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";

const dayOfWeekNames = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

type DashboardForecastBuilderInput = {
  data: DashboardQueryResult;
};

export type DashboardForecastResult = {
  revenueCollected: number;
  revenueOutstanding: number;
  previousPeriodRevenue: number;
  upcomingBookingRevenue: number;
  averageServiceDuration: number;
  averageServicePrice: number;
  workspaceCapacity: WorkspaceCapacity;
  bookingForecast: BookingForecast;
  revenueForecast: RevenueForecast;
};

function parseTimeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 0;
  }

  return hours * 60 + minutes;
}

function calculateAverageServiceDuration(
  services: DashboardQueryResult["activeServices"],
): number {
  if (services.length === 0) {
    return 60;
  }

  const totalDuration = services.reduce(
    (total, service) => total + service.duration,
    0,
  );

  return Math.max(1, Math.round(totalDuration / services.length));
}

function calculateAverageServicePrice(
  services: DashboardQueryResult["activeServices"],
): number {
  if (services.length === 0) {
    return 0;
  }

  const totalPrice = services.reduce(
    (total, service) => total + service.price,
    0,
  );

  return Math.round(totalPrice / services.length);
}

function buildCapacityDays({
  data,
  averageServiceDuration,
  averageServicePrice,
}: {
  data: DashboardQueryResult;
  averageServiceDuration: number;
  averageServicePrice: number;
}) {
  return data.nextSevenDays.map((day, index) => {
    const dayName = dayOfWeekNames[day.date.getDay()];

    const businessHour = data.businessHours.find(
      (hours) => hours.dayOfWeek === dayName,
    );

    const openMinutes =
      !businessHour || businessHour.closed
        ? 0
        : Math.max(
            0,
            parseTimeToMinutes(businessHour.closeTime) -
              parseTimeToMinutes(businessHour.openTime),
          );

    const capacity =
      openMinutes === 0
        ? 0
        : Math.floor(openMinutes / averageServiceDuration);

    return {
      label: day.label,
      capacity,
      bookings: data.bookingTrendCounts[index] ?? 0,
      averageBookingValue: averageServicePrice,
    };
  });
}

export function buildDashboardForecasts({
  data,
}: DashboardForecastBuilderInput): DashboardForecastResult {
  const revenueCollected = data.totalRevenue._sum.amount ?? 0;

  const revenueOutstanding =
    data.outstandingRevenue._sum.amount ?? 0;

  const previousPeriodRevenue =
    data.previousPeriodRevenue._sum.amount ?? 0;

  const upcomingBookingRevenue =
    data.upcomingBookingsForForecast.reduce(
      (total, booking) => total + booking.service.price,
      0,
    );

  const averageServiceDuration =
    calculateAverageServiceDuration(data.activeServices);

  const averageServicePrice =
    calculateAverageServicePrice(data.activeServices);

  const capacityDays = buildCapacityDays({
    data,
    averageServiceDuration,
    averageServicePrice,
  });

  const todayLabel =
    data.nextSevenDays[0]?.label ?? "Today";

  const tomorrowLabel =
    data.nextSevenDays[1]?.label ?? "Tomorrow";

  const workspaceCapacity = buildWorkspaceCapacity({
    todayLabel,
    tomorrowLabel,
    days: capacityDays,
  });

  const bookingForecast = buildBookingForecast({
    todaysBookings: workspaceCapacity.today.bookings,
    todayCapacity: workspaceCapacity.today.capacity,
    tomorrowsBookings:
      workspaceCapacity.tomorrow.bookings,
    tomorrowCapacity:
      workspaceCapacity.tomorrow.capacity,

    nextSevenDays: workspaceCapacity.days.map((day) => ({
      label: day.label,
      bookings: day.bookings,
      capacity: day.capacity,
    })),
    previousSevenDaysBookings:
      data.previousSevenDaysBookings,
    cancellationsLastThirtyDays:
      data.cancellationsLastThirtyDays,
    totalBookingsLastThirtyDays:
      data.totalBookingsLastThirtyDays,
  });

  const revenueForecast = buildRevenueForecast({
    revenueCollected,
    outstandingRevenue: revenueOutstanding,
    // Invoice currently has no dueDate, so outstanding
    // revenue cannot yet be classified reliably as overdue.
    overdueRevenue: 0,
    paidInvoices: data.paidInvoices,
    totalInvoices: data.totalInvoices,
    upcomingBookingRevenue,
    previousPeriodRevenue,
  });

  return {
    revenueCollected,
    revenueOutstanding,
    previousPeriodRevenue,
    upcomingBookingRevenue,
    averageServiceDuration,
    averageServicePrice,
    workspaceCapacity,
    bookingForecast,
    revenueForecast,
  };
}