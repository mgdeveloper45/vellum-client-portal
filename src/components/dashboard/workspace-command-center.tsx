import type { ReactNode } from "react";

type WorkspaceCommandCenterProps = {
    children: ReactNode;
};

export function WorkspaceCommandCenter({
    children,
}: WorkspaceCommandCenterProps) {
    return (
        <section className="space-y-8">
            {children}
        </section>
    );
}