import type { ReactNode } from "react";

type NavigationSectionProps = {
    title: string;
    children: ReactNode;
};

export function NavigationSection({
    title,
    children,
}: NavigationSectionProps) {
    return (
        <section>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                {title}
            </p>

            <div className="mt-2 space-y-1">
                {children}
            </div>
        </section>
    );
}