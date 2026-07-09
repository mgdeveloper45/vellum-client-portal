import clsx from "clsx";

type Tone = "neutral" | "success" | "warning" | "danger";

type Props = {
    label: string;
    value: string | number;
    helper?: string;
    trend?: string;
    tone?: Tone;
    className?: string;
};

const toneClasses: Record<Tone, string> = {
    neutral: "text-foreground/60",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
};

export function ExecutiveMetricCard({
    label,
    value,
    helper,
    trend,
    tone = "neutral",
    className,
}: Props) {
    return (
        <div
            className={clsx(
                "rounded-3xl border border-border/70 bg-card/95 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg",
                className,
            )}
        >
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-foreground/50">
                {label}
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-3xl font-light tracking-tight">
                    {value}
                </p>

                {trend && (
                    <span
                        className={clsx(
                            "rounded-full bg-background px-3 py-1 text-xs font-medium",
                            toneClasses[tone],
                        )}
                    >
                        {trend}
                    </span>
                )}
            </div>

            {helper && (
                <p className="mt-3 text-sm leading-6 text-foreground/60">
                    {helper}
                </p>
            )}
        </div>
    );
}