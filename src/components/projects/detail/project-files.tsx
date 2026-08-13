import {
    createProjectFileAction,
    deleteProjectFileAction,
} from "@/actions/file-actions";

import type { ProjectDetailViewModel } from "@/lib/services/projects/project-detail-builder";

type ProjectFilesProps = {
    projectId: string;
    projectFiles: ProjectDetailViewModel["projectFiles"];
    canManageProject: boolean;
};

export function ProjectFiles({
    projectId,
    projectFiles,
    canManageProject,
}: ProjectFilesProps) {
    return (
        <section id="files" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-medium">
                Files
            </h2>

            {canManageProject && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-6">
                    <form
                        action={createProjectFileAction}
                        className="space-y-3"
                        encType="multipart/form-data"
                    >
                        <input
                            type="hidden"
                            name="projectId"
                            value={projectId}
                        />

                        <input
                            name="file"
                            type="file"
                            required
                            className="w-full rounded-lg border border-border bg-background px-4 py-3"
                        />

                        <button className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
                            Upload File
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-4 grid gap-3">
                {projectFiles.map((file) => (
                    <div
                        key={file.id}
                        className="rounded-xl border border-border p-4 transition hover:border-accent"
                    >
                        <p className="font-medium">
                            {file.name}
                        </p>

                        <p className="mt-1 text-sm text-foreground/60">
                            {file.fileType}
                        </p>

                        <a
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-xs text-accent"
                        >
                            Open file
                        </a>

                        {canManageProject && (
                            <form
                                action={deleteProjectFileAction}
                                className="mt-3"
                            >
                                <input
                                    type="hidden"
                                    name="fileId"
                                    value={file.id}
                                />

                                <input
                                    type="hidden"
                                    name="projectId"
                                    value={projectId}
                                />

                                <button
                                    aria-label={`Delete file ${file.name}`}
                                    className="text-xs text-red-400"
                                >
                                    Delete File
                                </button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}