import { prisma } from "@/lib/prisma";
import type {
  CreateDefaultWorkspaceInput,
  CreateDefaultWorkspaceRepositoryResult,
  WorkspaceSetupRepository,
} from "./workspace-setup-repository";

class WorkspaceAssignmentConflictError extends Error {
  constructor() {
    super("The workspace setup request is no longer valid.");
    this.name = "WorkspaceAssignmentConflictError";
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export class PrismaWorkspaceSetupRepository implements WorkspaceSetupRepository {
  async createDefaultWorkspace(
    input: CreateDefaultWorkspaceInput,
  ): Promise<CreateDefaultWorkspaceRepositoryResult> {
    /*
     * The slug column is unique. If another workspace already uses the
     * requested slug, retry with a numeric suffix.
     */
    for (let suffix = 1; suffix <= 100; suffix += 1) {
      const candidateSlug =
        suffix === 1 ? input.workspaceSlug : `${input.workspaceSlug}-${suffix}`;

      try {
        return await prisma.$transaction(async (transaction) => {
          const currentUser = await transaction.user.findUnique({
            where: {
              id: input.userId,
            },
            select: {
              id: true,
              workspaceId: true,
            },
          });

          if (!currentUser) {
            return {
              status: "user_not_found",
            };
          }

          if (currentUser.workspaceId) {
            return {
              status: "already_assigned",
              workspaceId: currentUser.workspaceId,
            };
          }

          /*
           * Only migrate projects owned by this user that have not already
           * been assigned to another workspace.
           */
          const unassignedProjects = await transaction.project.findMany({
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

          const workspace = await transaction.workspace.create({
            data: {
              name: input.workspaceName,
              slug: candidateSlug,
            },
            select: {
              id: true,
              name: true,
              slug: true,
            },
          });

          /*
           * updateMany makes the assignment conditional. If another request
           * assigned the user after the initial read, this update affects zero
           * records and the transaction must be rolled back.
           */
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
            throw new WorkspaceAssignmentConflictError();
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
            status: "created",
            workspace: {
              id: workspace.id,
              name: workspace.name,
              slug: candidateSlug,
              migratedProjectCount: projectIds.length,
              migratedClientCount: clientIds.length,
            },
          };
        });
      } catch (error) {
        if (error instanceof WorkspaceAssignmentConflictError) {
          return {
            status: "assignment_conflict",
          };
        }

        /*
         * Another request may have created the same slug between our lookup
         * and insert. Retry using the next numeric suffix.
         */
        if (isUniqueConstraintError(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new Error(
      "A unique workspace slug could not be generated after 100 attempts.",
    );
  }
}

export const prismaWorkspaceSetupRepository =
  new PrismaWorkspaceSetupRepository();
