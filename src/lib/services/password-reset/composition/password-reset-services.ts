import { PasswordResetService } from "../password-reset-service";
import { prismaPasswordResetRepository } from "../prisma-password-reset-repository";

export const passwordResetService = new PasswordResetService(
  prismaPasswordResetRepository,
);
