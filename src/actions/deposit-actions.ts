"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { requestDepositService } from "@/lib/services/deposits/composition/deposit-services";
import { requestDepositSchema } from "@/lib/validation/deposit";

export async function requestDepositAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const input = requestDepositSchema.parse({
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
  });

  const result = await requestDepositService(input);

  if (!result.success) {
    return;
  }

  revalidatePath(`/projects/${input.projectId}`);
}
