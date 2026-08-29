"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { recordDepositPaymentService } from "@/lib/services/deposit-payments/composition/deposit-payment-services";
import { recordDepositPaymentSchema } from "@/lib/validation/deposit-payment";

export async function recordDepositPaymentAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const input = recordDepositPaymentSchema.parse({
    depositId: formData.get("depositId"),

    operationKey: formData.get("operationKey"),

    amount: formData.get("amount"),

    paymentMethod: formData.get("paymentMethod"),

    notes: formData.get("notes"),
  });

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await recordDepositPaymentService({
    workspaceId,
    ...input,
  });

  if (!result.success) {
    return;
  }

  revalidatePath("/projects");
}
