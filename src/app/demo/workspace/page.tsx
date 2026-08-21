import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import {
  demoBookings,
  demoClients,
  demoInvoices,
  demoProjects,
  demoWorkspace,
} from "@/lib/demo/demo-data";

export default function DemoWorkspacePage() {
  const outstandingRevenue = demoInvoices
    .filter((invoice) => invoice.status !== "PAID")
    .reduce((total, invoice) => total + invoice.amount, 0);

  const activeProjects = demoProjects.filter(
    (project) => project.status === "ACTIVE",
  ).length;

  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            {demoWorkspace.companyName}
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Review the business workspace that connects clients, projects,
            bookings, financial activity, and team operations.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Workspace Health
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoWorkspace.healthScore}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Strong operating health
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Clients
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoClients.length}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Active relationships
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Active Projects
            </p>

            <p className="mt-4 text-3xl font-light">
              {activeProjects}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Client work in progress
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Outstanding
            </p>

            <p className="mt-4 text-3xl font-light">
              {outstandingRevenue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Revenue to collect
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Business Profile
            </p>

            <h2 className="mt-3 text-2xl font-light">
              Workspace identity
            </h2>

            <div className="mt-8 divide-y divide-border">
              <div className="flex flex-col gap-2 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Workspace Name
                </p>

                <p className="font-medium">
                  {demoWorkspace.name}
                </p>
              </div>

              <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Company
                </p>

                <p className="font-medium">
                  {demoWorkspace.companyName}
                </p>
              </div>

              <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Workspace Status
                </p>

                <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                  ACTIVE
                </span>
              </div>

              <div className="flex flex-col gap-2 py-5 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground/50">
                  Plan
                </p>

                <p className="font-medium">
                  Professional
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Operations
              </p>

              <h2 className="mt-3 text-2xl font-light">
                Connected workspace
              </h2>

              <div className="mt-6 space-y-4">
                <Link
                  href="/demo/clients"
                  className="flex items-center justify-between rounded-2xl border border-border p-4 transition hover:bg-muted/50"
                >
                  <span>Clients</span>
                  <span className="text-sm workspace-accent-text">
                    {demoClients.length} →
                  </span>
                </Link>

                <Link
                  href="/demo/projects"
                  className="flex items-center justify-between rounded-2xl border border-border p-4 transition hover:bg-muted/50"
                >
                  <span>Projects</span>
                  <span className="text-sm workspace-accent-text">
                    {demoProjects.length} →
                  </span>
                </Link>

                <Link
                  href="/demo/bookings"
                  className="flex items-center justify-between rounded-2xl border border-border p-4 transition hover:bg-muted/50"
                >
                  <span>Bookings</span>
                  <span className="text-sm workspace-accent-text">
                    {demoBookings.length} →
                  </span>
                </Link>

                <Link
                  href="/demo/invoices"
                  className="flex items-center justify-between rounded-2xl border border-border p-4 transition hover:bg-muted/50"
                >
                  <span>Invoices</span>
                  <span className="text-sm workspace-accent-text">
                    {demoInvoices.length} →
                  </span>
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
              <p className="font-medium">
                Make Vellum your own
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/60">
                Live workspaces can configure company identity, branding,
                team access, operational settings, and subscription features.
              </p>

              <Link
                href="/demo/settings"
                className="mt-4 inline-block text-sm font-medium workspace-accent-text"
              >
                Explore workspace settings →
              </Link>
            </section>
          </div>
        </section>
      </div>
    </DemoShell>
  );
}
