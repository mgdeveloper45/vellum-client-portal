"use client";

import { useEffect, useState } from "react";

export function NotificationNavBadge() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchUnreadCount() {
            const response = await fetch("/api/notifications/unread-count");
            const data = await response.json();

            setCount(data.count);
        }

        fetchUnreadCount();
    }, []);

    if (count === 0) {
        return null;
    }

    return (
        <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-black">
            {count}
        </span>
    );
}