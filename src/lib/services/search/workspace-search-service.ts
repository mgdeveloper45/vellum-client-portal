import { workspaceCommands } from "@/lib/commands";

import type { WorkspaceSearchRepository } from "./workspace-search-repository";

export type SearchResult = {
  id: string;
  type:
    | "ACTION"
    | "CLIENT"
    | "PROJECT"
    | "BOOKING"
    | "INVOICE"
    | "MESSAGE"
    | "SERVICE";
  title: string;
  subtitle: string;
  href: string;
};

export class WorkspaceSearchService {
  constructor(private readonly repository: WorkspaceSearchRepository) {}

  async execute(params: {
    workspaceId: string;
    query: string;
  }): Promise<SearchResult[]> {
    const search = params.query.trim();

    if (search.length < 2) {
      return [];
    }

    const lowerSearch = search.toLowerCase();

    const actions = workspaceCommands.filter((command) => {
      const searchText = `${command.title} ${command.subtitle}`.toLowerCase();

      return searchText.includes(lowerSearch);
    });

    const data = await this.repository.searchWorkspace({
      workspaceId: params.workspaceId,
      query: search,
    });

    return [
      ...actions,

      ...data.clients.map((client) => ({
        id: client.id,
        type: "CLIENT" as const,
        title: `${client.firstName} ${client.lastName}`,
        subtitle: client.email,
        href: `/clients/${client.id}`,
      })),

      ...data.projects.map((project) => ({
        id: project.id,
        type: "PROJECT" as const,
        title: project.name,
        subtitle: project.description,
        href: `/projects/${project.id}`,
      })),

      ...data.bookings.map((booking) => ({
        id: booking.id,
        type: "BOOKING" as const,
        title: booking.customerName,
        subtitle: `${booking.service.name} · ${booking.date.toLocaleDateString()} · ${booking.startTime}`,
        href: `/bookings/${booking.id}`,
      })),

      ...data.invoices.map((invoice) => ({
        id: invoice.id,
        type: "INVOICE" as const,
        title: `$${invoice.amount.toLocaleString()}`,
        subtitle: `${invoice.paid ? "Paid" : "Unpaid"} · ${invoice.project.name}`,
        href: `/projects/${invoice.projectId}`,
      })),

      ...data.messages.map((message) => ({
        id: message.id,
        type: "MESSAGE" as const,
        title: message.project.name,
        subtitle: message.content.slice(0, 90),
        href: `/projects/${message.projectId}`,
      })),

      ...data.services.map((service) => ({
        id: service.id,
        type: "SERVICE" as const,
        title: service.name,
        subtitle: `${service.duration} min · $${service.price}`,
        href: "/services",
      })),
    ];
  }
}
