export interface NotificationRepository {
  markRead(notificationId: string): Promise<void>;
}
