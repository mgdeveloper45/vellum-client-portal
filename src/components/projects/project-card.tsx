import Link from "next/link";
import { formatStatus } from "@/lib/utils";

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
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link href={`/projects/${id}`}>
                        <h2 className="text-xl font-medium hover:text-accent">
                            {name}
                        </h2>
                    </Link>
                    <p className="mt-1 text-sm text-foreground/60">{client}</p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs text-accent">
                    {formatStatus(status)}
                </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-foreground/70">
                {description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-foreground/60">
                    Due {dueDate}
                </span>

                <Link
                    href={`/projects/${id}/edit`}
                    className="text-sm text-accent"
                >
                    Edit Project
                </Link>
            </div>
        </div>
    );
}