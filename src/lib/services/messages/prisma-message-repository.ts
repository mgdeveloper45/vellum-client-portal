import { prisma } from "@/lib/prisma";

import type {
  CreateMessageNotificationInput,
  CreateMessageRecordInput,
  CreatedMessageRecord,
  FindAccessibleMessageProjectInput,
  FindMessageSenderInput,
  FindRecentMessagesInput,
  MessageProjectRecord,
  MessageRepository,
  MessageSenderRecord,
  RecentMessageRecord,
} from "./message-repository";

export const prismaMessageRepository: MessageRepository = {
  async findSender({
    userId,
    workspaceId,
  }: FindMessageSenderInput): Promise<MessageSenderRecord | null> {
    return prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        workspaceId: true,
      },
    });
  },

  async findAccessibleProject({
    projectId,
    workspaceId,
    viewerUserId,
    canManageProjects,
  }: FindAccessibleMessageProjectInput): Promise<MessageProjectRecord | null> {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
        ...(canManageProjects
          ? {}
          : {
              clientId: viewerUserId,
            }),
      },
      select: {
        id: true,
        name: true,
        workspaceId: true,
        clientId: true,
        ownerId: true,

        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  async create(input: CreateMessageRecordInput): Promise<CreatedMessageRecord> {
    return prisma.message.create({
      data: {
        projectId: input.projectId,
        senderId: input.senderId,
        content: input.content,
      },
      select: {
        id: true,
        projectId: true,
        senderId: true,
        content: true,
        createdAt: true,
      },
    });
  },

  async createNotification(
    input: CreateMessageNotificationInput,
  ): Promise<void> {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: "New project message",
        message: input.preview,
        type: "MESSAGE",
        href: `/projects/${input.projectId}`,
      },
    });
  },

  async findRecent({
    workspaceId,
    clientId,
    limit,
  }: FindRecentMessagesInput): Promise<RecentMessageRecord[]> {
    return prisma.message.findMany({
      where: {
        project: {
          workspaceId,
          ...(clientId
            ? {
                clientId,
              }
            : {}),
        },
      },
      select: {
        id: true,
        projectId: true,
        content: true,
        createdAt: true,

        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        project: {
          select: {
            id: true,
            name: true,

            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },
};
