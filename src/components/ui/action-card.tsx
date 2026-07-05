import Link from "next/link";

type Props = {
    title: string;
    description: string;
    href: string;
    priority?: string;
};

export function ActionCard({ title, description, href, priority }: Props) {
    return (
        <Link
            href={href}
            className="block rounded-2xl border border-border bg-background p-4 transition hover:border-accent hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-medium">{title}</p>

                    <p className="mt-2 text-sm text-foreground/60">
                        {description}
                    </p>
                </div>

                {priority && (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {priority}
                    </span>
                )}
            </div>
        </Link>
    );
}