import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";
import clsx from "clsx";

type Variant =
    | "primary"
    | "secondary"
    | "ghost"
    | "danger";

type Size = "sm" | "md" | "lg";

type ExecutiveButtonProps =
    ButtonHTMLAttributes<HTMLButtonElement> & {
        children: ReactNode;
        variant?: Variant;
        size?: Size;
        fullWidth?: boolean;
    };

const variantClasses: Record<Variant, string> = {
    primary:
        "border border-primary bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg",

    secondary:
        "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5",

    ghost:
        "border border-transparent bg-transparent text-foreground/70 hover:bg-primary/10 hover:text-foreground",

    danger:
        "border border-red-500/40 bg-red-500/10 text-red-400 hover:-translate-y-0.5 hover:bg-red-500/20",
};

const sizeClasses: Record<Size, string> = {
    sm: "min-h-9 px-4 py-2 text-xs",
    md: "min-h-11 px-5 py-2.5 text-sm",
    lg: "min-h-12 px-6 py-3 text-sm",
};

export function ExecutiveButton({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    type = "button",
    disabled,
    ...props
}: ExecutiveButtonProps) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && "w-full",
                className,
            )}
        >
            {children}
        </button>
    );
}