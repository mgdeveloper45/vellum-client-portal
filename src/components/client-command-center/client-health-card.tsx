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
                    <p key={reason} className="text-sm text-foreground/70">
                        • {reason}
                    </p>
                ))}
            </div>
        </CommandCard>
    );
}