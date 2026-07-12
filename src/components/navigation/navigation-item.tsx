import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type NavigationItemProps = {
    href: string;
    label: string;
    icon?: ReactNode;
    trailing?: ReactNode;
    active?: boolean;
    onNavigate?: () => void;
};

export function NavigationItem({
    href,
    label,
    icon,
    trailing,
    active = false,
    onNavigate,
}: NavigationItemProps) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={clsx(
                "group flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
                    : "text-foreground/65 hover:bg-muted hover:text-foreground",
            )}
        >
            <span className="flex min-w-0 items-center gap-3">
                {icon && (
                    <span
                        className={clsx(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-sm transition",
                            active
                                ? "border-primary/20 bg-primary/10 text-primary"
                                : "border-border/60 bg-background/50 text-foreground/50 group-hover:text-foreground",
                        )}
                    >
                        {icon}
                    </span>
                )}

                <span className="truncate font-medium">
                    {label}
                </span>
            </span>

            {trailing && (
                <span className="shrink-0">
                    {trailing}
                </span>
            )}
        </Link>
    );
}