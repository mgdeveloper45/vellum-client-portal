import Link from "next/link";

import { DemoShell } from "@/components/demo/demo-shell";
import {
    demoClients,
    demoMessages,
    demoProjects,
} from "@/lib/demo/demo-data";

export default function DemoMessagesPage() {
    return (
        <DemoShell>
            <div className="mx-auto max-w-7xl">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                        Communication
                    </p>

                    <h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">
                        Messages
                    </h1>

                    <p className="mt-3 max-w-3xl text-foreground/60">
                        Keep client conversations connected to the work,
                        relationships, and project context that matter.
                    </p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
                    <section className="overflow-hidden rounded-3xl border border-border bg-card">
                        <div className="border-b border-border px-6 py-5">
                            <h2 className="text-xl font-medium">
                                Conversations
                            </h2>

                            <p className="mt-1 text-sm text-foreground/50">
                                Recent client communication
                            </p>
                        </div>

                        <div className="divide-y divide-border">
                            {demoMessages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={
                                        index === 0
                                            ? "bg-primary/[0.05] px-6 py-5"
                                            : "px-6 py-5"
                                    }
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {message.clientName}
                                            </p>

                                            <p className="mt-1 truncate text-sm text-foreground/50">
                                                {message.projectName}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-xs text-foreground/40">
                                            {message.timeLabel}
                                        </p>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/60">
                                        {message.preview}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                        {(() => {
                            const message = demoMessages[0];

                            const project = demoProjects.find(
                                (candidate) =>
                                    candidate.name === message.projectName,
                            );

                            const client = project
                                ? demoClients.find(
                                    (candidate) =>
                                        candidate.id === project.clientId,
                                )
                                : null;

                            return (
                                <>
                                    <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                                Active Conversation
                                            </p>

                                            <h2 className="mt-3 text-2xl font-light">
                                                {message.clientName}
                                            </h2>

                                            <p className="mt-2 text-sm text-foreground/50">
                                                {message.projectName}
                                            </p>
                                        </div>

                                        <p className="text-sm text-foreground/40">
                                            {message.timeLabel}
                                        </p>
                                    </div>

                                    <div className="py-8">
                                        <div className="max-w-xl rounded-3xl rounded-tl-md bg-muted p-5">
                                            <p className="text-sm leading-7 text-foreground/80">
                                                {message.preview}
                                            </p>
                                        </div>

                                        <div className="mt-6 ml-auto max-w-xl rounded-3xl rounded-tr-md bg-primary px-5 py-4 text-primary-foreground">
                                            <p className="text-sm leading-7">
                                                Absolutely. I&apos;ll prepare the mobile
                                                direction and make sure the next review
                                                includes the responsive layouts and
                                                interaction notes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-6">
                                        <div className="rounded-2xl border border-border bg-background p-4">
                                            <p className="text-sm text-foreground/40">
                                                Write a reply...
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                            <p className="text-xs text-foreground/40">
                                                Demo Mode — messages are not actually sent.
                                            </p>

                                            <Link
                                                href="/sign-in"
                                                className="workspace-accent-button rounded-full px-5 py-3 text-sm font-medium"
                                            >
                                                Sign in to reply
                                            </Link>
                                        </div>
                                    </div>

                                    {(client || project) && (
                                        <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
                                            {client && (
                                                <Link
                                                    href={`/demo/clients/${client.id}`}
                                                    className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
                                                >
                                                    <p className="text-xs text-foreground/45">
                                                        Client
                                                    </p>

                                                    <p className="mt-2 font-medium">
                                                        {client.firstName} {client.lastName}
                                                    </p>

                                                    <p className="mt-3 text-sm workspace-accent-text">
                                                        View client →
                                                    </p>
                                                </Link>
                                            )}

                                            {project && (
                                                <Link
                                                    href={`/demo/projects/${project.id}`}
                                                    className="rounded-2xl border border-border bg-background p-4 transition hover:border-primary/40"
                                                >
                                                    <p className="text-xs text-foreground/45">
                                                        Project
                                                    </p>

                                                    <p className="mt-2 font-medium">
                                                        {project.name}
                                                    </p>

                                                    <p className="mt-3 text-sm workspace-accent-text">
                                                        Open project →
                                                    </p>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </section>
                </div>

                <section className="mt-8 rounded-3xl border border-primary/20 bg-primary/[0.05] p-6">
                    <p className="font-medium">
                        Communication stays connected
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-foreground/60">
                        In a live Vellum workspace, conversations remain
                        connected to clients and projects so important context
                        does not get separated from the work.
                    </p>
                </section>
            </div>
        </DemoShell>
    );
}