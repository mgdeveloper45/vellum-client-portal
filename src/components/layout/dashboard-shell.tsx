"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NotificationNavBadge } from "@/components/notifications/notification-nav-badge";

type DashboardShellProps = {
    children: React.ReactNode;
    accentColor?: string | null;
    companyName?: string | null;
    logoImageUrl?: string | null;
};

const navigationGroups = [
    {
        title: "Home",
        items: [
            {
                label: "Executive Brief",
                href: "/dashboard",
            },
        ],
    },

    {
        title: "Operations",
        items: [
            {
                label: "Bookings",
                href: "/bookings",
            },
            {
                label: "Availability",
                href: "/availability",
            },
            {
                label: "Clients",
                href: "/clients",
            },
            {
                label: "Projects",
                href: "/projects",
            },
            {
                label: "Services",
                href: "/services",
            },
            {
                label: "Messages",
                href: "/messages",
            },
        ],
    },

    {
        title: "Finance",
        items: [
            {
                label: "Invoices",
                href: "/invoices",
            },
            {
                label: "Proposals",
                href: "/proposals",
            },
        ],
    },

    {
        title: "Intelligence",
        items: [
            {
                label: "Search",
                href: "/search",
            },
            {
                label: "Notifications",
                href: "/notifications",
            },
            {
                label: "Audit Logs",
                href: "/audit-logs",
            },
        ],
    },

    {
        title: "Workspace",
        items: [
            {
                label: "Users",
                href: "/users",
            },
            {
                label: "Workspace",
                href: "/workspace",
            },
            {
                label: "Settings",
                href: "/settings",
            },
        ],
    },
];

export function DashboardShell({
    children,
    companyName,
    logoImageUrl,
    accentColor,
}: DashboardShellProps) {
    const pathname = usePathname();
    const displayName = companyName || "Vellum";

    return (
        <main
            className="min-h-screen bg-background text-foreground"
            style={
                {
                    "--workspace-accent": accentColor || "#8B5CF6",
                } as React.CSSProperties
            }
        >
            <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
                <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-border bg-card p-6 md:block">
                    <div className="flex items-center gap-3 px-1">
                        {logoImageUrl ? (
                            <Image
                                src={logoImageUrl}
                                alt={displayName}
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-2xl border border-border/60 object-cover"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-lg font-light text-primary">
                                {displayName.slice(0, 1).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {displayName}
                            </p>

                            <p className="mt-1 text-xs text-foreground/45">
                                Executive Operating System
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/[0.05] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                            Workspace Status
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium">
                                    Operating normally
                                </p>

                                <p className="mt-1 text-xs text-foreground/45">
                                    Systems ready
                                </p>
                            </div>

                            <span className="flex items-center gap-2 text-xs text-foreground/50">
                                <span
                                    aria-hidden="true"
                                    className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)]"
                                />
                                <span className="sr-only">Workspace healthy</span>
                            </span>
                        </div>
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
                                            pathname.startsWith(`${item.href}/`);

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
                                                <span>
                                                    {item.label}

                                                    {item.href === "/notifications" && (
                                                        <NotificationNavBadge />
                                                    )}
                                                </span>
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
                            <SignOutButton />
                        </div>
                    </div>
                </aside>

                <section className="flex min-h-screen min-w-0 flex-col">
                    <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
                        <div>
                            <p className="workspace-accent-text text-sm">
                                Executive Workspace
                            </p>

                            <h2 className="text-xl font-medium">
                                {displayName} Operations
                            </h2>
                        </div>
                    </header>

                    <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}