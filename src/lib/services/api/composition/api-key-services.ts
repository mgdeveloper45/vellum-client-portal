import { CreateApiKeyService } from "../create-api-key-service";
import { ListApiKeysService } from "../list-api-keys-service";
import { PrismaApiKeyRepository } from "../prisma-api-key-repository";
import { RevokeApiKeyService } from "../revoke-api-key-service";
import { VerifyApiKeyService } from "../verify-api-key-service";

const repository = new PrismaApiKeyRepository();

export const createApiKeyService = new CreateApiKeyService(repository);

export const revokeApiKeyService = new RevokeApiKeyService(repository);

export const listApiKeysService = new ListApiKeysService(repository);

export const verifyApiKeyService = new VerifyApiKeyService(repository);
