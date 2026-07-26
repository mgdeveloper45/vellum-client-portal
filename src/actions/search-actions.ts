"use server";

import { auth } from "@/auth";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { workspaceSearchService } from "@/lib/services/search/composition/search-services";
import type { SearchResult } from "@/lib/services/search/workspace-search-service";

export type { SearchResult };

export async function searchWorkspaceAction(
  query: string,
): Promise<SearchResult[]> {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return [];
  }

  return workspaceSearchService.execute({
    workspaceId,
    query,
  });
}
