import { openai } from "@/lib/openai";
import { analyzeWorkspace } from "@/lib/services/ai/business-insights";

export async function askAI(
  prompt: string,
  context?: Parameters<typeof analyzeWorkspace>[0],
) {
  if (process.env.AI_MOCK_MODE === "true") {
    if (!context) {
      return "No workspace context available.";
    }

    const insights = analyzeWorkspace(context);

    return `📊 Workspace Summary

Active Projects: ${insights.counts.activeProjects}
Today's Bookings: ${insights.counts.todaysBookings}
Upcoming Bookings: ${insights.counts.upcomingBookings}
Unpaid Invoices: ${insights.counts.unpaidInvoices}
Outstanding Revenue: $${insights.money.unpaidInvoiceTotal.toLocaleString()}
Unread Notifications: ${insights.counts.unreadNotifications}
Recent Messages: ${insights.counts.recentMessages}

Highest Priority

${insights.topPriority}

Recommended Actions

${insights.priorities.map((p) => `• ${p}`).join("\n")}
`;
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("AI request failed:", error);

    return "AI summary is unavailable right now. Please check your OpenAI API billing/quota and try again.";
  }
}