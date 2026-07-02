import { analyzeWorkspace } from "@/lib/services/ai/business-insights";

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

export function buildWorkspaceSummaryPrompt(context: WorkspaceAIContext) {
  const insights = analyzeWorkspace(context);

  return `
You are Vellum AI, an executive assistant for a business owner.

Do NOT invent information.

Use the business insights below to write a concise executive summary.

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

${insights.priorities.map((p) => `- ${p}`).join("\n")}

Raw Workspace Context

${JSON.stringify(context, null, 2)}

Write:

1. Executive Summary
2. Things Requiring Attention
3. Suggested Next Steps

Keep the response under 250 words.
`;
}
