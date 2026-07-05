export type ClientHealth = "EXCELLENT" | "GOOD" | "ATTENTION" | "AT_RISK";

export type ClientRetentionRisk = "LOW" | "MEDIUM" | "HIGH";

export type ClientOpportunity = "UPSELL" | "REBOOK" | "REVIEW" | "REFERRAL";

export type ClientProfile = {
  id: string;
  name: string;
  email: string;

  totalBookings: number;
  totalRevenue: number;

  lastBookingAt: Date | null;

  averageBookingValue: number;
};
