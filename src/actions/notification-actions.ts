"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(formData: FormData) {
  const notificationId = String(formData.get("notificationId"));

  await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });

  redirect("/notifications");
}
