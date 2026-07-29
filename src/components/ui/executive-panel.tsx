import { cn } from "@/lib/utils";

type ExecutivePanelProps = {
    label: string;
    value: React.ReactNode;
    helper?: React.ReactNode;
    className?: string;
    accent?: "default" | "success" | "warning" | "danger" | "primary";
};

const accentStyles = {
    default: "border-border",
    success: "border-emerald-500/30",
    warning: "border-amber-500/30",
    danger: "border-red-500/30",
    primary: "border-primary/30",
} as const;

export function ExecutivePanel({
    label,
    value,
    helper,
    className,
    accent = "default",
}: ExecutivePanelProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border bg-background/70 p-5 transition-all duration-200",
                "hover:border-primary/30 hover:shadow-sm",
                accentStyles[accent],
                className,
            )}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/45">
                {label}
            </p>

            <div className="mt-3 text-2xl font-light leading-none tracking-tight">
                {value}
            </div>

            {helper && (
                <p className="mt-3 text-sm leading-6 text-foreground/65">
                    {helper}
                </p>
            )}
        </div>
    );
}