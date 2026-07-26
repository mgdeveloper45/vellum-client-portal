import Link from "next/link";
import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { searchWorkspaceQuery } from "@/lib/queries/search/search-workspace-query";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function SearchPage({
    searchParams,
}: SearchPageProps) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const { q } = await searchParams;
    const query = q?.trim() ?? "";

    const { clients, projects, messages, files } =
        await searchWorkspaceQuery({
            query,
            userId: session.user.id,
            isAdmin: session.user.role === "ADMIN",
        });

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Search</h1>

            <form className="mt-6 flex gap-3">
                <input
                    name="q"
                    defaultValue={query}
                    aria-label="Search workspace"
                    aria-describedby="workspace-search-help"
                    placeholder="Search clients, projects, messages, files..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

                <p id="workspace-search-help" className="sr-only">
                    Search clients, projects, messages, and files.
                </p>

                <button className="rounded-lg bg-foreground px-5 py-3 text-background">
                    Search
                </button>
            </form>

            {query && (
                <div className="mt-8 space-y-8">
                    <section>
                        <h2 className="text-xl font-medium">Clients</h2>

                        <div className="mt-3 grid gap-3">
                            {clients.map((client) => (
                                <Link
                                    key={client.id}
                                    href={`/clients/${client.id}`}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    {client.firstName} {client.lastName}
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-medium">Projects</h2>

                        <div className="mt-3 grid gap-3">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    {project.name}
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-medium">Messages</h2>

                        <div className="mt-3 grid gap-3">
                            {messages.map((message) => (
                                <Link
                                    key={message.id}
                                    href={`/projects/${message.projectId}`}
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    {message.content}

                                    <p className="mt-1 text-xs text-foreground/50">
                                        {message.project.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-medium">Files</h2>

                        <div className="mt-3 grid gap-3">
                            {files.map((file) => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-xl border border-border bg-card p-4"
                                >
                                    {file.name}

                                    <p className="mt-1 text-xs text-foreground/50">
                                        {file.project.name} • {file.fileType}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </BrandedDashboardShell>
    );
}