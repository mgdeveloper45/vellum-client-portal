import { formatStatus } from "@/lib/utils";

type ProjectOverviewProps = {
    clientName: string;
    status: string;
};

export function ProjectOverview({
    clientName,
    status,
}: ProjectOverviewProps) {
    return (
        <section
            aria-labelledby="project-overview-heading"
            className="mt-8 grid gap-6 md:grid-cols-2"
        >
            <h2
                id="project-overview-heading"
                className="sr-only"
            >
                Project Overview
            </h2>

            <div>
                <h3 className="font-medium">
                    Client
                </h3>

                <p className="mt-2 text-foreground/70">
                    {clientName}
                </p>
            </div>

            <div>
                <h3 className="font-medium">
                    Status
                </h3>

                <p className="mt-2 text-foreground/70">
                    {formatStatus(status)}
                </p>
            </div>
        </section>
    );
}