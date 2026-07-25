import { PrismaBrandingRepository } from "../prisma-branding-repository";
import { UpdateWorkspaceBrandingService } from "../update-workspace-branding-service";
import { UploadWorkspaceLogoService } from "../upload-workspace-logo-service";

const brandingRepository = new PrismaBrandingRepository();

export const updateWorkspaceBrandingService =
  new UpdateWorkspaceBrandingService(brandingRepository);

export const uploadWorkspaceLogoService = new UploadWorkspaceLogoService(
  brandingRepository,
);
