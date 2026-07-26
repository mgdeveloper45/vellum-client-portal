import { ChangePasswordService } from "@/lib/services/security/change-password-service";
import { prismaSecurityRepository } from "@/lib/services/security/prisma-security-repository";

export const changePasswordService = new ChangePasswordService(
  prismaSecurityRepository,
);
