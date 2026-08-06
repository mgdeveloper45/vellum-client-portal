import { describe, expect, it, vi } from "vitest";

import { buildDashboard } from "@/lib/services/dashboard/dashboard-builder";
import { createHealthyDashboardQueryResult } from "@/lib/services/dashboard/__tests__/fixtures";

import { buildCopilotResponse } from "../copilot-service";

vi.mock("@/lib/services/ai/executive-brief-service", () => ({
  getOrCreateExecutiveBrief: vi.fn().mockResolvedValue({
    narrative: "Everything looks healthy today.",
    provider: "test",
    durationMs: 1,
    mode: "mock",
  }),
}));

describe("buildCopilotResponse", () => {
  it("builds a copilot response from the dashboard", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "revenue");
    expect(response.answer).toBeTruthy();
    expect(response.evidence.length).toBeGreaterThan(0);
    expect(response.suggestedActions.length).toBeGreaterThan(0);
  });

  it("routes revenue questions to the revenue responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "How is revenue doing?");
    expect(response.answer).toContain("Projected revenue");
  });

  it("routes booking questions to the booking responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "How are bookings?");
    expect(response.answer).toContain("Weekly booking utilization");
  });

  it("routes capacity questions to the capacity responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "How much capacity is available?",
    );

    expect(response.answer).toContain("Workspace utilization");
  });

  it("routes invoice questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "Which invoices need attention?",
    );

    expect(response.answer).toContain("outstanding");
  });

  it("routes collection questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "How much money should I collect?",
    );

    expect(response.answer).toContain("outstanding");
  });

  it("routes payment questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "What payments are still unpaid?",
    );

    expect(response.answer).toContain("outstanding");
  });

  it("falls back to the general responder", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "Tell me about my business.",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes risk questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "What is my biggest risk?",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes priority questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "What should I work on first?",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes client questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "Tell me about my clients.",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes customer questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "How are my customers doing?",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes project questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "How are my projects doing?",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes milestone questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(
      dashboard,
      "Which milestones need attention?",
    );

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes recommendation questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "What should I do today?");

    expect(response.answer.length).toBeGreaterThan(0);
  });

  it("routes advice questions", async () => {
    const dashboard = await buildDashboard({
      data: createHealthyDashboardQueryResult(),
    });

    const response = buildCopilotResponse(dashboard, "What do you recommend?");

    expect(response.answer.length).toBeGreaterThan(0);
  });
});
