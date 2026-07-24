import type { ApiKeyRepository } from "./api-key-repository";
import { hashApiKey } from "./api-key-crypto";

export class VerifyApiKeyService {
  constructor(private readonly repository: ApiKeyRepository) {}

  async execute(rawKey: string) {
    const apiKey = await this.repository.findByHash(hashApiKey(rawKey));

    if (!apiKey || apiKey.revokedAt) {
      return null;
    }

    await this.repository.updateLastUsed(apiKey.id);

    return apiKey;
  }
}
