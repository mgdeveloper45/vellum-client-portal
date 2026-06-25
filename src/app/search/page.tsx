import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";

type SearchPageProps = {
    searchParams: Promise<{
        q?: string;
    }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const projectFilter =
        session.user.role === "ADMIN"
            ? {}
            : {
                clientId: session.user.id,
            };

    const { q } = await searchParams;
    const query = q?.trim() || "";

    const clients = query
        ? await prisma.user.findMany({
            where:
                session.user.role === "ADMIN"
                    ? {
                        role: "CLIENT",
                        OR: [
                            { firstName: { contains: query, mode: "insensitive" } },
                            { lastName: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } },
                        ],
                    }
                    : {
                        id: session.user.id,
                        role: "CLIENT",
                        OR: [
                            { firstName: { contains: query, mode: "insensitive" } },
                            { lastName: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } },
                        ],
                    },
            take: 5,
        })
        : [];

    const projects = query
        ? await prisma.project.findMany({
            where: {
                ...projectFilter,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 5,
        })
        : [];

    const messages = query
        ? await prisma.message.findMany({
            where: {
                content: { contains: query, mode: "insensitive" },
                project: projectFilter,
            },
            include: {
                project: true,
            },
            take: 5,
        })
        : [];

    const files = query
        ? await prisma.projectFile.findMany({
            where: {
                project: projectFilter,
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { fileType: { contains: query, mode: "insensitive" } },
                    { url: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                project: true,
            },
            take: 5,
        })
        : [];

    return (
        <BrandedDashboardShell>
            <h1 className="text-3xl font-light">Search</h1>

            <form className="mt-6 flex gap-3">
                <input
                    name="q"
                    defaultValue={query}
                    placeholder="Search clients, projects, messages, files..."
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                />

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
                                    rel="noreferrer"
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