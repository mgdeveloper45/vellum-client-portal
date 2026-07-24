import type { ApiKeyRepository } from "./api-key-repository";

export class ListApiKeysService {
  constructor(private readonly repository: ApiKeyRepository) {}

  async execute(workspaceId: string) {
    return this.repository.listApiKeys(workspaceId);
  }
}
