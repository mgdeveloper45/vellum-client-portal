import { describe, expect, it } from "vitest";
import { signalById } from "./helpers";
import { buildExecutiveSignals } from "../executive-signals-engine";
import {
  createBookingForecast,
  createRevenueForecast,
  createWorkspaceCapacity,
} from "./fixtures";

describe("buildExecutiveSignals", () => {
  it("categorizes healthy business signals as strengths", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast({
        risk: "LOW",
      }),
      bookingForecast: createBookingForecast({
        risk: "LOW",
      }),
      workspaceCapacity: createWorkspaceCapacity({
        risk: "LOW",
      }),
    });

    expect(result.strengths).toHaveLength(3);
    expect(result.risks).toHaveLength(0);
    expect(result.opportunities).toHaveLength(0);
  });

  it("places unhealthy revenue into risks", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast({
        risk: "HIGH",
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    expect(result.risks).toHaveLength(1);

    expect(result.risks[0]).toMatchObject({
      id: "revenue",
      severity: "critical",
      title: "Revenue Risk",
    });
  });

  it("places booking opportunities into opportunities", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast({
        risk: "MEDIUM",
      }),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    expect(result.opportunities).toHaveLength(1);

    expect(result.opportunities[0]).toMatchObject({
      id: "bookings",
      severity: "warning",
    });
  });

  it("places capacity opportunities into opportunities", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity({
        risk: "MEDIUM",
      }),
    });

    expect(result.opportunities).toHaveLength(1);

    expect(result.opportunities[0]).toMatchObject({
      id: "capacity",
      severity: "warning",
    });
  });

  it("maps revenue trend to signal trend", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast({
        trend: "DOWN",
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    expect(result.strengths[0].trend).toBe("down");
  });

  it("maps booking trend to signal trend", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast({
        trend: "UP",
      }),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    expect(signalById(result.strengths, "bookings").trend).toBe("up");
  });

  it("keeps capacity trend stable", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast(),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    const capacity = result.strengths.find(
      (signal) => signal.id === "capacity",
    );

    expect(capacity?.trend).toBe("stable");
  });

  it("assigns excellent severity for healthy revenue", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast({
        risk: "LOW",
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    const revenue = result.strengths.find((signal) => signal.id === "revenue");

    expect(revenue?.severity).toBe("excellent");
    expect(revenue?.score).toBe(96);
  });

  it("assigns warning severity for medium revenue risk", () => {
    const result = buildExecutiveSignals({
      revenueForecast: createRevenueForecast({
        risk: "MEDIUM",
      }),
      bookingForecast: createBookingForecast(),
      workspaceCapacity: createWorkspaceCapacity(),
    });

    expect(result.risks[0]).toMatchObject({
      severity: "warning",
      score: 65,
    });
  });
});
