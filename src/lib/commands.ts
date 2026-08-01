import type { SearchResult } from "@/lib/services/search/workspace-search-service";

export const workspaceCommands: SearchResult[] = [
  {
    id: "new-booking",
    type: "ACTION",
    title: "New Booking",
    subtitle: "Create a new booking",
    href: "/bookings",
  },
  {
    id: "new-project",
    type: "ACTION",
    title: "New Project",
    subtitle: "Create a new project",
    href: "/projects/new",
  },
  {
    id: "new-client",
    type: "ACTION",
    title: "New Client",
    subtitle: "Add a client",
    href: "/clients/new",
  },
  {
    id: "view-invoices",
    type: "ACTION",
    title: "View Invoices",
    subtitle: "Open invoice records",
    href: "/invoices",
  },
  {
    id: "calendar",
    type: "ACTION",
    title: "Open Calendar",
    subtitle: "Go to bookings calendar",
    href: "/bookings",
  },
  {
    id: "ai-command-center",
    type: "ACTION",
    title: "AI Command Center",
    subtitle: "Ask Vellum to analyze your workspace",
    href: "/ai/command-center",
  },
  {
    id: "ai-workspace-summary",
    type: "ACTION",
    title: "Workspace Summary",
    subtitle: "Generate an AI-powered workspace summary",
    href: "/dashboard",
  },
  {
    id: "ai-invoice-reminders",
    type: "ACTION",
    title: "Draft Invoice Reminders",
    subtitle: "Generate AI reminder drafts for unpaid invoices",
    href: "/invoices",
  },
  {
    id: "ai-todays-bookings",
    type: "ACTION",
    title: "Today's Bookings",
    subtitle: "Review today's booking schedule",
    href: "/bookings",
  },
];
