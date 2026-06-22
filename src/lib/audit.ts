import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type CreateAuditLogParams = {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createAuditLog({
  action,
  entity,
  entityId,
  userId,
  metadata,
}: CreateAuditLogParams) {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      metadata,
    },
  });
}
