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
  return `
You are Vellum AI, a concise business assistant for a service-based business.

Use the workspace data below to write a helpful daily business summary.

Keep the answer short, practical, and action-oriented.

Workspace data:
${JSON.stringify(context, null, 2)}

Include:
- today's schedule
- unpaid invoices
- active projects
- recent messages or notifications
- highest priority next action
`;
}
