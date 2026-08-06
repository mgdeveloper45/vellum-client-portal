import { analyzeWorkspace } from "@/lib/services/ai/business-insights";
import type { BusinessContext } from "@/lib/services/ai/conversation/business-context";

type WorkspaceAIContext = {
  activeProjects: Array<{
    name: string;
    status: string;
  }>;
  todaysBookings: Array<{
    customerName: string;
    startTime: string;
    service: {
      name: string;
    };
  }>;
  upcomingBookings: Array<{
    customerName: string;
    date: Date;
    startTime: string;
    service: {
      name: string;
    };
  }>;
  unpaidInvoices: Array<{
    amount: number;
    project: {
      name: string;
    };
  }>;
  unreadNotifications: Array<{
    title: string;
    message: string;
  }>;
  recentMessages: Array<{
    content: string;
    project: {
      name: string;
    };
    sender: {
      firstName: string;
      lastName: string;
    };
  }>;
};

export function buildWorkspaceSummaryPrompt(
  context: WorkspaceAIContext,
) {
  const insights = analyzeWorkspace(context);

  return `
You are Vellum AI, an executive assistant for a business owner.

Do NOT invent information.

Business Metrics

• Active Projects: ${insights.counts.activeProjects}
• Today's Bookings: ${insights.counts.todaysBookings}
• Upcoming Bookings: ${insights.counts.upcomingBookings}
• Unpaid Invoices: ${insights.counts.unpaidInvoices}
• Outstanding Revenue: $${insights.money.unpaidInvoiceTotal.toLocaleString()}
• Unread Notifications: ${insights.counts.unreadNotifications}
• Recent Messages: ${insights.counts.recentMessages}

Top Priority

${insights.topPriority}

Priority List

${insights.priorities.map((priority) => `- ${priority}`).join("\n")}

Raw Workspace Context

${JSON.stringify(context, null, 2)}

Write:

1. Executive Summary

2. Things Requiring Attention

3. Suggested Next Steps

Keep the response under 250 words.
`;
}

export function buildCopilotPrompt(
  context: BusinessContext,
  question: string,
): string {
  return `
You are Vellum Copilot.

You are an executive advisor helping a business owner.

Only answer using the information provided below.

If the answer cannot be determined from the business context, clearly say so.

Executive Score

${context.executiveScore}

Business Risks

Revenue: ${context.revenueRisk}

Bookings: ${context.bookingRisk}

Capacity: ${context.capacityRisk}

Business Metrics

Revenue Collected:
$${context.revenueCollected.toLocaleString()}

Outstanding Revenue:
$${context.revenueOutstanding.toLocaleString()}

Previous Period Revenue:
$${context.previousPeriodRevenue.toLocaleString()}

Upcoming Booking Revenue:
$${context.upcomingBookingRevenue.toLocaleString()}

Morning Summary

${context.morningBrief}

AI Executive Narrative

${context.aiNarrative}

Top Recommendation

${context.topAdvice ?? "None"}

Recommendations

${context.recommendations.map((item) => `- ${item}`).join("\n")}

User Question

${question}

Provide:

• Direct answer

• Supporting reasoning

• Recommended action

Do not invent business information.
`;
}