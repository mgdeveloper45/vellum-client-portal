import bcrypt from "bcryptjs";

import type { SecurityRepository } from "@/lib/services/security/security-repository";

export type ChangePasswordResult =
  | {
      success: true;
    }
  | {
      success: false;
      error:
        "USER_NOT_FOUND" | "PASSWORD_NOT_SET" | "CURRENT_PASSWORD_INCORRECT";
    };

type ChangePasswordParams = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export class ChangePasswordService {
  constructor(private readonly securityRepository: SecurityRepository) {}

  async execute({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordParams): Promise<ChangePasswordResult> {
    const user = await this.securityRepository.findUserById(userId);

    if (!user) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
      };
    }

    if (!user.password) {
      return {
        success: false,
        error: "PASSWORD_NOT_SET",
      };
    }

    const currentPasswordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      return {
        success: false,
        error: "CURRENT_PASSWORD_INCORRECT",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.securityRepository.updatePassword(userId, hashedPassword);

    return {
      success: true,
    };
  }
}
