import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateRawApiKey() {
  return `vellum_${crypto.randomBytes(32).toString("hex")}`;
}

export function getApiKeyPrefix(key: string) {
  return key.slice(0, 14);
}

export async function createApiKey({
  name,
  workspaceId,
}: {
  name: string;
  workspaceId: string;
}) {
  const rawKey = generateRawApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      workspaceId,
      keyHash: hashApiKey(rawKey),
      keyPrefix: getApiKeyPrefix(rawKey),
    },
  });

  return {
    apiKey,
    rawKey,
  };
}

export async function listApiKeys(workspaceId: string) {
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

export async function revokeApiKey({
  apiKeyId,
  workspaceId,
}: {
  apiKeyId: string;
  workspaceId: string;
}) {
  return prisma.apiKey.update({
    where: {
      id: apiKeyId,
      workspaceId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function verifyApiKey(rawKey: string) {
  const keyHash = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      keyHash,
    },
    include: {
      workspace: true,
    },
  });

  if (!apiKey || apiKey.revokedAt) {
    return null;
  }

  await prisma.apiKey.update({
    where: {
      id: apiKey.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return apiKey;
}
