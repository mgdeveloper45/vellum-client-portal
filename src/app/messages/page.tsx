import Link from "next/link";

import { auth } from "@/auth";
import { BrandedDashboardShell } from "@/components/layout/branded-dashboard-shell";
import { canManageProjects } from "@/lib/permissions";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { listMessagesService } from "@/lib/services/messages/composition/message-services";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return null;
  }

  const result = await listMessagesService({
    workspaceId,
    viewerUserId: session.user.id,
    canManageProjects: canManageProjects(
      session.user.role,
    ),
    limit: 25,
  });

  const messages = result.success
    ? result.messages
    : [];

  return (
    <BrandedDashboardShell>
      <h1 className="text-3xl font-light">
        Messages
      </h1>

      <p className="mt-2 text-foreground/70">
        Recent project conversations across your
        workspace.
      </p>

      <div className="mt-8 grid gap-3">
        {messages.map((message) => (
          <Link
            key={message.id}
            href={`/projects/${message.projectId}`}
            className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent"
          >
            <p className="font-medium">
              {message.sender.firstName}{" "}
              {message.sender.lastName}
            </p>

            <p className="mt-1 text-sm text-foreground/60">
              {message.project.name} ·{" "}
              {message.project.client.firstName}{" "}
              {message.project.client.lastName}
            </p>

            <p className="mt-3 text-sm text-foreground/80">
              {message.content}
            </p>

            <p className="mt-3 text-xs text-foreground/50">
              {message.createdAt.toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </BrandedDashboardShell>
  );
}