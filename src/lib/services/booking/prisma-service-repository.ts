import { prisma } from "@/lib/prisma";
import type { BookableService, ServiceRepository } from "./service-repository";

export class PrismaServiceRepository implements ServiceRepository {
  async findActiveService(
    serviceId: string,
    workspaceId: string,
  ): Promise<BookableService | null> {
    return prisma.service.findFirst({
      where: {
        id: serviceId,
        workspaceId,
        active: true,
      },
      select: {
        id: true,
        workspaceId: true,
        name: true,
        duration: true,
        price: true,
      },
    });
  }
}

export const prismaServiceRepository = new PrismaServiceRepository();
