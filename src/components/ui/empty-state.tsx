type Props = {
    title: string;
    description?: string;
    action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
            <p className="text-lg font-medium">{title}</p>

            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
                    {description}
                </p>
            )}

            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}