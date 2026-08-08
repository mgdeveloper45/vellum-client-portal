import { beforeEach, describe, expect, it, vi } from "vitest";

import { askWithPrompt } from "../../ai-service";
import { generateBookingConfirmationAction } from "../booking-action";

vi.mock("../../ai-service", () => ({
  askWithPrompt: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(askWithPrompt).mockResolvedValue("Booking confirmation email.");
});

describe("generateBookingConfirmationAction", () => {
  it("creates a booking confirmation", async () => {
    const result = await generateBookingConfirmationAction({
      clientName: "Jane Doe",
      businessName: "Vellum",
      serviceName: "Kitchen Remodel Consultation",
      appointmentDate: "July 25, 2026",
      appointmentTime: "10:00 AM",
    });

    expect(result.type).toBe("EMAIL");

    expect(result.title).toContain("Jane Doe");

    expect(result.content).toContain("Booking confirmation");
  });
});
