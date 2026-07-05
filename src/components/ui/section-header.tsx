type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export function SectionHeader({
    eyebrow,
    title,
    description,
}: Props) {
    return (
        <div>
            {eyebrow && (
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {eyebrow}
                </p>
            )}

            <h2 className="mt-2 text-3xl font-light">
                {title}
            </h2>

            {description && (
                <p className="mt-3 text-foreground/65">
                    {description}
                </p>
            )}
        </div>
    );
}