import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoAuditEvents } from "@/lib/demo/demo-data";

export default function DemoAuditLogsPage() {
  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Workspace Governance
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Audit Logs
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Review important workspace activity and maintain a clear record
            of changes across client work.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Recent Events
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoAuditEvents.length}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Visible in this demo
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Activity Tracking
            </p>

            <p className="mt-4 text-3xl font-light">
              On
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Workspace events recorded
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Visibility
            </p>

            <p className="mt-4 text-3xl font-light">
              Clear
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Operational history available
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-medium">
              Workspace History
            </h2>

            <p className="mt-1 text-sm text-foreground/50">
              A chronological view of recent workspace changes.
            </p>
          </div>

          <div className="divide-y divide-border">
            {demoAuditEvents.map((event) => (
              <article
                key={event.id}
                className="grid gap-4 px-6 py-6 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-medium">
                      {event.action}
                    </h3>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/60">
                      {event.subject}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-foreground/55">
                    Performed by {event.actor}
                  </p>
                </div>

                <p className="text-sm text-foreground/45">
                  {event.timeLabel}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Accountability
            </p>

            <h2 className="mt-3 text-2xl font-light">
              Know what changed
            </h2>

            <p className="mt-3 text-sm leading-6 text-foreground/60">
              Audit history helps teams understand when important project,
              financial, and client activity occurred.
            </p>

            <Link
              href="/demo/projects"
              className="mt-5 inline-block text-sm font-medium workspace-accent-text"
            >
              Explore projects →
            </Link>
          </section>

          <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
            <p className="font-medium">
              Full history in your workspace
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              Sign in to Vellum to manage real client work with a persistent
              activity history connected to your workspace.
            </p>

            <Link
              href="/sign-in"
              className="mt-5 inline-block text-sm font-medium workspace-accent-text"
            >
              Start using Vellum →
            </Link>
          </section>
        </div>
      </div>
    </DemoShell>
  );
}
