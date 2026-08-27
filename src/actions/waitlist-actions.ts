"use server";

import { redirect } from "next/navigation";

import { joinWaitlistService } from "@/lib/services/waitlist/composition/waitlist-services";

function formString(
  formData: FormData,
  key: string,
): string | undefined {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

export async function joinWaitlistAction(
  formData: FormData,
) {
  const slug = formString(formData, "slug");
  const workspaceId = formString(formData, "workspaceId");
  const serviceId = formString(formData, "serviceId");
  const requestedDate = formString(
    formData,
    "requestedDate",
  );

  if (
    !slug ||
    !workspaceId ||
    !serviceId ||
    !requestedDate
  ) {
    return;
  }

  const result = await joinWaitlistService.execute({
    workspaceId,
    serviceId,
    customerName:
      formString(formData, "customerName") ?? "",
    customerEmail:
      formString(formData, "customerEmail") ?? "",
    customerPhone: formString(
      formData,
      "customerPhone",
    ),
    notes: formString(formData, "notes"),
    requestedDate,
    preferredStartTime: formString(
      formData,
      "preferredStartTime",
    ),
    preferredEndTime: formString(
      formData,
      "preferredEndTime",
    ),
  });

  const params = new URLSearchParams({
    serviceId,
    date: requestedDate,
  });

  if (result.ok) {
    params.set("waitlist", "joined");
  } else {
    params.set("waitlist", "error");
    params.set("waitlistError", result.error);
  }

  redirect(`/book/${slug}?${params.toString()}`);
}
