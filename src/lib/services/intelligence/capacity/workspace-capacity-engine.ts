export type WorkspaceCapacityRisk = "LOW" | "MEDIUM" | "HIGH";

export type WorkspaceCapacityDay = {
  label: string;
  capacity: number;
  bookings: number;
  averageBookingValue?: number;
};

export type WorkspaceCapacityInput = {
  todayLabel: string;
  tomorrowLabel: string;
  days: WorkspaceCapacityDay[];
};

export type WorkspaceCapacityDayResult = {
  label: string;
  capacity: number;
  bookings: number;
  openSlots: number;
  utilizationRate: number;
  estimatedOpenRevenue: number;
};

export type WorkspaceCapacity = {
  today: WorkspaceCapacityDayResult;
  tomorrow: WorkspaceCapacityDayResult;

  weeklyCapacity: number;
  weeklyBookings: number;
  weeklyOpenSlots: number;
  weeklyUtilizationRate: number;

  estimatedOpenRevenue: number;

  lowestUtilizationDay: WorkspaceCapacityDayResult | null;
  highestUtilizationDay: WorkspaceCapacityDayResult | null;

  constrained: boolean;
  risk: WorkspaceCapacityRisk;

  summary: string;
  recommendation: string;

  days: WorkspaceCapacityDayResult[];
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function calculateUtilizationRate(bookings: number, capacity: number) {
  if (capacity <= 0) {
    return bookings > 0 ? 100 : 0;
  }

  return Math.round(clamp((bookings / capacity) * 100, 0, 100));
}

function buildDayResult(day: WorkspaceCapacityDay): WorkspaceCapacityDayResult {
  const normalizedCapacity = Math.max(0, day.capacity);

  const normalizedBookings = Math.max(0, day.bookings);

  const openSlots = Math.max(0, normalizedCapacity - normalizedBookings);

  const averageBookingValue = Math.max(0, day.averageBookingValue ?? 0);

  return {
    label: day.label,
    capacity: normalizedCapacity,
    bookings: normalizedBookings,
    openSlots,
    utilizationRate: calculateUtilizationRate(
      normalizedBookings,
      normalizedCapacity,
    ),
    estimatedOpenRevenue: Math.round(openSlots * averageBookingValue),
  };
}

function createEmptyDay(label: string): WorkspaceCapacityDayResult {
  return {
    label,
    capacity: 0,
    bookings: 0,
    openSlots: 0,
    utilizationRate: 0,
    estimatedOpenRevenue: 0,
  };
}

function calculateRisk({
  weeklyCapacity,
  weeklyUtilizationRate,
  weeklyOpenSlots,
}: {
  weeklyCapacity: number;
  weeklyUtilizationRate: number;
  weeklyOpenSlots: number;
}): WorkspaceCapacityRisk {
  if (weeklyCapacity === 0) {
    return "MEDIUM";
  }

  if (weeklyUtilizationRate < 35 || weeklyOpenSlots >= 15) {
    return "HIGH";
  }

  if (weeklyUtilizationRate < 65 || weeklyOpenSlots >= 7) {
    return "MEDIUM";
  }

  return "LOW";
}

export function buildWorkspaceCapacity(
  input: WorkspaceCapacityInput,
): WorkspaceCapacity {
  const days = input.days.map(buildDayResult);

  const today =
    days.find((day) => day.label === input.todayLabel) ??
    createEmptyDay(input.todayLabel);

  const tomorrow =
    days.find((day) => day.label === input.tomorrowLabel) ??
    createEmptyDay(input.tomorrowLabel);

  const weeklyCapacity = days.reduce((total, day) => total + day.capacity, 0);

  const weeklyBookings = days.reduce((total, day) => total + day.bookings, 0);

  const weeklyOpenSlots = days.reduce((total, day) => total + day.openSlots, 0);

  const estimatedOpenRevenue = days.reduce(
    (total, day) => total + day.estimatedOpenRevenue,
    0,
  );

  const weeklyUtilizationRate = calculateUtilizationRate(
    weeklyBookings,
    weeklyCapacity,
  );

  const lowestUtilizationDay = days.reduce<WorkspaceCapacityDayResult | null>(
    (lowest, day) => {
      if (!lowest || day.utilizationRate < lowest.utilizationRate) {
        return day;
      }

      return lowest;
    },
    null,
  );

  const highestUtilizationDay = days.reduce<WorkspaceCapacityDayResult | null>(
    (highest, day) => {
      if (!highest || day.utilizationRate > highest.utilizationRate) {
        return day;
      }

      return highest;
    },
    null,
  );

  const constrained = weeklyCapacity > 0 && weeklyUtilizationRate >= 90;

  const risk = calculateRisk({
    weeklyCapacity,
    weeklyUtilizationRate,
    weeklyOpenSlots,
  });

  const summary = constrained
    ? "The upcoming schedule is approaching full capacity. Protect service quality and evaluate whether additional availability is needed."
    : risk === "HIGH"
      ? "The workspace has substantial unused booking capacity that may reduce near-term revenue and utilization."
      : risk === "MEDIUM"
        ? "The schedule has available capacity that could support additional bookings and revenue."
        : "The workspace is operating at a healthy utilization level with limited unused capacity.";

  const recommendation = constrained
    ? "Review staffing and service availability before accepting additional high-effort bookings."
    : lowestUtilizationDay && lowestUtilizationDay.openSlots > 0
      ? `Focus booking outreach on ${lowestUtilizationDay.label}, where ${lowestUtilizationDay.openSlots} ${
          lowestUtilizationDay.openSlots === 1
            ? "appointment slot remains"
            : "appointment slots remain"
        } available.`
      : "Maintain the current schedule and protect confirmed appointments.";

  return {
    today,
    tomorrow,

    weeklyCapacity,
    weeklyBookings,
    weeklyOpenSlots,
    weeklyUtilizationRate,

    estimatedOpenRevenue,

    lowestUtilizationDay,
    highestUtilizationDay,

    constrained,
    risk,

    summary,
    recommendation,

    days,
  };
}
