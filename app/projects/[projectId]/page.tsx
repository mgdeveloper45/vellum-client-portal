import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type ProjectDetailPageProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default async function ProjectDetailPage({
    params,
}: ProjectDetailPageProps) {
    const { projectId } = await params;

    return (
        <DashboardShell>
            <Link href="/projects" className="text-sm text-accent">
                ← Back to projects
            </Link>

            <div className="mt-6 rounded-2xl border border-border bg-card p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-accent">
                    Project Detail
                </p>

                <h1 className="mt-3 text-3xl font-light">
                    Project ID: {projectId}
                </h1>

                <p className="mt-4 max-w-2xl text-foreground/70">
                    This is a dynamic route. Later, this ID will be used to fetch the
                    real project from PostgreSQL using Prisma.
                </p>
            </div>
        </DashboardShell>
    );
}