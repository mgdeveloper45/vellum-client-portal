import { describe, expect, it } from "vitest";

import type { BookingHealthResult } from "../booking-health";
import { buildBookingRecommendedActions } from "../booking-actions";

function buildHealth(
  label: BookingHealthResult["label"] = "NEEDS_ATTENTION",
): BookingHealthResult {
  return {
    score: label === "HEALTHY" ? 100 : label === "NEEDS_ATTENTION" ? 65 : 30,
    label,
    reasons: [],
  };
}

describe("buildBookingRecommendedActions", () => {
  it("recommends creating a project when the booking has no project", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: null,
      health: buildHealth(),
      hasProject: false,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions).toContainEqual({
      id: "create-project",
      type: "COMMAND",
      command: "CREATE_PROJECT",
      bookingId: "booking-1",
      title: "Create project",
      description: "Turn this booking into a client project.",
      priority: "HIGH",
    });

    expect(actions.some((action) => action.id === "create-invoice")).toBe(
      false,
    );
  });

  it("recommends creating an invoice when a project exists without an invoice", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth(),
      hasProject: true,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions).toContainEqual({
      id: "create-invoice",
      type: "NAVIGATION",
      title: "Create invoice",
      description: "Prepare billing for this booking.",
      href: "/projects/project-1#invoices",
      priority: "MEDIUM",
    });

    expect(actions.some((action) => action.id === "create-project")).toBe(
      false,
    );
  });

  it("does not recommend creating an invoice when the project id is missing", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: null,
      health: buildHealth(),
      hasProject: true,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions.some((action) => action.id === "create-invoice")).toBe(
      false,
    );
  });

  it("recommends payment follow-up when an invoice exists and is unpaid", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth(),
      hasProject: true,
      hasInvoice: true,
      invoicePaid: false,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions).toContainEqual({
      id: "follow-up-payment",
      type: "NAVIGATION",
      title: "Follow up on payment",
      description: "Invoice exists but has not been paid yet.",
      href: "/invoices",
      priority: "HIGH",
    });

    expect(actions.some((action) => action.id === "create-invoice")).toBe(
      false,
    );
  });

  it("does not recommend messaging before a project exists", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: null,
      health: {
        score: 100,
        label: "HEALTHY",
        reasons: ["Booking workflow looks healthy."],
      },
      hasProject: false,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: false,
      hasFiles: true,
    });

    expect(actions).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "message-client",
        }),
      ]),
    );
  });

  it("links message client to the project messages section", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: {
        score: 100,
        label: "HEALTHY",
        reasons: ["Booking workflow looks healthy."],
      },
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: false,
      hasFiles: true,
    });

    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "message-client",
          type: "NAVIGATION",
          href: "/projects/project-1#messages",
        }),
      ]),
    );
  });

  it("recommends messaging the client when no messages exist", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth(),
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: false,
      hasFiles: true,
    });

    expect(actions).toContainEqual({
      id: "message-client",
      type: "NAVIGATION",
      title: "Message client",
      description: "Send a quick follow-up or preparation note.",
      href: "/projects/project-1#messages",
      priority: "MEDIUM",
    });
  });

  it("recommends requesting files when no files exist", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth(),
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: true,
      hasFiles: false,
    });

    expect(actions).toContainEqual({
      id: "request-files",
      type: "NAVIGATION",
      title: "Request files",
      description: "Upload or manage files for this booking's project.",
      href: "/projects/project-1#files",
      priority: "MEDIUM",
    });
  });

  it("returns the all-clear action when the booking is healthy and needs no follow-up", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth("HEALTHY"),
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions).toEqual([
      {
        id: "all-clear",
        type: "NAVIGATION",
        title: "Booking is on track",
        description: "No urgent follow-up needed right now.",
        href: "/bookings/booking-1",
        priority: "LOW",
      },
    ]);
  });

  it("does not recommend requesting files before a project exists", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: null,
      health: {
        score: 100,
        label: "HEALTHY",
        reasons: ["Booking workflow looks healthy."],
      },
      hasProject: false,
      hasInvoice: false,
      invoicePaid: false,
      hasMessages: true,
      hasFiles: false,
    });

    expect(actions).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "request-files",
        }),
      ]),
    );
  });

  it("links file management to the project files section", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: {
        score: 100,
        label: "HEALTHY",
        reasons: ["Booking workflow looks healthy."],
      },
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: true,
      hasFiles: false,
    });

    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "request-files",
          type: "NAVIGATION",
          href: "/projects/project-1#files",
        }),
      ]),
    );
  });

  it("returns no actions when nothing needs follow-up but health is not healthy", () => {
    const actions = buildBookingRecommendedActions({
      bookingId: "booking-1",
      projectId: "project-1",
      health: buildHealth("NEEDS_ATTENTION"),
      hasProject: true,
      hasInvoice: true,
      invoicePaid: true,
      hasMessages: true,
      hasFiles: true,
    });

    expect(actions).toEqual([]);
  });
});
