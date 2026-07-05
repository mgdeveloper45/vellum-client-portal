import Link from "next/link";
import type { ExecutiveInboxItem } from "@/lib/services/intelligence/executive-inbox";

type Props = {
    items: ExecutiveInboxItem[];
};

const priorityStyles = {
    CRITICAL: {
        dot: "bg-red-600",
        badge: "bg-red-100 text-red-700",
    },
    HIGH: {
        dot: "bg-red-500",
        badge: "bg-red-50 text-red-600",
    },
    MEDIUM: {
        dot: "bg-yellow-500",
        badge: "bg-yellow-50 text-yellow-700",
    },
    LOW: {
        dot: "bg-green-500",
        badge: "bg-green-50 text-green-700",
    },
};

export function ExecutiveInboxCard({
    items,
}: Props) {
    return (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">
                        Executive Inbox
                    </p>

                    <h2 className="mt-2 text-3xl font-light">
                        Prioritized Work
                    </h2>
                </div>

                <div className="rounded-full border border-border bg-background px-4 py-2 text-sm">
                    {items.length} Items
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {items.map((item) => {
                    const style = priorityStyles[item.priority];

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="block rounded-2xl border border-border bg-background p-5 transition hover:border-accent hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3">
                                    <div
                                        className={`mt-2 h-3 w-3 rounded-full ${style.dot}`}
                                    />

                                    <div>
                                        <h3 className="font-medium">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-foreground/65">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}
                                >
                                    {item.priority}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}