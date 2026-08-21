"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

type DemoShellProps = {
    children: React.ReactNode;
};

const navigationGroups = [
    {
        title: "Home",
        items: [
            {
                label: "Executive Brief",
                href: "/demo",
            },
        ],
    },
    {
        title: "Operations",
        items: [
            { label: "Bookings", href: "/demo/bookings" },
            { label: "Availability", href: "/demo/availability" },
            { label: "Clients", href: "/demo/clients" },
            { label: "Projects", href: "/demo/projects" },
            { label: "Services", href: "/demo/services" },
            { label: "Messages", href: "/demo/messages" },
        ],
    },
    {
        title: "Finance",
        items: [
            { label: "Invoices", href: "/demo/invoices" },
            { label: "Proposals", href: "/demo/proposals" },
        ],
    },
    {
        title: "Intelligence",
        items: [
            { label: "Search", href: "/demo/search" },
            { label: "Notifications", href: "/demo/notifications" },
            { label: "Audit Logs", href: "/demo/audit-logs" },
        ],
    },
    {
        title: "Workspace",
        items: [
            { label: "Users", href: "/demo/users" },
            { label: "Workspace", href: "/demo/workspace" },
            { label: "Settings", href: "/demo/settings" },
        ],
    },
];

export function DemoShell({ children }: DemoShellProps) {
    const pathname = usePathname();

    return (
        <main
            className="min-h-screen bg-background text-foreground"
            style={
                {
                    "--workspace-accent": "#8B5CF6",
                } as React.CSSProperties
            }
        >
            <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
                <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-border bg-card p-6 md:block">
                    <div className="flex items-center gap-3 px-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-light text-primary">
                            V
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Vellum Demo
                            </p>

                            <p className="mt-1 text-xs text-foreground/45">
                                Executive Operating System
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Demo Mode
                        </p>

                        <p className="mt-3 text-sm font-medium">
                            Explore Vellum freely
                        </p>

                        <p className="mt-1 text-xs leading-5 text-foreground/45">
                            Demo actions do not affect a real workspace.
                        </p>
                    </div>

                    <nav className="mt-10 space-y-8">
                        {navigationGroups.map((group) => (
                            <div key={group.title}>
                                <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/40">
                                    {group.title}
                                </p>

                                <div className="space-y-2">
                                    {group.items.map((item) => {
                                        const isActive =
                                            pathname === item.href ||
                                            (item.href !== "/demo" &&
                                                pathname.startsWith(`${item.href}/`));

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "block rounded-xl px-4 py-3 text-sm transition hover:bg-muted",
                                                    isActive &&
                                                    "bg-muted workspace-accent-text",
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-8 border-t border-border/60 pt-5">
                        <div className="flex items-center justify-between gap-3">
                            <ThemeToggle />

                            <Link
                                href="/sign-in"
                                className="rounded-xl border border-border px-3 py-2 text-xs transition hover:bg-muted"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </aside>

                <section className="flex min-h-screen min-w-0 flex-col">
                    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-5 sm:px-6 lg:px-8">
                        <div>
                            <p className="workspace-accent-text text-sm">
                                Interactive Demo
                            </p>

                            <h2 className="text-xl font-medium">
                                Vellum Operations
                            </h2>
                        </div>

                        <Link
                            href="/sign-in"
                            className="workspace-accent-button rounded-full px-5 py-2 text-sm font-medium"
                        >
                            Get Started
                        </Link>
                    </header>

                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}