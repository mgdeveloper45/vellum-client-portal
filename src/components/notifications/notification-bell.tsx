import Link from "next/link";

type NotificationBellProps = {
    unreadCount: number;
};

export function NotificationBell({ unreadCount }: NotificationBellProps) {
    return (
        <Link
            href="/notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition hover:bg-muted"
            aria-label="Open notifications"
        >
            <span
                aria-hidden="true"
                className="text-lg"
            >
                🔔
            </span>

            {unreadCount > 0 && (
                <span
                    aria-label={`${unreadCount} unread notifications`}
                    className="workspace-accent-bg absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white"
                >
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Link>
    );
}