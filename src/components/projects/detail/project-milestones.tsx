import {
    createMilestoneAction,
    cycleMilestoneStatusAction,
    deleteMilestoneAction,
} from "@/actions/milestone-actions";

import { formatStatus } from "@/lib/utils";

import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectMilestonesProps = {
    projectId: string;
    milestones: ProjectDetailViewModel["project"]["milestones"];
    canManageProject: boolean;
};

export function ProjectMilestones({
    projectId,
    milestones,
    canManageProject,
}: ProjectMilestonesProps) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-medium">
                Milestones
            </h2>

            {canManageProject && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                    <form
                        action={createMilestoneAction}
                        className="space-y-3"
                    >
                        <input
                            type="hidden"
                            name="projectId"
                            value={projectId}
                        />

                        <input
                            name="title"
                            required
                            placeholder="Milestone title"
                            className="w-full rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <input
                            name="dueDate"
                            type="date"
                            className="w-full rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                            Create Milestone
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-4 grid gap-3">
                {milestones.map((milestone) => (
                    <div
                        key={milestone.id}
                        className="rounded-xl border border-border p-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                                {milestone.title}
                            </h3>

                            {canManageProject ? (
                                <form action={cycleMilestoneStatusAction}>
                                    <input
                                        type="hidden"
                                        name="milestoneId"
                                        value={milestone.id}
                                    />

                                    <input
                                        type="hidden"
                                        name="projectId"
                                        value={projectId}
                                    />

                                    <button className="text-sm text-accent">
                                        {formatStatus(milestone.status)}
                                    </button>
                                </form>
                            ) : (
                                <span className="text-sm text-foreground/70">
                                    {formatStatus(milestone.status)}
                                </span>
                            )}
                        </div>

                        {milestone.dueDate && (
                            <p className="mt-2 text-sm text-foreground/60">
                                Due{" "}
                                {milestone.dueDate.toLocaleDateString()}
                            </p>
                        )}

                        {canManageProject && (
                            <form
                                action={deleteMilestoneAction}
                                className="mt-3"
                            >
                                <input
                                    type="hidden"
                                    name="milestoneId"
                                    value={milestone.id}
                                />

                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={projectId}
                                />

                                <button
                                    aria-label={`Delete milestone ${milestone.title}`}
                                    className="text-xs text-red-400"
                                >
                                    Delete Milestone
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}