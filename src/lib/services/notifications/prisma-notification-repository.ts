import { prisma } from "@/lib/prisma";

import type { NotificationRepository } from "./notification-repository";

export const prismaNotificationRepository: NotificationRepository = {
  async markRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  },
};
