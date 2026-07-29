export type ExecutiveScoreTrend = "up" | "down" | "stable";

export type ExecutiveScoreGrade = "A+" | "A" | "B" | "C" | "D";

export type ExecutiveScoreContributor = {
  key: "revenue" | "bookings" | "capacity" | "collections" | "clients";
  label: string;
  score: number;
  trend: ExecutiveScoreTrend;
  summary: string;
};

export type ExecutiveScore = {
  score: number;
  grade: ExecutiveScoreGrade;
  status: string;
  trend: ExecutiveScoreTrend;
  delta: number;
  contributors: ExecutiveScoreContributor[];
};

export function buildExecutiveScore(args: {
  revenueHealth: number;
  bookingHealth: number;
  capacityHealth: number;
  collectionsHealth: number;
  clientHealth: number;
}): ExecutiveScore {
  const contributors: ExecutiveScoreContributor[] = [
    {
      key: "revenue",
      label: "Revenue",
      score: args.revenueHealth,
      trend: "up",
      summary: "Revenue performance is healthy.",
    },
    {
      key: "bookings",
      label: "Bookings",
      score: args.bookingHealth,
      trend: "up",
      summary: "Booking volume is stable.",
    },
    {
      key: "capacity",
      label: "Capacity",
      score: args.capacityHealth,
      trend: "stable",
      summary: "Capacity is well utilized.",
    },
    {
      key: "collections",
      label: "Collections",
      score: args.collectionsHealth,
      trend: "down",
      summary: "Outstanding invoices require attention.",
    },
    {
      key: "clients",
      label: "Clients",
      score: args.clientHealth,
      trend: "up",
      summary: "Client engagement is growing.",
    },
  ];

  const score = Math.round(
    contributors.reduce((sum, item) => sum + item.score, 0) /
      contributors.length,
  );

  const grade =
    score >= 97
      ? "A+"
      : score >= 90
        ? "A"
        : score >= 80
          ? "B"
          : score >= 70
            ? "C"
            : "D";

  const status =
    score >= 90
      ? "Excellent"
      : score >= 80
        ? "Healthy"
        : score >= 70
          ? "Needs Attention"
          : "Critical";

  return {
    score,
    grade,
    status,
    trend: "up",
    delta: 2,
    contributors,
  };
}
