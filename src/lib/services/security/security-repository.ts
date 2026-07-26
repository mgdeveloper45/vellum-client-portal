export type SecurityUser = {
  id: string;
  password: string | null;
};

export interface SecurityRepository {
  findUserById(userId: string): Promise<SecurityUser | null>;

  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}
