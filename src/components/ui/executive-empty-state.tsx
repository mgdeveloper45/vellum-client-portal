import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function ExecutiveEmptyState({
    title,
    description,
    icon,
    action,
    className,
}: Props) {
    return (
        <div
            className={clsx(
                "flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 px-8 py-12 text-center",
                className,
            )}
        >
            {icon && (
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
                    {icon}
                </div>
            )}

            <h3 className="text-2xl font-light tracking-tight">
                {title}
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-foreground/60">
                {description}
            </p>

            {action && (
                <div className="mt-8">
                    {action}
                </div>
            )}
        </div>
    );
}