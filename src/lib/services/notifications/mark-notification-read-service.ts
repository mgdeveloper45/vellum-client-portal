import type { NotificationRepository } from "./notification-repository";

export class MarkNotificationReadService {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    await this.repository.markRead(notificationId);
  }
}
