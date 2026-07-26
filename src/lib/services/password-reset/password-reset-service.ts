import crypto from "crypto";
import bcrypt from "bcryptjs";

import { sendPasswordResetEmail } from "@/lib/email";

import type { PasswordResetRepository } from "./password-reset-repository";

export class PasswordResetService {
  constructor(private readonly repository: PasswordResetRepository) {}

  async requestReset(email: string) {
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");

    await this.repository.createResetToken({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await sendPasswordResetEmail({
      email: user.email,
      resetUrl: `${process.env.APP_URL}/reset-password?token=${token}`,
    });
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.repository.findResetToken(token);

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error("Reset link is invalid or expired.");
    }

    const hash = await bcrypt.hash(password, 10);

    await this.repository.updatePassword(resetToken.userId, hash);

    await this.repository.deleteResetToken(resetToken.id);
  }
}
