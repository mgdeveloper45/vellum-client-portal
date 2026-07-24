import { prisma } from "@/lib/prisma";
import type {
  ApiKeyRepository,
  ApiKeyRecord,
  VerifiedApiKey,
} from "./api-key-repository";

export class PrismaApiKeyRepository implements ApiKeyRepository {
  async createApiKey(input: {
    name: string;
    workspaceId: string;
    keyHash: string;
    keyPrefix: string;
  }): Promise<ApiKeyRecord> {
    return prisma.apiKey.create({
      data: {
        name: input.name,
        workspaceId: input.workspaceId,
        keyHash: input.keyHash,
        keyPrefix: input.keyPrefix,
      },
    });
  }

  async listApiKeys(workspaceId: string): Promise<ApiKeyRecord[]> {
    return prisma.apiKey.findMany({
      where: {
        workspaceId,
        revokedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async revokeApiKey(input: {
    apiKeyId: string;
    workspaceId: string;
  }): Promise<void> {
    await prisma.apiKey.update({
      where: {
        id: input.apiKeyId,
        workspaceId: input.workspaceId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async findByHash(keyHash: string): Promise<VerifiedApiKey | null> {
    return prisma.apiKey.findUnique({
      where: {
        keyHash,
      },
      include: {
        workspace: true,
      },
    });
  }

  async updateLastUsed(apiKeyId: string): Promise<void> {
    await prisma.apiKey.update({
      where: {
        id: apiKeyId,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });
  }
}

export const prismaApiKeyRepository = new PrismaApiKeyRepository();
