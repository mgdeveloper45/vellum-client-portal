import Link from "next/link";
import { StatusBadge } from "./status-badge";
import type { Priority } from "@/lib/services/intelligence/priority";

type Props = {
    title: string;
    description: string;
    href: string;
    priority: Priority;
};

const variant = {
    CRITICAL: "danger",
    HIGH: "danger",
    MEDIUM: "warning",
    LOW: "success",
} as const;

export function RecommendationCard({
    title,
    description,
    href,
    priority,
}: Props) {
    return (
        <Link
            href={href}
            className="block rounded-2xl border border-border bg-background p-5 transition hover:border-accent hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-medium">
                        {title}
                    </h3>

                    <p className="mt-2 text-sm text-foreground/60">
                        {description}
                    </p>
                </div>

                <StatusBadge variant={variant[priority]}>
                    {priority}
                </StatusBadge>
            </div>
        </Link>
    );
}