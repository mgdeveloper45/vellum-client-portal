"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Messages", href: "/messages" },
    { label: "Proposals", href: "/proposals" },
    { label: "Invoices", href: "/invoices" },
    { label: "Settings", href: "/settings" },
    { label: "Clients", href: "/clients" },
    { label: "Search", href: "/search" },
    { label: "Notifications", href: "/notifications" },
    { label: "Users", href: "/users" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
                <aside className="border-r border-border bg-card p-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-accent">
                        Vellum
                    </p>
                    <h1 className="mt-2 text-2xl font-light">Client Portal</h1>

                    <nav className="mt-10 space-y-2">
                        {navItems.map((item) => {
                            const isActive =
                                pathname === item.href || pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block rounded-xl px-4 py-3 text-sm transition hover:bg-muted",
                                        isActive && "bg-muted text-accent"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <section className="flex min-h-screen flex-col">
                    <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
                        <div>
                            <p className="text-sm text-accent">Workspace</p>
                            <h2 className="text-xl font-medium">Client Operations</h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <SignOutButton />
                        </div>

                    </header>

                    <div className="flex-1 p-8">{children}</div>
                </section>
            </div>
        </main>
    );
}