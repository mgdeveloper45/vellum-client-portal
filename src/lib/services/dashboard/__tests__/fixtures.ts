import type { DashboardQueryResult } from "@/lib/queries/dashboard/get-dashboard-query";
import { Decimal } from '@prisma/client-runtime-utils';

const DAY_LABELS = [
  "Today",
  "Tomorrow",
  "Day 3",
  "Day 4",
  "Day 5",
  "Day 6",
  "Day 7",
] as const;

const DAY_OF_WEEK_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function createNextSevenDays(): DashboardQueryResult["nextSevenDays"] {
  const today = startOfLocalDay(new Date());

  return Array.from({ length: 7 }, (_, index) => ({
    date: addDays(today, index),
    nextDate: addDays(today, index + 1),
    label: DAY_LABELS[index],
  })) as DashboardQueryResult["nextSevenDays"];
}

function createBusinessHours(): DashboardQueryResult["businessHours"] {
  return DAY_OF_WEEK_NAMES.map((dayOfWeek) => ({
    dayOfWeek,
    openTime: "09:00",
    closeTime: "17:00",
    closed: false,
  })) as DashboardQueryResult["businessHours"];
}

export function createDashboardQueryResult(
  overrides: Partial<DashboardQueryResult> = {},
): DashboardQueryResult {
  return {
    workspaceId: "workspace-1",
    firstName: "Marcus",

    nextSevenDays: createNextSevenDays(),

    totalClients: 10,
    activeProjects: 5,
    completedProjects: 20,
    totalProjects: 25,

    openInvoices: 2,
    totalInvoices: 10,
    paidInvoices: 8,

    totalRevenue: {
      _sum: {
        amount: new Decimal(18_000),
      },
    },

    outstandingRevenue: {
      _sum: {
        amount: new Decimal(3_000),
      },
    },

    previousPeriodRevenue: {
      _sum: {
        amount: new Decimal(15_000),
      },
    },

    pendingMilestones: 2,

    approvedProposals: 3,
    totalProposals: 5,

    todaysBookings: [],
    upcomingBookings: [],

    upcomingBookingsForForecast: [
      {
        service: {
          price: 500,
        },
      },
      {
        service: {
          price: 300,
        },
      },
    ] as DashboardQueryResult["upcomingBookingsForForecast"],

    nextSevenDaysBookings: [],

    bookingTrendCounts: [6, 4, 5, 3, 8, 2, 1],

    previousSevenDaysBookings: 20,
    cancellationsLastThirtyDays: 2,
    totalBookingsLastThirtyDays: 40,

    businessHours: createBusinessHours(),

    activeServices: [
      {
        duration: 60,
        price: 200,
      },
      {
        duration: 90,
        price: 300,
      },
    ] as DashboardQueryResult["activeServices"],

    recentActivity: [],
    recentNotifications: [],

    ...overrides,
  };
}

export function createHealthyDashboardQueryResult() {
  return createDashboardQueryResult();
}

export function createAtRiskDashboardQueryResult() {
  return createDashboardQueryResult({
    openInvoices: 12,

    totalInvoices: 15,
    paidInvoices: 3,

    activeProjects: 12,
    completedProjects: 2,
    totalProjects: 14,

    pendingMilestones: 9,

    approvedProposals: 1,
    totalProposals: 10,

    outstandingRevenue: {
      _sum: {
        amount: new Decimal(25_000),
      },
    },

    bookingTrendCounts: [0, 1, 0, 0, 1, 0, 0],
  });
}

export function createEmptyDashboardQueryResult() {
  return createDashboardQueryResult({
    totalClients: 0,

    activeProjects: 0,
    completedProjects: 0,
    totalProjects: 0,

    openInvoices: 0,
    totalInvoices: 0,
    paidInvoices: 0,

    totalRevenue: {
      _sum: {
        amount: new Decimal(0),
      },
    },

    outstandingRevenue: {
      _sum: {
        amount: new Decimal(0),
      },
    },

    previousPeriodRevenue: {
      _sum: {
        amount: new Decimal(0),
      },
    },

    pendingMilestones: 0,

    approvedProposals: 0,
    totalProposals: 0,

    todaysBookings: [],
    upcomingBookings: [],
    upcomingBookingsForForecast: [],
    nextSevenDaysBookings: [],

    bookingTrendCounts: [0, 0, 0, 0, 0, 0, 0],

    previousSevenDaysBookings: 0,
    cancellationsLastThirtyDays: 0,
    totalBookingsLastThirtyDays: 0,

    activeServices: [],

    recentActivity: [],
    recentNotifications: [],
  });
}
export const createDashboardQuery = createDashboardQueryResult;
