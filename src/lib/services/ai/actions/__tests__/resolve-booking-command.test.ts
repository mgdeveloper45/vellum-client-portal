import { describe, expect, it } from "vitest";
import { resolveBookingCommand } from "../resolve-booking-command";

const services = [
  {
    id: "service-1",
    workspaceId: "workspace-1",
    name: "Consultation",
    duration: 60,
    price: 150,
  },
  {
    id: "service-2",
    workspaceId: "workspace-1",
    name: "Strategy Session",
    duration: 90,
    price: 250,
  },
];

const clients = [
  {
    id: "client-1",
    firstName: "Jordan",
    lastName: "Smith",
    email: "jordan@example.com",
  },
  {
    id: "client-2",
    firstName: "Taylor",
    lastName: "Jones",
    email: "taylor@example.com",
  },
];

describe("resolveBookingCommand", () => {
  it("resolves a complete booking command", () => {
    const result = resolveBookingCommand(
      "Book Jordan Smith for a consultation on 2026-08-15 at 10:30 AM.",
      services,
      clients,
    );

    expect(result.service?.id).toBe("service-1");
    expect(result.client?.id).toBe("client-1");
    expect(result.date).toBe("2026-08-15");
    expect(result.startTime).toBe("10:30");
    expect(result.missingFields).toEqual([]);
  });

  it("does not guess when required fields are missing", () => {
    const result = resolveBookingCommand(
      "Book Jordan tomorrow.",
      services,
      clients,
    );

    expect(result.client?.id).toBe("client-1");
    expect(result.service).toBeNull();
    expect(result.startTime).toBeNull();

    expect(result.missingFields).toContain("service");
    expect(result.missingFields).toContain("time");
  });

  it("resolves another available service", () => {
    const result = resolveBookingCommand(
      "Schedule Taylor Jones for a strategy session on 2026-08-20 at 14:00.",
      services,
      clients,
    );

    expect(result.service?.id).toBe("service-2");
    expect(result.client?.id).toBe("client-2");
    expect(result.date).toBe("2026-08-20");
    expect(result.startTime).toBe("14:00");
    expect(result.missingFields).toEqual([]);
  });

  it("does not guess between ambiguous clients", () => {
    const result = resolveBookingCommand(
      "Schedule Smith for a consultation on 2026-08-20 at 10 AM.",
      services,
      [
        clients[0],
        {
          id: "client-3",
          firstName: "Alex",
          lastName: "Smith",
          email: "alex@example.com",
        },
      ],
    );

    expect(result.client).toBeNull();
    expect(result.missingFields).toContain("client");
  });
});
