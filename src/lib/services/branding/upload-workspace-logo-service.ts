import { deleteFileFromR2, getR2PublicUrl, uploadFileToR2 } from "@/lib/r2";
import type { BrandingRepository } from "./branding-repository";

export type UploadWorkspaceLogoInput = {
  workspaceId: string;
  logo: File;
};

export class UploadWorkspaceLogoService {
  constructor(private readonly brandingRepository: BrandingRepository) {}

  async execute(input: UploadWorkspaceLogoInput): Promise<void> {
    const previousLogoUrl = await this.brandingRepository.findWorkspaceLogoUrl(
      input.workspaceId,
    );

    const key = await uploadFileToR2({
      file: input.logo,
      folder: `workspaces/${input.workspaceId}/branding`,
    });

    const newLogoUrl = getR2PublicUrl(key);

    try {
      await this.brandingRepository.updateWorkspaceLogoUrl(
        input.workspaceId,
        newLogoUrl,
      );
    } catch (error) {
      await deleteFileFromR2(key).catch(() => undefined);
      throw error;
    }

    const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

    if (
      previousLogoUrl &&
      publicBaseUrl &&
      previousLogoUrl.startsWith(`${publicBaseUrl}/`)
    ) {
      const previousKey = previousLogoUrl.slice(publicBaseUrl.length + 1);

      if (previousKey && previousKey !== key) {
        await deleteFileFromR2(previousKey).catch(() => undefined);
      }
    }
  }
}
