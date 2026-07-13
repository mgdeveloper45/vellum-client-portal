export type BookingForecastTrend = "UP" | "STABLE" | "DOWN";

export type BookingForecastRisk = "LOW" | "MEDIUM" | "HIGH";

export type BookingForecast = {
  utilizationToday: number;
  utilizationTomorrow: number;
  utilizationWeek: number;

  availableCapacityToday: number;
  availableCapacityTomorrow: number;
  availableCapacityWeek: number;

  peakDayLabel: string | null;
  peakDayUtilization: number;

  trend: BookingForecastTrend;
  risk: BookingForecastRisk;
  confidence: number;

  summary: string;
  recommendation: string;
};

export type BookingForecastDay = {
  label: string;
  bookings: number;
  capacity: number;
};

export type BookingForecastInput = {
  todaysBookings: number;
  todayCapacity: number;

  tomorrowsBookings: number;
  tomorrowCapacity: number;

  nextSevenDays: BookingForecastDay[];

  previousSevenDaysBookings: number;

  cancellationsLastThirtyDays: number;
  totalBookingsLastThirtyDays: number;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function calculateUtilization(bookings: number, capacity: number) {
  if (capacity <= 0) {
    return bookings > 0 ? 100 : 0;
  }

  return Math.round(clamp((bookings / capacity) * 100, 0, 100));
}

function calculateTrend(
  nextSevenDaysBookings: number,
  previousSevenDaysBookings: number,
): BookingForecastTrend {
  if (previousSevenDaysBookings <= 0) {
    return nextSevenDaysBookings > 0 ? "UP" : "STABLE";
  }

  const change =
    (nextSevenDaysBookings - previousSevenDaysBookings) /
    previousSevenDaysBookings;

  if (change >= 0.1) {
    return "UP";
  }

  if (change <= -0.1) {
    return "DOWN";
  }

  return "STABLE";
}

function calculateRisk({
  utilizationWeek,
  cancellationRate,
  availableCapacityWeek,
}: {
  utilizationWeek: number;
  cancellationRate: number;
  availableCapacityWeek: number;
}): BookingForecastRisk {
  if (cancellationRate >= 0.25 || utilizationWeek < 35) {
    return "HIGH";
  }

  if (
    cancellationRate >= 0.12 ||
    utilizationWeek < 60 ||
    availableCapacityWeek > 10
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

function calculateConfidence({
  totalBookingsLastThirtyDays,
  nextSevenDaysCount,
  totalCapacityWeek,
}: {
  totalBookingsLastThirtyDays: number;
  nextSevenDaysCount: number;
  totalCapacityWeek: number;
}) {
  const historyScore = Math.min(totalBookingsLastThirtyDays, 30);

  const scheduleScore = nextSevenDaysCount > 0 ? 10 : 0;

  const capacityScore = totalCapacityWeek > 0 ? 10 : 0;

  return Math.round(
    clamp(50 + historyScore + scheduleScore + capacityScore, 50, 95),
  );
}

export function buildBookingForecast(
  input: BookingForecastInput,
): BookingForecast {
  const utilizationToday = calculateUtilization(
    input.todaysBookings,
    input.todayCapacity,
  );

  const utilizationTomorrow = calculateUtilization(
    input.tomorrowsBookings,
    input.tomorrowCapacity,
  );

  const nextSevenDaysBookings = input.nextSevenDays.reduce(
    (total, day) => total + day.bookings,
    0,
  );

  const totalCapacityWeek = input.nextSevenDays.reduce(
    (total, day) => total + day.capacity,
    0,
  );

  const utilizationWeek = calculateUtilization(
    nextSevenDaysBookings,
    totalCapacityWeek,
  );

  const availableCapacityToday = Math.max(
    0,
    input.todayCapacity - input.todaysBookings,
  );

  const availableCapacityTomorrow = Math.max(
    0,
    input.tomorrowCapacity - input.tomorrowsBookings,
  );

  const availableCapacityWeek = Math.max(
    0,
    totalCapacityWeek - nextSevenDaysBookings,
  );

  const peakDay = input.nextSevenDays.reduce<{
    label: string;
    utilization: number;
  } | null>((currentPeak, day) => {
    const utilization = calculateUtilization(day.bookings, day.capacity);

    if (!currentPeak || utilization > currentPeak.utilization) {
      return {
        label: day.label,
        utilization,
      };
    }

    return currentPeak;
  }, null);

  const trend = calculateTrend(
    nextSevenDaysBookings,
    input.previousSevenDaysBookings,
  );

  const cancellationRate =
    input.totalBookingsLastThirtyDays === 0
      ? 0
      : clamp(
          input.cancellationsLastThirtyDays / input.totalBookingsLastThirtyDays,
          0,
          1,
        );

  const risk = calculateRisk({
    utilizationWeek,
    cancellationRate,
    availableCapacityWeek,
  });

  const confidence = calculateConfidence({
    totalBookingsLastThirtyDays: input.totalBookingsLastThirtyDays,
    nextSevenDaysCount: input.nextSevenDays.length,
    totalCapacityWeek,
  });

  const summary =
    risk === "HIGH"
      ? "Booking demand or cancellation activity requires attention. Review open capacity and protect confirmed appointments."
      : trend === "UP"
        ? "Booking demand is trending upward, with healthy utilization across the upcoming schedule."
        : trend === "DOWN"
          ? "Booking demand is trending below the previous period. Open capacity may require client outreach or promotion."
          : "Booking demand is stable based on the current schedule and recent activity.";

  const lowestUtilizationDay = input.nextSevenDays.reduce<{
    label: string;
    utilization: number;
    availableCapacity: number;
  } | null>((lowest, day) => {
    const utilization = calculateUtilization(day.bookings, day.capacity);

    const availableCapacity = Math.max(0, day.capacity - day.bookings);

    if (!lowest || utilization < lowest.utilization) {
      return {
        label: day.label,
        utilization,
        availableCapacity,
      };
    }

    return lowest;
  }, null);

  const recommendation =
    cancellationRate >= 0.25
      ? "Review recent cancellations and confirm upcoming appointments before additional schedule changes occur."
      : lowestUtilizationDay && lowestUtilizationDay.availableCapacity > 0
        ? `Focus booking outreach on ${lowestUtilizationDay.label}, where ${lowestUtilizationDay.availableCapacity} appointment ${
            lowestUtilizationDay.availableCapacity === 1
              ? "slot remains"
              : "slots remain"
          } available.`
        : "Your near-term schedule is well utilized. Protect service quality and confirmed appointments.";

  return {
    utilizationToday,
    utilizationTomorrow,
    utilizationWeek,

    availableCapacityToday,
    availableCapacityTomorrow,
    availableCapacityWeek,

    peakDayLabel: peakDay?.label ?? null,
    peakDayUtilization: peakDay?.utilization ?? 0,

    trend,
    risk,
    confidence,

    summary,
    recommendation,
  };
}
