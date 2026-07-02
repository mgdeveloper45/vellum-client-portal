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

export function analyzeWorkspace(context: WorkspaceAIContext) {
  const unpaidInvoiceTotal = context.unpaidInvoices.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );

  const hasBookingsToday = context.todaysBookings.length > 0;
  const hasUnpaidInvoices = context.unpaidInvoices.length > 0;
  const hasUnreadNotifications = context.unreadNotifications.length > 0;
  const hasRecentMessages = context.recentMessages.length > 0;

  const priorities: string[] = [];

  if (hasUnpaidInvoices) {
    priorities.push(
      `Follow up on ${context.unpaidInvoices.length} unpaid invoice${
        context.unpaidInvoices.length === 1 ? "" : "s"
      } totaling $${unpaidInvoiceTotal.toLocaleString()}.`,
    );
  }

  if (hasBookingsToday) {
    priorities.push(
      `Prepare for ${context.todaysBookings.length} booking${
        context.todaysBookings.length === 1 ? "" : "s"
      } scheduled today.`,
    );
  }

  if (hasUnreadNotifications) {
    priorities.push(
      `Review ${context.unreadNotifications.length} unread notification${
        context.unreadNotifications.length === 1 ? "" : "s"
      }.`,
    );
  }

  if (hasRecentMessages) {
    priorities.push(
      `Check recent client messages across ${context.recentMessages.length} conversation${
        context.recentMessages.length === 1 ? "" : "s"
      }.`,
    );
  }

  if (priorities.length === 0) {
    priorities.push("No urgent business issues detected right now.");
  }

  return {
    counts: {
      activeProjects: context.activeProjects.length,
      todaysBookings: context.todaysBookings.length,
      upcomingBookings: context.upcomingBookings.length,
      unpaidInvoices: context.unpaidInvoices.length,
      unreadNotifications: context.unreadNotifications.length,
      recentMessages: context.recentMessages.length,
    },
    money: {
      unpaidInvoiceTotal,
    },
    priorities,
    topPriority: priorities[0],
  };
}
