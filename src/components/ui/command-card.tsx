import type { ReactNode } from "react";
import clsx from "clsx";

type CommandCardProps = {
    title?: string;
    subtitle?: string;
    eyebrow?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

export function CommandCard({
    title,
    subtitle,
    eyebrow,
    actions,
    children,
    className,
}: CommandCardProps) {
    return (
        <section
            className={clsx(
                "overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg",
                className,
            )}
        >
            {(title || subtitle || eyebrow || actions) && (
                <header className="flex items-start justify-between gap-4 border-b border-border/50 p-6">
                    <div>
                        {eyebrow && (
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-primary">
                                {eyebrow}
                            </p>
                        )}

                        {title && (
                            <h2 className="text-2xl font-light tracking-tight">
                                {title}
                            </h2>
                        )}

                        {subtitle && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions}
                </header>
            )}

            <div className="p-6">{children}</div>
        </section>
    );
}