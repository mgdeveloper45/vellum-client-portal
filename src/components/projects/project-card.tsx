import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatStatus } from "@/lib/utils";
import { getProjectStatusVariant } from "@/lib/project-status";

type ProjectCardProps = {
    id: string;
    name: string;
    client: string;
    status: "PLANNING" | "ACTIVE" | "REVIEW" | "COMPLETED";
    dueDate: string;
    description: string;
};

export function ProjectCard({
    id,
    name,
    client,
    status,
    dueDate,
    description,
}: ProjectCardProps) {
    return (
        <article className="group rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            <Link
                href={`/projects/${id}`}
                className="block p-6"
                aria-label={`View project ${name}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-medium transition-colors group-hover:text-primary">
                            {name}
                        </h2>

                        <p className="mt-1 truncate text-sm text-foreground/60">
                            {client}
                        </p>
                    </div>

                    <StatusBadge
                        variant={getProjectStatusVariant(status)}
                    >
                        {formatStatus(status)}
                    </StatusBadge>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-foreground/70">
                    {description || "No project description yet."}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-foreground/60">
                        {dueDate === "No due date yet"
                            ? "No due date"
                            : `Due ${dueDate}`}
                    </span>

                    <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                        View Project →
                    </span>
                </div>
            </Link>

            <div className="border-t border-border px-6 py-3">
                <Link
                    href={`/projects/${id}/edit`}
                    className="text-sm text-accent hover:underline"
                >
                    Edit Project
                </Link>
            </div>
        </article>
    );
}