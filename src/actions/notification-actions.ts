"use server";

import { redirect } from "next/navigation";

import { markNotificationReadService } from "@/lib/services/notifications/composition/notification-services";

export async function markNotificationReadAction(formData: FormData) {
  const notificationId = String(formData.get("notificationId") ?? "").trim();

  if (!notificationId) {
    return;
  }

  await markNotificationReadService.execute(notificationId);

  redirect("/notifications");
}
