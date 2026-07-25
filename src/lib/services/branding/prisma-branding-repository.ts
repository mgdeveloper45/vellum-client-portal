import { prisma } from "@/lib/prisma";
import type {
  BrandingRepository,
  WorkspaceBrandingUpdate,
} from "./branding-repository";

export class PrismaBrandingRepository implements BrandingRepository {
  async updateWorkspaceBranding(
    workspaceId: string,
    branding: WorkspaceBrandingUpdate,
  ): Promise<void> {
    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        companyName: branding.companyName,
        slug: branding.slug,
        accentColor: branding.accentColor,
        customDomain: branding.customDomain,
      },
    });
  }

  async findWorkspaceLogoUrl(workspaceId: string): Promise<string | null> {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        logoImageUrl: true,
      },
    });

    return workspace?.logoImageUrl ?? null;
  }

  async updateWorkspaceLogoUrl(
    workspaceId: string,
    logoImageUrl: string,
  ): Promise<void> {
    await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        logoImageUrl,
      },
    });
  }
}

export const prismaBrandingRepository = new PrismaBrandingRepository();
