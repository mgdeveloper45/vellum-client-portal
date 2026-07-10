import Link from "next/link";
import { CommandCard } from "@/components/ui/command-card";
import { ExecutiveButton } from "@/components/ui/executive-button";


type Props = {
    firstName: string | null;
    narrative: string;
    primaryAction?: {
        label: string;
        href: string;
    };
};

export function ExecutiveHero({
    firstName,
    narrative,
    primaryAction,
}: Props) {
    return (
        <CommandCard
            eyebrow="Executive Center"
            title={`Good morning${firstName ? `, ${firstName}` : ""}.`}
            subtitle="Your business briefing for today."
            className="bg-gradient-to-br from-card via-card to-primary/5"
        >
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div>
                    <p className="max-w-3xl whitespace-pre-wrap text-lg font-light leading-8 text-foreground/75">
                        {narrative}
                    </p>
                </div>

                <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
                        Recommended Focus
                    </p>

                    <p className="mt-4 text-2xl font-light leading-tight">
                        Review today&apos;s highest-priority action.
                    </p>

                    {primaryAction && (
                        <Link href={primaryAction.href}>
                            <ExecutiveButton size="lg">
                                {primaryAction.label}
                            </ExecutiveButton>
                        </Link>
                    )}
                </div>
            </div>
        </CommandCard>
    );
}