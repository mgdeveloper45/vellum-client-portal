"use client";

import { useRouter } from "next/navigation";
import { markNotificationReadAction } from "@/actions/notification-actions";

type NotificationLinkCardProps = {
    id: string;
    title: string;
    message: string;
    href: string | null;
    read: boolean;
    createdAt: string;
};

export function NotificationLinkCard({
    id,
    title,
    message,
    href,
    read,
    createdAt,
}: NotificationLinkCardProps) {
    const router = useRouter();

    async function handleClick() {
        if (!read) {
            const formData = new FormData();
            formData.append("notificationId", id);

            await markNotificationReadAction(formData);
        }

        router.push(href || "/notifications");
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${read ? "border-border bg-card" : "border-accent bg-muted"
                }`}
        >
            <p className="font-medium">{title}</p>

            <p className="mt-1 text-xs uppercase tracking-wide text-foreground/40">
                {read ? "Read" : "Unread"}
            </p>

            <p className="mt-2 text-sm text-foreground/70">{message}</p>

            <p className="mt-3 text-xs text-foreground/50">{createdAt}</p>
        </button>
    );
}