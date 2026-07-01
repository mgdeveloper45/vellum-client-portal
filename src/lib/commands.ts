import type { SearchResult } from "@/actions/search-actions";

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
];