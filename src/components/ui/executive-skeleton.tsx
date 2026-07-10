import clsx from "clsx";

type Props = {
    className?: string;
};

export function ExecutiveSkeleton({ className }: Props) {
    return (
        <div
            aria-hidden="true"
            className={clsx(
                "animate-pulse rounded-2xl bg-foreground/10",
                className,
            )}
        />
    );
}