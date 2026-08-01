import Link from "next/link";

type ProjectHeaderProps = {
    name: string;
    description: string;
};

export function ProjectHeader({
    name,
    description,
}: ProjectHeaderProps) {
    return (
        <>
            <Link
                href="/projects"
                className="text-sm text-accent"
            >
                ← Back to Projects
            </Link>

            <header className="mt-6">
                <h1 className="text-4xl font-light">
                    {name}
                </h1>

                <p className="mt-4 text-foreground/70">
                    {description}
                </p>
            </header>
        </>
    );
}