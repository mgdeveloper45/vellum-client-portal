import { createMessageAction } from "@/actions/message-actions";

import { ExecutiveCard } from "@/components/ui/executive-card";
import { ExecutiveEmptyState } from "@/components/ui/executive-empty-state";
import { ExecutiveSection } from "@/components/ui/executive-section";

import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectMessagesProps = {
    projectId: string;
    messages: ProjectDetailViewModel["project"]["messages"];
};

export function ProjectMessages({
    projectId,
    messages,
}: ProjectMessagesProps) {
    return (
        <ExecutiveSection
            title="Messages"
            description="Collaborate with your client and keep important project conversations together."
        >
            <ExecutiveCard>
                <ExecutiveCard.Header>
                    <div>
                        <h3 className="text-lg font-medium">
                            New Message
                        </h3>

                        <p className="mt-1 text-sm text-foreground/60">
                            Send an update or ask a question about this project.
                        </p>
                    </div>
                </ExecutiveCard.Header>

                <ExecutiveCard.Body>
                    <form
                        action={createMessageAction}
                        className="space-y-5"
                    >
                        <input
                            type="hidden"
                            name="projectId"
                            value={projectId}
                        />

                        <div className="space-y-2">
                            <label
                                htmlFor="project-message"
                                className="text-sm font-medium"
                            >
                                Message
                            </label>

                            <textarea
                                id="project-message"
                                name="content"
                                required
                                rows={5}
                                placeholder="Share a project update..."
                                className="w-full rounded-xl border border-border bg-background px-4 py-3 leading-7 transition focus:border-primary focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:opacity-90"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </ExecutiveCard.Body>
            </ExecutiveCard>

            {messages.length === 0 ? (
                <ExecutiveEmptyState
                    title="No messages yet"
                    description="Start the conversation by sharing updates, asking questions, or documenting important decisions."
                />
            ) : (
                <div className="grid gap-4">
                    {messages.map((message) => (
                        <ExecutiveCard
                            key={message.id}
                            className="transition-all hover:-translate-y-0.5 hover:border-primary/40"
                        >
                            <ExecutiveCard.Body>
                                <div className="flex items-start justify-between gap-6">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="font-medium">
                                                {message.sender.firstName}{" "}
                                                {message.sender.lastName}
                                            </h3>

                                            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/60">
                                                {message.sender.role}
                                            </span>
                                        </div>

                                        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/70">
                                            {message.content}
                                        </p>
                                    </div>

                                    <time
                                        dateTime={message.createdAt.toISOString()}
                                        className="shrink-0 text-xs text-foreground/50"
                                    >
                                        {message.createdAt.toLocaleDateString()}
                                    </time>
                                </div>
                            </ExecutiveCard.Body>
                        </ExecutiveCard>
                    ))}
                </div>
            )}
        </ExecutiveSection>
    );
}