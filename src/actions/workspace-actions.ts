"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAuditLog } from "@/lib/audit";
import { canManageWorkspace } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function createDefaultWorkspaceAction() {
  const session = await auth();

  if (!session?.user || !canManageWorkspace(session.user.role)) {
    return;
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      workspaceId: true,
    },
  });

  if (!currentUser) {
    return;
  }

  // Make the operation idempotent. A user who already belongs
  // to a workspace must not create another default workspace.
  if (currentUser.workspaceId) {
    redirect("/settings");
  }

  // Only migrate projects owned by the current user that have
  // not already been assigned to another workspace.
  const unassignedProjects = await prisma.project.findMany({
    where: {
      ownerId: currentUser.id,
      workspaceId: null,
    },
    select: {
      id: true,
      clientId: true,
    },
  });

  const projectIds = unassignedProjects.map((project) => project.id);

  const clientIds = [
    ...new Set(unassignedProjects.map((project) => project.clientId)),
  ];

  const result = await prisma.$transaction(async (transaction) => {
    const workspace = await transaction.workspace.create({
      data: {
        name: "Vellum Workspace",
      },
    });

    // The workspace is created only if this user is still
    // unassigned. This protects against duplicate submissions.
    const assignedUser = await transaction.user.updateMany({
      where: {
        id: currentUser.id,
        workspaceId: null,
      },
      data: {
        workspaceId: workspace.id,
      },
    });

    if (assignedUser.count !== 1) {
      throw new Error("The workspace setup request is no longer valid.");
    }

    if (clientIds.length > 0) {
      await transaction.user.updateMany({
        where: {
          id: {
            in: clientIds,
          },
          workspaceId: null,
        },
        data: {
          workspaceId: workspace.id,
        },
      });
    }

    if (projectIds.length > 0) {
      await transaction.project.updateMany({
        where: {
          id: {
            in: projectIds,
          },
          ownerId: currentUser.id,
          workspaceId: null,
        },
        data: {
          workspaceId: workspace.id,
        },
      });
    }

    return {
      workspace,
      migratedProjectCount: projectIds.length,
      migratedClientCount: clientIds.length,
    };
  });

  await createAuditLog({
    action: "WORKSPACE_CREATED",
    entity: "WORKSPACE",
    entityId: result.workspace.id,
    userId: currentUser.id,
    metadata: {
      name: result.workspace.name,
      migratedProjectCount: result.migratedProjectCount,
      migratedClientCount: result.migratedClientCount,
    },
  });

  redirect("/settings");
}
