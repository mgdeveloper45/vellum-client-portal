"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prismaUserWorkspaceRepository } from "@/lib/repositories/prisma-user-workspace-repository";
import { createInvoiceCheckoutService } from "@/lib/services/payments/composition/payment-services";

export async function createInvoiceCheckoutAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const invoiceId = String(formData.get("invoiceId") ?? "").trim();

  if (!invoiceId) {
    return;
  }

  const workspaceId =
    await prismaUserWorkspaceRepository.findWorkspaceIdByUserId(
      session.user.id,
    );

  if (!workspaceId) {
    return;
  }

  const result = await createInvoiceCheckoutService.execute({
    invoiceId,
    workspaceId,
  });

  if (!result.success) {
    return;
  }

  redirect(result.checkoutUrl);
}
