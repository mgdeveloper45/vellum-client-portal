import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import {
  demoBookings,
  demoClients,
  demoInvoices,
  demoProjects,
  demoProposals,
  demoServices,
} from "@/lib/demo/demo-data";

export default function DemoSearchPage() {
  const results = [
    ...demoClients.map((client) => ({
      id: client.id,
      type: "Client",
      title: `${client.firstName} ${client.lastName}`,
      description: client.company,
      href: `/demo/clients/${client.id}`,
    })),

    ...demoProjects.map((project) => ({
      id: project.id,
      type: "Project",
      title: project.name,
      description: project.clientName,
      href: `/demo/projects/${project.id}`,
    })),

    ...demoBookings.map((booking) => ({
      id: booking.id,
      type: "Booking",
      title: booking.serviceName,
      description: `${booking.customerName} · ${booking.dateLabel}`,
      href: `/demo/bookings/${booking.id}`,
    })),

    ...demoInvoices.map((invoice) => ({
      id: invoice.id,
      type: "Invoice",
      title: invoice.id,
      description: `${invoice.clientName} · ${invoice.projectName}`,
      href: `/demo/invoices/${invoice.id}`,
    })),

    ...demoProposals.map((proposal) => ({
      id: proposal.id,
      type: "Proposal",
      title: proposal.projectName,
      description: proposal.clientName,
      href: "/demo/proposals",
    })),

    ...demoServices.map((service) => ({
      id: service.id,
      type: "Service",
      title: service.name,
      description: `${service.duration} · ${service.price.toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        },
      )}`,
      href: "/demo/services",
    })),
  ];

  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Workspace Search
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Find clients, projects, bookings, invoices, proposals, and services
            across the demo workspace.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <span className="text-foreground/40">
              ⌕
            </span>

            <input
              type="search"
              placeholder="Search the demo workspace..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
            />

            <span className="hidden rounded-lg border border-border px-2 py-1 text-xs text-foreground/40 sm:inline">
              Demo
            </span>
          </div>

          <p className="mt-3 text-xs text-foreground/45">
            Browse representative results below. Live workspace search uses
            your actual client and operational data.
          </p>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium">
                Searchable Workspace
              </h2>

              <p className="mt-1 text-sm text-foreground/50">
                {results.length} demo records across the workspace
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Clients",
                "Projects",
                "Bookings",
                "Invoices",
                "Proposals",
                "Services",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground/55"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="divide-y divide-border">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {result.type}
                      </span>

                      <p className="font-medium">
                        {result.title}
                      </p>
                    </div>

                    <p className="mt-2 truncate text-sm text-foreground/50">
                      {result.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-medium workspace-accent-text">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              Search everything from one place
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60">
              In a live Vellum workspace, search helps you quickly locate
              client relationships, active work, financial records, bookings,
              and services.
            </p>
          </div>

          <Link
            href="/sign-in"
            className="shrink-0 text-sm font-medium workspace-accent-text"
          >
            Start using Vellum →
          </Link>
        </section>
      </div>
    </DemoShell>
  );
}
