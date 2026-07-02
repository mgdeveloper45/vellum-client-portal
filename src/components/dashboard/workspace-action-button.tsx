"use client";

import { useRouter } from "next/navigation";

type WorkspaceActionButtonProps = {
    href: string;
    children: React.ReactNode;
};

export function WorkspaceActionButton({
    href,
    children,
}: WorkspaceActionButtonProps) {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.push(href)}
            className="workspace-accent-button rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90"
        >
            {children}
        </button>
    );
}