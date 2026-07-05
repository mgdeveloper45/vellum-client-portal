import type { ReactNode } from "react";
import clsx from "clsx";

type CommandCardProps = {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

export function CommandCard({
    title,
    subtitle,
    actions,
    children,
    className,
}: CommandCardProps) {
    return (
        <section
            className={clsx(
                "rounded-3xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-lg",
                className,
            )}
        >
            {(title || actions) && (
                <header className="flex items-start justify-between gap-4 border-b border-border/50 p-6">
                    <div>
                        {title && (
                            <h2 className="text-2xl font-light">
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p className="mt-2 text-sm text-foreground/60">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions}
                </header>
            )}

            <div className="p-6">
                {children}
            </div>
        </section>
    );
}