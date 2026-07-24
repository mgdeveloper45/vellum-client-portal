"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageWorkspace } from "@/lib/permissions";
import { createDefaultWorkspaceService } from "@/lib/services/workspace/composition/workspace-services";

export async function createDefaultWorkspaceAction() {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const result = await createDefaultWorkspaceService.execute({
    userId: session.user.id,
    workspaceName: "Vellum Workspace",
  });

  if (!result.success) {
    if (result.code === "ALREADY_ASSIGNED") {
      redirect("/settings");
    }

    if (result.code === "USER_NOT_FOUND") {
      console.error("Workspace setup failed because the user was not found", {
        userId: session.user.id,
      });

      return;
    }

    throw new Error("The workspace setup request is no longer valid.");
  }

  await createAuditLog({
    action: "WORKSPACE_CREATED",
    entity: "WORKSPACE",
    entityId: result.workspace.id,
    userId: session.user.id,
    metadata: {
      name: result.workspace.name,
      slug: result.workspace.slug,
      migratedProjectCount: result.migratedProjectCount,
      migratedClientCount: result.migratedClientCount,
    },
  });

  redirect("/settings");
}
