import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import { demoWorkspace } from "@/lib/demo/demo-data";

export default function DemoSettingsPage() {
  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Configure workspace identity, branding, notifications, security,
            and subscription preferences.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="h-fit rounded-3xl border border-border bg-card p-4">
            {[
              {
                label: "General",
                description: "Workspace identity",
              },
              {
                label: "Branding",
                description: "Logo and appearance",
              },
              {
                label: "Notifications",
                description: "Workspace alerts",
              },
              {
                label: "Security",
                description: "Access and protection",
              },
              {
                label: "Billing",
                description: "Plan and subscription",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`rounded-2xl px-4 py-4 ${
                  index === 0
                    ? "bg-primary/10"
                    : ""
                }`}
              >
                <p
                  className={
                    index === 0
                      ? "font-medium text-primary"
                      : "font-medium"
                  }
                >
                  {item.label}
                </p>

                <p className="mt-1 text-sm text-foreground/45">
                  {item.description}
                </p>
              </div>
            ))}
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                General
              </p>

              <h2 className="mt-3 text-2xl font-light">
                Workspace Details
              </h2>

              <p className="mt-2 text-sm leading-6 text-foreground/55">
                These details identify your business throughout the workspace
                and client experience.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    Workspace name
                  </label>

                  <div className="mt-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm">
                    {demoWorkspace.name}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Company name
                  </label>

                  <div className="mt-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm">
                    {demoWorkspace.companyName}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Workspace status
                  </label>

                  <div className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <span className="text-sm">
                      Active workspace
                    </span>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Branding
              </p>

              <h2 className="mt-3 text-2xl font-light">
                Client-facing identity
              </h2>

              <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-medium text-primary-foreground">
                  NC
                </div>

                <div>
                  <p className="font-medium">
                    {demoWorkspace.companyName}
                  </p>

                  <p className="mt-1 text-sm text-foreground/50">
                    Workspace branding appears throughout the client
                    experience.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium">
                  Accent color
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary" />

                  <div className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground/60">
                    Workspace Accent
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Security
                </p>

                <h2 className="mt-3 text-xl font-light">
                  Role-based access
                </h2>

                <p className="mt-3 text-sm leading-6 text-foreground/60">
                  Control workspace access using owner, administrator,
                  manager, and client roles.
                </p>

                <Link
                  href="/demo/users"
                  className="mt-5 inline-block text-sm font-medium workspace-accent-text"
                >
                  Explore team access →
                </Link>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Subscription
                </p>

                <h2 className="mt-3 text-xl font-light">
                  Professional
                </h2>

                <p className="mt-3 text-sm leading-6 text-foreground/60">
                  Advanced analytics, workspace intelligence, branding, and
                  professional operational tools.
                </p>

                <Link
                  href="/sign-in"
                  className="mt-5 inline-block text-sm font-medium workspace-accent-text"
                >
                  Manage a live subscription →
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
              <p className="font-medium">
                Demo settings are read-only
              </p>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                This preview shows how workspace configuration is organized.
                Sign in to configure branding, security, notifications, and
                business settings in your own Vellum workspace.
              </p>

              <Link
                href="/sign-in"
                className="mt-4 inline-block text-sm font-medium workspace-accent-text"
              >
                Start using Vellum →
              </Link>
            </section>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
