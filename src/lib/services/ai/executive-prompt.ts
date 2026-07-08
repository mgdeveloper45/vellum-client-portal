import type { DashboardContext } from "@/lib/services/dashboard/dashboard-context";

export function buildExecutivePrompt(context: DashboardContext): string {
  const summary = context.executiveContext.summary;

  return `
You are an executive business advisor.

Generate a concise executive briefing.

Business Health

Overall: ${summary.overallHealth}

Revenue: ${summary.revenueHealth}

Clients: ${summary.clientHealth}

Workspace: ${summary.workspaceHealth}

Bookings: ${summary.bookingHealth}

Executive Overview

${context.executiveBrief.overview}

Timeline

${context.timeline
  .map((event) => `- ${event.title}: ${event.description}`)
  .join("\n")}

Write:

1. Executive Summary

2. Biggest Risk

3. Biggest Opportunity

4. Recommended Action

Keep the tone professional.
`;
}
