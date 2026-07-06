import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export function ClientCommandCenter({
    children,
}: Props) {
    return (
        <section className="space-y-8">
            {children}
        </section>
    );
}