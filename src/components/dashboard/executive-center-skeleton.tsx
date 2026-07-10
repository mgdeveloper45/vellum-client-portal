import { ExecutiveSkeleton } from "@/components/ui/executive-skeleton";

export function ExecutiveCenterSkeleton() {
    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-border/70 bg-card/95 p-6">
                <ExecutiveSkeleton className="h-3 w-32" />
                <ExecutiveSkeleton className="mt-4 h-10 w-72 max-w-full" />
                <ExecutiveSkeleton className="mt-4 h-5 w-full max-w-2xl" />
                <ExecutiveSkeleton className="mt-2 h-5 w-4/5 max-w-xl" />

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-3xl border border-border/50 bg-background/50 p-5"
                        >
                            <ExecutiveSkeleton className="h-3 w-24" />
                            <ExecutiveSkeleton className="mt-4 h-9 w-28" />
                            <ExecutiveSkeleton className="mt-4 h-4 w-36" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-3xl border border-border/70 bg-card/95 p-6"
                    >
                        <ExecutiveSkeleton className="h-3 w-28" />
                        <ExecutiveSkeleton className="mt-4 h-8 w-56" />
                        <ExecutiveSkeleton className="mt-4 h-4 w-full" />
                        <ExecutiveSkeleton className="mt-2 h-4 w-3/4" />

                        <div className="mt-8 space-y-3">
                            <ExecutiveSkeleton className="h-16 w-full" />
                            <ExecutiveSkeleton className="h-16 w-full" />
                            <ExecutiveSkeleton className="h-16 w-full" />
                        </div>
                    </div>
                ))}
            </section>

            <section className="rounded-3xl border border-border/70 bg-card/95 p-6">
                <ExecutiveSkeleton className="h-3 w-28" />
                <ExecutiveSkeleton className="mt-4 h-8 w-64 max-w-full" />

                <div className="mt-8 space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ExecutiveSkeleton
                            key={index}
                            className="h-20 w-full"
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}