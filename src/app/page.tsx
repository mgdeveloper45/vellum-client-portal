import { ThemeToggle } from "@/components/shared/theme-toggle";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-accent">
              Vellum
            </p>
            <h1 className="mt-2 text-3xl font-light">Client Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in">
              <button className="rounded-full border border-border px-5 py-2 text-sm text-foreground">
                Sign in
              </button>
            </Link>
            <Link href="/projects">
              <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-accent">
              Elegant project management
            </p>

            <h2 className="max-w-2xl text-5xl font-light leading-tight md:text-7xl">
              A polished home for client work, approvals, files, and trust.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
              Vellum gives creative teams and service businesses a refined
              client portal to manage projects, proposals, messages,
              milestones, invoices, and deliverables.
            </p>

            <div className="mt-10 flex gap-4">
              <button className="rounded-full bg-foreground px-6 py-3 font-medium text-background">
                Start Portal
              </button>
              <button className="rounded-full border border-border px-6 py-3 text-foreground">
                View Demo
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-2xl">
            <div className="rounded-[1.5rem] border border-border bg-background p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">
                Project Overview
              </p>

              <div className="mt-8 space-y-5">
                {["Brand Discovery", "Website Design", "Client Approval", "Final Delivery"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
                    >
                      <div>
                        <p className="text-foreground">{item}</p>
                        <p className="text-sm text-foreground/60">
                          Phase {index + 1}
                        </p>
                      </div>

                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-accent">
                        Active
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}