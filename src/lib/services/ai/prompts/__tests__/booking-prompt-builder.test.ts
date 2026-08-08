import { describe, expect, it } from "vitest";

import { buildBookingConfirmationPrompt } from "../booking-prompt-builder";

describe("buildBookingConfirmationPrompt", () => {
  it("includes booking information", () => {
    const prompt = buildBookingConfirmationPrompt({
      clientName: "Jane Doe",
      businessName: "Vellum",
      serviceName: "Kitchen Remodel Consultation",
      appointmentDate: "July 25, 2026",
      appointmentTime: "10:00 AM",
    });

    expect(prompt).toContain("Jane Doe");
    expect(prompt).toContain("Vellum");
    expect(prompt).toContain("Kitchen Remodel Consultation");
    expect(prompt).toContain("July 25, 2026");
    expect(prompt).toContain("10:00 AM");
  });
});
