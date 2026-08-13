import { createMessageAction } from "@/actions/message-actions";

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
        <section id="messages" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-medium">
                Messages
            </h2>

            <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                <form
                    action={createMessageAction}
                    className="space-y-3"
                >
                    <input
                        type="hidden"
                        name="projectId"
                        value={projectId}
                    />

                    <textarea
                        name="content"
                        required
                        placeholder="Write a message..."
                        className="min-h-24 w-full rounded-lg border border-border bg-background px-4 py-3"
                    />

                    <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                        Send Message
                    </button>
                </form>
            </div>

            <div className="mt-4 grid gap-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="rounded-xl border border-border p-4"
                    >
                        <p className="text-sm font-medium">
                            {message.sender.firstName}{" "}
                            {message.sender.lastName}
                        </p>

                        <p className="text-xs text-foreground/50">
                            {message.sender.role}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-foreground/70">
                            {message.content}
                        </p>

                        <p className="mt-3 text-xs text-foreground/50">
                            Sent{" "}
                            {message.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}