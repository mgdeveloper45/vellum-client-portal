export type WorkspaceBrandingUpdate = {
  companyName: string | null;
  slug: string | null;
  accentColor: string;
  customDomain: string | null;
};

export interface BrandingRepository {
  updateWorkspaceBranding(
    workspaceId: string,
    branding: WorkspaceBrandingUpdate,
  ): Promise<void>;

  findWorkspaceLogoUrl(workspaceId: string): Promise<string | null>;

  updateWorkspaceLogoUrl(
    workspaceId: string,
    logoImageUrl: string,
  ): Promise<void>;
}
