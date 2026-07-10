import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
    className?: string;
};

export function ExecutiveSection({
    eyebrow,
    title,
    description,
    actions,
    children,
    className,
}: Props) {
    return (
        <section className={clsx("space-y-6", className)}>
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    {eyebrow && (
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-primary">
                            {eyebrow}
                        </p>
                    )}

                    <h2 className="text-3xl font-light tracking-tight">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                            {description}
                        </p>
                    )}
                </div>

                {actions}
            </header>

            {children}
        </section>
    );
}