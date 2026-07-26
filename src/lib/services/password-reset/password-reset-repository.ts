export type PasswordResetUser = {
  id: string;
  email: string;
};

export type PasswordResetTokenRecord = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  user: PasswordResetUser;
};

export interface PasswordResetRepository {
  findUserByEmail(email: string): Promise<PasswordResetUser | null>;

  createResetToken(params: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void>;

  findResetToken(token: string): Promise<PasswordResetTokenRecord | null>;

  updatePassword(userId: string, hashedPassword: string): Promise<void>;

  deleteResetToken(id: string): Promise<void>;
}
