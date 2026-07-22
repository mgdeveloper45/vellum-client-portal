import { prisma } from "@/lib/prisma";
import type {
  CreatedServiceRecord,
  CreateServiceRecordInput,
  ServiceRepository,
  ToggleServiceActiveRecordInput,
} from "./service-repository";

export class PrismaServiceRepository implements ServiceRepository {
  async create(input: CreateServiceRecordInput): Promise<CreatedServiceRecord> {
    return prisma.service.create({
      data: {
        name: input.name,
        description: input.description,
        duration: input.duration,
        price: input.price,
        workspaceId: input.workspaceId,
      },
      select: {
        id: true,
      },
    });
  }

  async toggleActive(input: ToggleServiceActiveRecordInput): Promise<boolean> {
    const result = await prisma.service.updateMany({
      where: {
        id: input.serviceId,
        workspaceId: input.workspaceId,
      },
      data: {
        active: !input.active,
      },
    });

    return result.count > 0;
  }
}

export const prismaServiceRepository = new PrismaServiceRepository();
