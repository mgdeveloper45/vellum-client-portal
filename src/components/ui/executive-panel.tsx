import clsx from "clsx";
import type { ReactNode } from "react";

import {
    executiveRadius,
    executiveShadow,
} from "./executive-design";

type Props = {
    children: ReactNode;
    className?: string;
};

export function ExecutivePanel({
    children,
    className,
}: Props) {
    return (
        <section
            className={clsx(
                executiveRadius.panel,
                executiveShadow.panel,
                "border border-border bg-card",
                className,
            )}
        >
            {children}
        </section>
    );
}