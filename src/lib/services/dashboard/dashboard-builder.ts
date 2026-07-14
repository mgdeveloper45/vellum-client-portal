import {
  getExecutiveBrief,
  saveExecutiveBrief,
} from "@/lib/services/ai/executive-brief-cache";
import { createAiProvider } from "@/lib/services/ai/ai-provider-factory";
import { ExecutiveNarrativeService } from "@/lib/services/ai/executive-narrative-service";
import { loadDashboardData } from "@/lib/services/dashboard/dashboard-data-loader";
import { buildDashboardOrchestrator } from "@/lib/services/dashboard/dashboard-orchestrator";
import { buildWorkspaceCapacity } from "@/lib/services/intelligence/capacity/workspace-capacity-engine";
import { buildBookingForecast } from "@/lib/services/intelligence/forecasting/booking-forecast-engine";
import { buildRevenueForecast } from "@/lib/services/intelligence/forecasting/revenue-forecast-engine";
import { buildExecutiveIntelligencePipeline } from "@/lib/services/intelligence/executive-intelligence-pipeline";

type BuildDashboardInput = {
  userId: string;
  userName?: string | null;
  userRole: string;
  workspaceId: string;
};

const dayOfWeekNames = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

export async function buildDashboard({
  userId,
  userName,
  userRole,
  workspaceId,
}: BuildDashboardInput) {
  const data = await loadDashboardData({
    id: userId,
    role: userRole,
    workspaceId,
  });

  const revenueCollected = data.totalRevenue._sum.amount ?? 0;

  const revenueOutstanding = data.outstandingRevenue._sum.amount ?? 0;

  const previousPeriodRevenue = data.previousPeriodRevenue._sum.amount ?? 0;

  const upcomingBookingRevenue = data.upcomingBookingsForForecast.reduce(
    (total, booking) => total + booking.service.price,
    0,
  );

  const averageServiceDuration =
    data.activeServices.length === 0
      ? 60
      : Math.max(
          1,
          Math.round(
            data.activeServices.reduce(
              (total, service) => total + service.duration,
              0,
            ) / data.activeServices.length,
          ),
        );

  const averageBookingValue =
    data.activeServices.length === 0
      ? 0
      : Math.round(
          data.activeServices.reduce(
            (total, service) => total + service.price,
            0,
          ) / data.activeServices.length,
        );

  const firstName = userName?.split(" ")[0] ?? null;

  const dashboard = buildDashboardOrchestrator({
    firstName,

    totalClients: data.totalClients,
    activeProjects: data.activeProjects,
    completedProjects: data.completedProjects,
    totalProjects: data.totalProjects,

    openInvoices: data.openInvoices,
    totalInvoices: data.totalInvoices,
    paidInvoices: data.paidInvoices,

    revenueCollected,
    revenueOutstanding,

    pendingMilestones: data.pendingMilestones,
    approvedProposals: data.approvedProposals,
    totalProposals: data.totalProposals,

    todaysBookings: data.todaysBookings.length,
    upcomingBookings: data.upcomingBookings.length,

    bookingTrendCounts: data.bookingTrendCounts,

    nextSevenDayLabels: data.nextSevenDays.map((day) => day.label),

    recentActivity: data.recentActivity,
  });

  const capacityDays = data.nextSevenDays.map((day, index) => {
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
      openMinutes === 0 ? 0 : Math.floor(openMinutes / averageServiceDuration);

    return {
      label: day.label,
      capacity,
      bookings: data.bookingTrendCounts[index] ?? 0,
      averageBookingValue,
    };
  });

  const todayLabel = data.nextSevenDays[0]?.label ?? "Today";

  const tomorrowLabel = data.nextSevenDays[1]?.label ?? "Tomorrow";

  const workspaceCapacity = buildWorkspaceCapacity({
    todayLabel,
    tomorrowLabel,
    days: capacityDays,
  });

  const bookingForecast = buildBookingForecast({
    todaysBookings: workspaceCapacity.today.bookings,

    todayCapacity: workspaceCapacity.today.capacity,

    tomorrowsBookings: workspaceCapacity.tomorrow.bookings,

    tomorrowCapacity: workspaceCapacity.tomorrow.capacity,

    nextSevenDays: workspaceCapacity.days.map((day) => ({
      label: day.label,
      bookings: day.bookings,
      capacity: day.capacity,
    })),

    previousSevenDaysBookings: data.previousSevenDaysBookings,

    cancellationsLastThirtyDays: data.cancellationsLastThirtyDays,

    totalBookingsLastThirtyDays: data.totalBookingsLastThirtyDays,
  });

  const revenueForecast = buildRevenueForecast({
    revenueCollected,
    outstandingRevenue: revenueOutstanding,

    // Invoice has no dueDate, so truly overdue
    // revenue cannot yet be distinguished.
    overdueRevenue: 0,

    paidInvoices: data.paidInvoices,
    totalInvoices: data.totalInvoices,

    upcomingBookingRevenue,
    previousPeriodRevenue,
  });

  const executiveIntelligence = buildExecutiveIntelligencePipeline({
    revenueForecast,
    bookingForecast,
    workspaceCapacity,

    executiveInsights: dashboard.executiveInsights,
  });

  const cachedBrief = await getExecutiveBrief(workspaceId);

  let aiResult: {
    narrative: string;
    provider: string;
    durationMs: number;
    mode: "mock" | "production";
  };

  if (cachedBrief) {
    aiResult = {
      narrative: cachedBrief.narrative,
      provider: cachedBrief.provider,
      durationMs: cachedBrief.durationMs,
      mode: cachedBrief.mode as "mock" | "production",
    };
  } else {
    const provider = createAiProvider();

    const narrativeService = new ExecutiveNarrativeService(provider);

    aiResult = await narrativeService.generate(dashboard.dashboardContext);

    await saveExecutiveBrief(workspaceId, aiResult);
  }

  return {
    ...dashboard,

    revenueForecast,
    bookingForecast,
    workspaceCapacity,
    executiveIntelligence,

    executiveAdvice: executiveIntelligence.executiveAdvice,

    topAdvice: executiveIntelligence.topAdvice,

    aiResult,
    firstName,

    revenueCollected,
    revenueOutstanding,
    previousPeriodRevenue,
    upcomingBookingRevenue,

    todaysBookings: data.todaysBookings,

    upcomingBookings: data.upcomingBookings,

    recentActivity: data.recentActivity,

    recentNotifications: data.recentNotifications,
  };
}

export type DashboardViewModel = Awaited<ReturnType<typeof buildDashboard>>;
