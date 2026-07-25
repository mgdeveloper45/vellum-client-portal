import { prismaNotificationRepository } from "../prisma-notification-repository";
import { MarkNotificationReadService } from "../mark-notification-read-service";

export const markNotificationReadService = new MarkNotificationReadService(
  prismaNotificationRepository,
);
