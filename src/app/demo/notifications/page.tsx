import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoNotifications } from "@/lib/demo/demo-data";

export default function DemoNotificationsPage() {
  const unreadCount = demoNotifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Workspace Activity
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Notifications
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Stay informed about client activity, upcoming work, payments,
            and important changes across your workspace.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Unread
            </p>

            <p className="mt-4 text-3xl font-light">
              {unreadCount}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Require your attention
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Total
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoNotifications.length}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Recent notifications
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Workspace Status
            </p>

            <p className="mt-4 text-3xl font-light">
              Active
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Monitoring client activity
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-xl font-medium">
              Recent Notifications
            </h2>

            <p className="mt-1 text-sm text-foreground/50">
              Important updates from across the demo workspace.
            </p>
          </div>

          <div className="divide-y divide-border">
            {demoNotifications.map((notification) => (
              <article
                key={notification.id}
                className="flex gap-4 px-6 py-6"
              >
                <div className="pt-2">
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      notification.read
                        ? "bg-foreground/20"
                        : "bg-primary"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-medium">
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-foreground/60">
                    {notification.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">
              Keep every client workflow visible
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60">
              A live Vellum workspace automatically surfaces activity that
              needs attention so important client work does not get lost.
            </p>
          </div>

          <Link
            href="/demo"
            className="shrink-0 text-sm font-medium workspace-accent-text"
          >
            Back to command center →
          </Link>
        </section>
      </div>
    </DemoShell>
  );
}
