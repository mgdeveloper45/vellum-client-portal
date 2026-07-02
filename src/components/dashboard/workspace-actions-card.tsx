import Link from "next/link";
import { WorkspaceActionButton } from "./workspace-action-button";
import { generateWorkspaceActions } from "@/lib/services/ai/action-engine";
import { getWorkspaceAIContext } from "@/lib/services/ai/workspace-context";

type WorkspaceActionsCardProps = {
    userId: string;
    workspaceId: string;
};

export async function WorkspaceActionsCard({
    userId,
    workspaceId,
}: WorkspaceActionsCardProps) {
    const context = await getWorkspaceAIContext({
        userId,
        workspaceId,
    });

    const actions = generateWorkspaceActions(context);

    return (
        <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-2xl font-light">Recommended Actions</h2>

            <p className="mt-1 text-sm text-foreground/60">
                Based on your current workspace activity.
            </p>

            <div className="mt-6 space-y-3">
                {actions.map((action) => (
                    <Link
                        key={action.id}
                        href={action.href}
                        className="block rounded-2xl border border-border bg-background p-4 transition hover:border-accent"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{action.title}</h3>

                            <span
                                className={`rounded-full px-3 py-1 text-xs ${action.priority === "HIGH"
                                    ? "bg-red-100 text-red-700"
                                    : action.priority === "MEDIUM"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {action.priority}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-foreground/70">
                            {action.description}
                        </p>

                        <div className="mt-4">
                            <WorkspaceActionButton href={action.href}>
                                Open
                            </WorkspaceActionButton>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}