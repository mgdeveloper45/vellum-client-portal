import { analyzeWorkspace } from "@/lib/services/ai/business-insights";

type WorkspaceAIContext = Parameters<typeof analyzeWorkspace>[0];

export type WorkspaceAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

export function generateWorkspaceActions(
  context: WorkspaceAIContext,
): WorkspaceAction[] {
  const insights = analyzeWorkspace(context);

  const actions: WorkspaceAction[] = [];

  if (insights.counts.unpaidInvoices > 0) {
    actions.push({
      id: "unpaid-invoices",
      title: "Follow up on unpaid invoices",
      description: `${insights.counts.unpaidInvoices} unpaid invoice${
        insights.counts.unpaidInvoices === 1 ? "" : "s"
      } totaling $${insights.money.unpaidInvoiceTotal.toLocaleString()}.`,
      href: "/invoices",
      priority: "HIGH",
    });
  }

  if (insights.counts.todaysBookings > 0) {
    actions.push({
      id: "todays-bookings",
      title: "Review today's schedule",
      description: `${insights.counts.todaysBookings} booking${
        insights.counts.todaysBookings === 1 ? "" : "s"
      } scheduled today.`,
      href: "/bookings",
      priority: "MEDIUM",
    });
  }

  if (insights.counts.unreadNotifications > 0) {
    actions.push({
      id: "unread-notifications",
      title: "Review unread notifications",
      description: `${insights.counts.unreadNotifications} unread notification${
        insights.counts.unreadNotifications === 1 ? "" : "s"
      } needs attention.`,
      href: "/notifications",
      priority: "MEDIUM",
    });
  }

  if (insights.counts.recentMessages > 0) {
    actions.push({
      id: "recent-messages",
      title: "Check recent client messages",
      description: `${insights.counts.recentMessages} recent message${
        insights.counts.recentMessages === 1 ? "" : "s"
      } across active projects.`,
      href: "/projects",
      priority: "LOW",
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "all-clear",
      title: "Workspace looks healthy",
      description:
        "No urgent invoices, bookings, messages, or alerts detected.",
      href: "/dashboard",
      priority: "LOW",
    });
  }

  return actions;
}
