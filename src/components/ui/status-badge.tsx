import clsx from "clsx";

type Status =
    | "success"
    | "warning"
    | "danger"
    | "info";

const variants = {
    success:
        "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",

    warning:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",

    danger:
        "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",

    info:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
};

type Props = {
    children: React.ReactNode;
    variant: Status;
};

export function StatusBadge({
    children,
    variant,
}: Props) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                variants[variant],
            )}
        >
            {children}
        </span>
    );
}