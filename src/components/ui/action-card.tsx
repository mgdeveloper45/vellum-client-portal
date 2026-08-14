import Link from "next/link";

type Props = {
    title: string;
    description: string;
    href: string | null;
    priority?: string;
};

function CardContent({
    title,
    description,
    priority,
}: Omit<Props, "href">) {
    return (
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
    );
}

export function ActionCard({
    title,
    description,
    href,
    priority,
}: Props) {
    const className =
        "block rounded-2xl border border-border bg-background p-4";

    if (!href) {
        return (
            <div className={className}>
                <CardContent
                    title={title}
                    description={description}
                    priority={priority}
                />
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`${className} transition hover:border-accent hover:shadow-md`}
        >
            <CardContent
                title={title}
                description={description}
                priority={priority}
            />
        </Link>
    );
}
