import type { BookingHealthResult } from "./booking-health";
import type { BookingLifecycle } from "./booking-lifecycle";
import type { BookingCountdown } from "./booking-countdown";
import type { BookingRecommendedAction } from "./booking-actions";

export type BookingMission = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

type BookingMissionInput = {
  lifecycle: BookingLifecycle;
  health: BookingHealthResult;
  countdown: BookingCountdown;
  actions: BookingRecommendedAction[];
};

export function determineBookingMission({
  lifecycle,
  health,
  countdown,
  actions,
}: BookingMissionInput): BookingMission {
  if (health.score < 50) {
    return {
      title: "Booking Needs Immediate Attention",
      description:
        health.reasons[0] ??
        "This booking has multiple issues that should be resolved.",
      priority: "HIGH",
    };
  }

  if (countdown.urgent && actions.length > 0) {
    return {
      title: "Prepare For Upcoming Booking",
      description: actions[0].description,
      priority: "HIGH",
    };
  }

  if (lifecycle === "FOLLOW_UP") {
    return {
      title: "Collect Outstanding Payment",
      description: "Follow up with the client regarding payment.",
      priority: "HIGH",
    };
  }

  if (lifecycle === "READY") {
    return {
      title: "Booking Ready",
      description: "Everything looks good. Prepare for the appointment.",
      priority: "LOW",
    };
  }

  return {
    title: "Continue Booking Workflow",
    description: "Proceed with the next recommended action.",
    priority: "MEDIUM",
  };
}
