import type { BrandingRepository } from "./branding-repository";

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type UpdateWorkspaceBrandingInput = {
  workspaceId: string;
  companyName: string;
  accentColor: string;
  customDomain: string;
};

export class UpdateWorkspaceBrandingService {
  constructor(private readonly brandingRepository: BrandingRepository) {}

  async execute(input: UpdateWorkspaceBrandingInput): Promise<void> {
    const slug = createSlug(input.companyName);

    await this.brandingRepository.updateWorkspaceBranding(input.workspaceId, {
      companyName: input.companyName || null,
      slug: slug || null,
      accentColor: input.accentColor || "#8B5CF6",
      customDomain: input.customDomain || null,
    });
  }
}
