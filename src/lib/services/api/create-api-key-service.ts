import type { ApiKeyRepository } from "./api-key-repository";
import {
  generateRawApiKey,
  getApiKeyPrefix,
  hashApiKey,
} from "./api-key-crypto";

export class CreateApiKeyService {
  constructor(private readonly repository: ApiKeyRepository) {}

  async execute(input: { name: string; workspaceId: string }) {
    const rawKey = generateRawApiKey();

    const apiKey = await this.repository.createApiKey({
      name: input.name,
      workspaceId: input.workspaceId,
      keyHash: hashApiKey(rawKey),
      keyPrefix: getApiKeyPrefix(rawKey),
    });

    return {
      apiKey,
      rawKey,
    };
  }
}
