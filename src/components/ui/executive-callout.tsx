import { cn } from "@/lib/utils";

type Props = {
    title: string;
    description: string;
    className?: string;
};

export function ExecutiveCallout({
    title,
    description,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-primary/20 bg-primary/[0.04] p-6",
                className,
            )}
        >
            <h3 className="text-lg font-medium">
                {title}
            </h3>

            <p className="mt-3 leading-7 text-foreground/70">
                {description}
            </p>
        </div>
    );
}