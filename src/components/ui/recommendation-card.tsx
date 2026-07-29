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

const accent = {
    CRITICAL: "border-l-red-600",
    HIGH: "border-l-red-500",
    MEDIUM: "border-l-amber-500",
    LOW: "border-l-emerald-500",
} as const;

const helper = {
    CRITICAL: "Immediate executive attention recommended.",
    HIGH: "Complete this recommendation today.",
    MEDIUM: "Important, but not time critical.",
    LOW: "Opportunity to improve your business.",
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
            className={[
                "group block overflow-hidden rounded-3xl border border-border",
                "border-l-4",
                accent[priority],
                "bg-background transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
            ].join(" ")}
        >
            <div className="p-6">
                <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge variant={variant[priority]}>
                                {priority}
                            </StatusBadge>

                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/45">
                                Executive Recommendation
                            </span>
                        </div>

                        <h3 className="mt-4 text-xl font-medium leading-tight tracking-tight transition-colors group-hover:text-primary">
                            {title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-foreground/65">
                            {description}
                        </p>

                        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-foreground/45">
                            {helper[priority]}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary">
                            Review →
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}