import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";

const demoUsers = [
  {
    id: "user-marcus",
    name: "Marcus",
    email: "marcus@northstar-demo.com",
    role: "OWNER",
    status: "ACTIVE",
  },
  {
    id: "user-elena",
    name: "Elena Rodriguez",
    email: "elena@northstar-demo.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: "user-jordan",
    name: "Jordan Lee",
    email: "jordan@northstar-demo.com",
    role: "MANAGER",
    status: "ACTIVE",
  },
];

const roleDescriptions = {
  OWNER: "Full workspace and billing access",
  ADMIN: "Manage operations, clients, and team members",
  MANAGER: "Manage day-to-day client work",
} as const;

export default function DemoUsersPage() {
  return (
    <DemoShell>
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
            Team Members
          </h1>

          <p className="mt-3 max-w-3xl text-foreground/60">
            Manage the people who operate your workspace and control their
            level of access.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Team Members
            </p>

            <p className="mt-4 text-3xl font-light">
              {demoUsers.length}
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Active workspace users
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Administrators
            </p>

            <p className="mt-4 text-3xl font-light">
              {
                demoUsers.filter(
                  (user) =>
                    user.role === "OWNER" ||
                    user.role === "ADMIN",
                ).length
              }
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Elevated workspace access
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/50">
              Workspace Security
            </p>

            <p className="mt-4 text-3xl font-light">
              Active
            </p>

            <p className="mt-3 text-sm text-foreground/55">
              Role-based access enabled
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium">
                Workspace Team
              </h2>

              <p className="mt-1 text-sm text-foreground/50">
                People with access to Northstar Creative.
              </p>
            </div>

            <Link
              href="/sign-in"
              className="workspace-accent-button rounded-2xl px-5 py-3 text-center text-sm font-medium"
            >
              Invite Team Member
            </Link>
          </div>

          <div className="divide-y divide-border">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-medium">
                        {user.name}
                      </p>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                        {user.status}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-foreground/50">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-medium">
                    {user.role}
                  </p>

                  <p className="mt-1 text-sm text-foreground/50">
                    {
                      roleDescriptions[
                        user.role as keyof typeof roleDescriptions
                      ]
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Access Control
            </p>

            <h2 className="mt-3 text-2xl font-light">
              Keep workspace access organized
            </h2>

            <p className="mt-3 text-sm leading-6 text-foreground/60">
              Vellum roles help teams separate workspace ownership,
              administration, operational management, and client access.
            </p>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
            <p className="font-medium">
              Build your real team
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              In a live workspace, owners can invite team members and manage
              access to client and operational information.
            </p>

            <Link
              href="/sign-in"
              className="mt-4 inline-block text-sm font-medium workspace-accent-text"
            >
              Sign in to manage users →
            </Link>
          </div>
        </section>
      </div>
    </DemoShell>
  );
}
