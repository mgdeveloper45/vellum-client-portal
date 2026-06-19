import Link from "next/link";

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
        <Link href={`/projects/${id}`}>
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-medium">{name}</h2>
                        <p className="mt-1 text-sm text-foreground/60">{client}</p>
                    </div>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-accent">
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                    </span>
                </div>

                <p className="mt-5 text-sm leading-6 text-foreground/70">
                    {description}
                </p>

                <div className="mt-6 border-t border-border pt-4 text-sm text-foreground/60">
                    Due {dueDate}
                </div>
            </div>
        </Link>
    );
}