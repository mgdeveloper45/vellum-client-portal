import { prisma } from "@/lib/prisma";

import type {
  CancelWaitlistEntryInput,
  ClaimNextWaitlistEntryInput,
  CreateWaitlistEntryRecordInput,
  FindActiveWaitlistEntryInput,
  ListWaitlistEntriesInput,
  ReleaseWaitlistClaimInput,
  WaitlistEntryRecord,
  WaitlistRepository,
} from "./waitlist-repository";

const waitlistSelect = {
  id: true,
  workspaceId: true,
  serviceId: true,

  customerName: true,
  customerEmail: true,
  customerPhone: true,
  notes: true,

  requestedDate: true,
  preferredStartTime: true,
  preferredEndTime: true,

  status: true,

  notifiedAt: true,
  bookedAt: true,
  expiresAt: true,

  createdAt: true,
  updatedAt: true,
} as const;

export class PrismaWaitlistRepository implements WaitlistRepository {
  async releaseClaim(input: ReleaseWaitlistClaimInput): Promise<boolean> {
    const result = await prisma.waitlistEntry.updateMany({
      where: {
        id: input.waitlistEntryId,
        workspaceId: input.workspaceId,
        status: "NOTIFIED",
      },
      data: {
        status: "WAITING",
        notifiedAt: null,
        expiresAt: null,
      },
    });

    return result.count === 1;
  }

  async findActiveDuplicate(
    input: FindActiveWaitlistEntryInput,
  ): Promise<WaitlistEntryRecord | null> {
    return prisma.waitlistEntry.findFirst({
      where: {
        workspaceId: input.workspaceId,
        serviceId: input.serviceId,
        customerEmail: input.customerEmail,
        requestedDate: input.requestedDate,
        status: {
          in: ["WAITING", "NOTIFIED"],
        },
      },
      select: waitlistSelect,
    });
  }

  async create(
    input: CreateWaitlistEntryRecordInput,
  ): Promise<WaitlistEntryRecord> {
    return prisma.waitlistEntry.create({
      data: {
        workspaceId: input.workspaceId,
        serviceId: input.serviceId,

        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        notes: input.notes,

        requestedDate: input.requestedDate,
        preferredStartTime: input.preferredStartTime,
        preferredEndTime: input.preferredEndTime,
      },
      select: waitlistSelect,
    });
  }

  async list(input: ListWaitlistEntriesInput): Promise<WaitlistEntryRecord[]> {
    return prisma.waitlistEntry.findMany({
      where: {
        workspaceId: input.workspaceId,

        ...(input.serviceId
          ? {
              serviceId: input.serviceId,
            }
          : {}),

        ...(input.status
          ? {
              status: input.status,
            }
          : {}),
      },
      select: waitlistSelect,
      orderBy: [
        {
          requestedDate: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });
  }

  async claimNextEligible(
    input: ClaimNextWaitlistEntryInput,
  ): Promise<WaitlistEntryRecord | null> {
    return prisma.$transaction(async (transaction) => {
      const candidates = await transaction.waitlistEntry.findMany({
        where: {
          workspaceId: input.workspaceId,
          serviceId: input.serviceId,
          requestedDate: input.requestedDate,
          status: "WAITING",

          AND: [
            {
              OR: [
                {
                  preferredStartTime: null,
                },
                {
                  preferredStartTime: {
                    lte: input.availableStartTime,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  preferredEndTime: null,
                },
                {
                  preferredEndTime: {
                    gt: input.availableStartTime,
                  },
                },
              ],
            },
          ],
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],

        select: {
          id: true,
        },
      });

      for (const candidate of candidates) {
        const claimed = await transaction.waitlistEntry.updateMany({
          where: {
            id: candidate.id,
            status: "WAITING",
          },

          data: {
            status: "NOTIFIED",
            notifiedAt: input.notifiedAt,
            expiresAt: input.expiresAt,
          },
        });

        if (claimed.count !== 1) {
          continue;
        }

        return transaction.waitlistEntry.findUnique({
          where: {
            id: candidate.id,
          },
          select: waitlistSelect,
        });
      }

      return null;
    });
  }

  async cancel(input: CancelWaitlistEntryInput): Promise<boolean> {
    const result = await prisma.waitlistEntry.updateMany({
      where: {
        id: input.waitlistEntryId,
        workspaceId: input.workspaceId,
        status: {
          in: ["WAITING", "NOTIFIED"],
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    return result.count > 0;
  }
}

export const prismaWaitlistRepository = new PrismaWaitlistRepository();
