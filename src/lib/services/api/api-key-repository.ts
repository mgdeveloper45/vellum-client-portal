export type ApiKeyRecord = {
  id: string;
  name: string;
  workspaceId: string;
  keyHash: string;
  keyPrefix: string;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
};

export type VerifiedApiKey = ApiKeyRecord & {
  workspace: {
    id: string;
    name: string;
  };
};

export interface ApiKeyRepository {
  createApiKey(input: {
    name: string;
    workspaceId: string;
    keyHash: string;
    keyPrefix: string;
  }): Promise<ApiKeyRecord>;

  listApiKeys(workspaceId: string): Promise<ApiKeyRecord[]>;

  revokeApiKey(input: { apiKeyId: string; workspaceId: string }): Promise<void>;

  findByHash(keyHash: string): Promise<VerifiedApiKey | null>;

  updateLastUsed(apiKeyId: string): Promise<void>;
}
