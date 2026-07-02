"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routeCommand } from "@/lib/services/ai/command-router";
import { getWorkspaceAIContext } from "@/lib/services/ai/workspace-context";
import { analyzeWorkspace } from "@/lib/services/ai/business-insights";

export async function runAICommandAction(input: string) {
  const session = await auth();

  if (!session?.user) {
    return "Please sign in.";
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      workspaceId: true,
    },
  });

  if (!currentUser?.workspaceId) {
    return "Workspace not found.";
  }

  const context = await getWorkspaceAIContext({
    userId: session.user.id,
    workspaceId: currentUser.workspaceId,
  });

  const command = routeCommand(input);
  const insights = analyzeWorkspace(context);

  if (command === "workspace-summary") {
    return `Workspace Summary

Active projects: ${insights.counts.activeProjects}
Today's bookings: ${insights.counts.todaysBookings}
Upcoming bookings: ${insights.counts.upcomingBookings}
Unpaid invoices: ${insights.counts.unpaidInvoices}
Outstanding revenue: $${insights.money.unpaidInvoiceTotal.toLocaleString()}

Top priority:
${insights.topPriority}`;
  }

  if (command === "unpaid-invoices") {
    if (context.unpaidInvoices.length === 0) {
      return "No unpaid invoices found.";
    }

    return context.unpaidInvoices
      .map(
        (invoice) =>
          `${invoice.project.name}: $${invoice.amount.toLocaleString()}`,
      )
      .join("\n");
  }

  if (command === "todays-bookings") {
    if (context.todaysBookings.length === 0) {
      return "No bookings scheduled for today.";
    }

    return context.todaysBookings
      .map(
        (booking) =>
          `${booking.startTime} — ${booking.customerName} (${booking.service.name})`,
      )
      .join("\n");
  }

  if (command === "recent-messages") {
    if (context.recentMessages.length === 0) {
      return "No recent messages found.";
    }

    return context.recentMessages
      .map(
        (message) =>
          `${message.sender.firstName} ${message.sender.lastName} on ${message.project.name}: ${message.content}`,
      )
      .join("\n\n");
  }

  return "I can help summarize your workspace, show unpaid invoices, today's bookings, or recent messages.";
}
