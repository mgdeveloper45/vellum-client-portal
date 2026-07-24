import type { ApiKeyRepository } from "./api-key-repository";

export class RevokeApiKeyService {
  constructor(private readonly repository: ApiKeyRepository) {}

  async execute(input: { apiKeyId: string; workspaceId: string }) {
    await this.repository.revokeApiKey(input);
  }
}
