import { CommandCard } from "@/components/ui/command-card";

type Props = {
    score: number;
    reasons: string[];
};

export function ClientHealthCard({
    score,
    reasons,
}: Props) {
    return (
        <CommandCard
            title="Client Health"
            subtitle={`Health Score ${score}%`}
        >
            <div className="space-y-3">
                {reasons.map((reason) => (
                    <div
                        key={reason}
                        className="flex items-start gap-3 rounded-xl border border-border/50 p-3"
                    >
                        <div
                            className="mt-2 h-2 w-2 rounded-full bg-primary"
                            aria-hidden="true"
                        />

                        <p className="text-sm text-foreground/70">
                            {reason}
                        </p>
                    </div>
                ))}
            </div>
        </CommandCard>
    );
}